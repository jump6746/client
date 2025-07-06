
import { deleteReviewAPI, getPresignedUrls, patchReviewAPI, uploadAllImages } from "@/entities/review/api";
import { ImageFile, PatchReviewRequest } from "@/entities/review/model";
import { convertToWebP, isSuccessResponse } from "@/shared/lib";
import { useReviewStore } from "@/shared/stores";
import { customToast } from "@/shared/ui/CustomToast";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";


interface Menu {
  recommendedMenuId: number;
  recommendedMenuName: string;
}

const useReviewModify = ({reviewId}:{reviewId?: number}) => {
  const router = useRouter();
  const reviewData = useReviewStore((state) => state.reviewData);
  const clearReviewData = useReviewStore((state) => state.clearReviewData);
  const [content, setContent] = useState<string>(reviewData?.reviewContent ?? "");
  const [images, setImages] = useState<ImageFile[]>([]);
  const [menu, setMenu] = useState<string>("");
  const [menuList, setMenuList] = useState<Menu[]>(reviewData?.recommendedMenuList ?? []);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedPrice, setSelectedPrice] = useState<number>(reviewData?.reviewPriceRange ?? -1);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleDeleteReview = async () => {

    if(!reviewId) return;

    try{
      const response = await deleteReviewAPI({reviewId});

      if(isSuccessResponse(response)){
        customToast.success("리뷰 삭제에 성공했습니다.");
      }else{
        customToast.error(response.message);
      }

    }catch(error){
      console.error(error);
      customToast.error(error instanceof Error ? error.message : "리뷰 삭제에 서버 에러가 발생했습니다.");
    }
  }

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

    if(reviewData?.reviewId == null){
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

      const patchData: PatchReviewRequest = {
        content,
        recommendedMenus: menuList.map((menu) => menu.recommendedMenuName),
        photos: data.map((item) => {
          if(isSuccessResponse(item)){
            return item.data.s3Key
          }else{
            return ""
          }
        }),
        priceRange: selectedPrice,
      }
      
      const postResponse = await patchReviewAPI({reviewId:reviewData?.reviewId, data: patchData})


      if(isSuccessResponse(postResponse)){
        customToast.success("리뷰 수정을 완료했습니다.");
      }else{
        customToast.error("리뷰 수정에 실패했습니다.");
      }
      // 폼 초기화
      setContent('');
      setImages([]);
      router.push("/home");
    } catch (error) {
      customToast.error("리뷰 수정에 실패했습니다.");
      console.error('글 등록 오류:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileInputClick = (): void => {
    fileInputRef.current?.click();
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
      recommendedMenuId: Date.now(),
      recommendedMenuName: menu.trim()
    };

    setMenuList(prev => [...prev, newMenu]);
    setMenu(''); // 입력 필드 초기화
  };

  const removeMenu = (id: number) => {
    setMenuList(prev => prev.filter(menu => menu.recommendedMenuId !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addMenu();
    }
  };

  
  return {
    reviewData,
    content,
    images,
    menu,
    menuList,
    selectedPrice,
    isSubmitting,
    fileInputRef,
    priceOptions,
    setContent,
    setImages,
    setMenu,
    setMenuList,
    setIsSubmitting,
    setSelectedPrice,
    clearReviewData,
    handleDeleteReview,
    handleImageUpload,
    handleFileInputClick,
    handleKeyPress,
    handlePriceSelect,
    handleSubmit,
    removeImage,
    removeMenu,
    addMenu,
  }
}

export default useReviewModify;