"use client";

import { getPresignedUrls, uploadAllImages } from "@/entities/review/api";
import postReviewAPI from "@/entities/review/api/postReviewAPI";
import { ImageFile, ReviewRequest } from "@/entities/review/model";
import { convertToWebP, isSuccessResponse } from "@/shared/lib";
import { usePlaceStore } from "@/shared/stores";
import { customToast } from "@/shared/ui/CustomToast";
import { ChangeEvent, FormEvent, useRef, useState } from "react";



interface Menu {
  id: number;
  name: string;
}

const useReviewForm = () => {
  const [content, setContent] = useState<string>('');
  const [images, setImages] = useState<ImageFile[]>([]);
  const [menu, setMenu] = useState<string>("");
  const [menuList, setMenuList] = useState<Menu[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedPlace = usePlaceStore((state) => state.selectedPlace);
  const priceOptions = [
    { id: 1, label: '~5,000원' },
    { id: 2, label: '~10,000원' },
    { id: 3, label: '~15,000원' },
    { id: 4, label: '~20,000원' },
    { id: 5, label: '~30,000원' },
    { id: 6, label: '~50,000원'},
    { id: 7, label: '~100,000원' },
    { id: 8, label: '100,000원 이상' },
  ]

  const [selectedPrice, setSelectedPrice] = useState<number>(-1);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = Array.from(e.target.files || []);
    
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        try {
          // 이미지를 WebP로 변환 (품질 1.0 = 100% 최고 품질)
          const webpFile = await convertToWebP(file, 1.0);
          
          // 변환된 WebP 파일의 미리보기 생성
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            const result = e.target?.result;
            if (typeof result === 'string') {
              const newImage: ImageFile = {
                id: Date.now() + Math.random(),
                file: webpFile, // 변환된 WebP 파일 사용
                preview: result,
                name: webpFile.name
              };
              setImages(prev => [...prev, newImage]);
            }
          };
          reader.readAsDataURL(webpFile);
        } catch (error) {
          console.error('이미지 변환 오류:', error);
          alert(`${file.name} 파일 변환에 실패했습니다.`);
        }
      }
    }
    
    // 파일 입력 초기화
    e.target.value = '';
  };

  const removeImage = (imageId: number): void => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  // const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
  //   e.preventDefault();
  //   e.stopPropagation();
  // };

  // const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
  //   e.preventDefault();
  //   e.stopPropagation();
    
  //   const files = Array.from(e.dataTransfer.files);
  //   const imageFiles = files.filter((file: File) => file.type.startsWith('image/'));
    
  //   if (imageFiles.length > 0) {
  //     const syntheticEvent = {
  //       target: { files: imageFiles }
  //     } as ChangeEvent<HTMLInputElement>;
  //     handleImageUpload(syntheticEvent);
  //   }
  // };

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
    removeMenu
  }
}

export default useReviewForm;