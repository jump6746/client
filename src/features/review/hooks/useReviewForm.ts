"use client";

import { getPresignedUrls, uploadAllImages } from "@/entities/review/api";
import postReviewAPI from "@/entities/review/api/postReviewAPI";
import { ImageFile, ReviewRequest } from "@/entities/review/model";
import { convertToWebP, isSuccessResponse } from "@/shared/lib";
import { usePlaceStore } from "@/shared/stores";
import { customToast } from "@/shared/ui/CustomToast";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useRef, useState, useEffect } from "react";

interface Menu {
  id: number;
  name: string;
}

const useReviewForm = () => {
  const router = useRouter();
  const [content, setContent] = useState<string>('');
  const [images, setImages] = useState<ImageFile[]>([]);
  const [menu, setMenu] = useState<string>("");
  const [menuList, setMenuList] = useState<Menu[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedPlace = usePlaceStore((state) => state.selectedPlace);
  const priceOptions = [
    { id: 5000, label: '~5,000원' },
    { id: 10000, label: '~10,000원' },
    { id: 15000, label: '~15,000원' },
    { id: 20000, label: '~20,000원' },
    { id: 30000, label: '~30,000원' },
    { id: 50000, label: '~50,000원'},
    { id: 100000, label: '~100,000원' },
    { id: 200000, label: '100,000원 이상' },
  ]

  const [selectedPrice, setSelectedPrice] = useState<number>(-1);

  // 공통 이미지 처리 함수
  const processImages = async (files: File[]): Promise<void> => {
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        try {
          const webpFile = await convertToWebP(file, 1.0);
        
          // FileReader를 Promise로 감싸서 순차 처리
          const preview = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const result = e.target?.result;
              if (typeof result === 'string') {
                resolve(result);
              } else {
                reject(new Error('파일 읽기 실패'));
              }
            };
            reader.onerror = reject;
            reader.readAsDataURL(webpFile);
          });

          const newImage: ImageFile = {
            id: Date.now() + Math.random(),
            file: webpFile,
            preview,
            name: webpFile.name || 'clipboard-image.webp'
          };
        
          setImages(prev => [...prev, newImage]);
        } catch (error) {
          console.error('이미지 변환 오류:', error);
          alert(`${file.name || '클립보드 이미지'} 파일 변환에 실패했습니다.`);
        }
      }
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = Array.from(e.target.files || []);
    await processImages(files);
    
    // 파일 입력 초기화
    e.target.value = '';
  };

  // 클립보드 붙여넣기 핸들러
  const handlePaste = async (e: ClipboardEvent): Promise<void> => {
    const items = e.clipboardData?.items;
    
    if (items) {
      const files: File[] = [];
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }
      
      if (files.length > 0) {
        await processImages(files);
        customToast.success(`${files.length}개의 이미지가 클립보드에서 추가되었습니다!`);
      }
    }
  };

  // 클립보드 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const removeImage = (imageId: number): void => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    if(selectedPlace == null){
      console.log("장소 정보가 없습니다.")
      return;
    }
    
    try {
      // 여기서 실제 API 호출을 수행
      console.log('내용:', content);
      console.log('이미지 개수:', images.length);
      
      const response = await getPresignedUrls({imageFiles: images});
      
      const data = await response;

      console.log("presigned url 입력 성공", data);

      const uploadResponse = await uploadAllImages(images, data);
      
      const uplaodData = await uploadResponse;

      console.log("이미지 업로드 성공", uplaodData);

      const reviewData:ReviewRequest = {
        place: {
          placeId: selectedPlace.id,
          title: selectedPlace.place_name,
          address: selectedPlace.address_name ?? "",
          roadAddress: selectedPlace.road_address_name,
          placeUrl: selectedPlace.place_url,
          category:selectedPlace.category_name ?? "",
          telePhone: selectedPlace.phone ?? "",
          mapx: selectedPlace.x,
          mapy: selectedPlace.y,
        },
        photos: data.map(item => {
          if(isSuccessResponse(item)){
            return item.data.s3Key;
          }else {
            return "";
          }
        }),
        content: content,
        recommendedMenus: menuList.map(menu => menu.name),
        priceRange: selectedPrice,
        tasteMapId: 1,
      }
      
      const postResponse = await postReviewAPI({data: reviewData});

      const postData = await postResponse;

      console.log(postData);

      customToast.success("글이 성공적으로 등록됐습니다!");

      // 폼 초기화
      setContent('');
      setImages([]);
      router.push("/home");
    } catch (error) {
      console.error('글 등록 오류:', error);
      customToast.error('글 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileInputClick = (): void => {
    fileInputRef.current?.click();
  };

  const isFormValid = (): boolean => {
    return content.trim().length > 0;
  };

  const handlePriceSelect = (priceValue: number) => {
    if(Number.isNaN(priceValue)){
      return;
    }

    setSelectedPrice(priceValue);
    console.log('선택된 가격대 id:', priceValue);
  };

  const addMenu = () => {
    if (menu.trim() === '') {
      alert('메뉴 이름을 입력해주세요!');
      return;
    }

    const newMenu: Menu = {
      id: Date.now(),
      name: menu.trim()
    };

    setMenuList(prev => [...prev, newMenu]);
    setMenu(''); // 입력 필드 초기화
  };

  const removeMenu = (id: number) => {
    setMenuList(prev => prev.filter(menu => menu.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addMenu();
    }
  };

  return {
    content,
    images,
    isSubmitting,
    fileInputRef,
    priceOptions,
    selectedPrice,
    menu,
    menuList,
    setMenu,
    setContent,
    setImages,
    setIsSubmitting,
    handleImageUpload,
    removeImage,
    handleSubmit,
    handleFileInputClick,
    isFormValid,
    setSelectedPrice,
    handlePriceSelect,
    addMenu,
    handleKeyPress,
    removeMenu,
    // 새로 추가된 함수들
    handlePaste,
    processImages
  }
}

export default useReviewForm;