import { useLoginInfo } from "@/entities/auth/queries";
import { getPresignedUrls, uploadAllImages } from "@/entities/review/api";
import { ImageFile, PatchReviewRequest, ReviewPhoto } from "@/entities/review/model";
import { usePatchReview } from "@/entities/review/queries";
import { convertToWebP, isSuccessResponse } from "@/shared/lib";
import { useReviewStore } from "@/shared/stores";
import { customToast } from "@/shared/ui/CustomToast";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";


interface Menu {
  recommendedMenuId: number;
  recommendedMenuName: string;
}

const useReviewModify = () => {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const { userInfo } = useLoginInfo();

  const reviewData = useReviewStore((state) => state.reviewData);
  const clearReviewData = useReviewStore((state) => state.clearReviewData);

  const [content, setContent] = useState<string>(reviewData?.reviewContent ?? "");
  const [prevImages, setPrevImages] = useState<ReviewPhoto[]>([]);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [menu, setMenu] = useState<string>("");
  const [menuList, setMenuList] = useState<Menu[]>(reviewData?.recommendedMenuList ?? []);
  const [selectedPrice, setSelectedPrice] = useState<number>(reviewData?.reviewPriceRange ?? -1);

  const menuIndex = useRef<number>(-1);
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

  const patchReviewMutation = usePatchReview();

  useEffect(() => {
    if(!reviewData) return;

    setPrevImages(reviewData.reviewPhotoList);

  },[reviewData, setPrevImages])

  useEffect(() => {

    if(!reviewData?.recommendedMenuList) return;

    menuIndex.current = reviewData.recommendedMenuList[reviewData.recommendedMenuList.length - 1].recommendedMenuId;

  },[reviewData?.recommendedMenuList])

  const removePrevImage = (imageId: number): void => {
    setPrevImages(prev => prev.filter(img => img.reviewPhotoId !== imageId));
  };

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if(e.key === "Enter"){
      e.preventDefault();
    }
  }
  

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if(reviewData?.reviewId == null){
      console.log("장소 정보가 없습니다.")
      return;
    }

    const loadingToastId = customToast.loading("글 수정 중...");

    try {    
      const response = await getPresignedUrls({imageFiles: images});
      const data = await response;

      const uploadResponse = await uploadAllImages(images, data);
      await uploadResponse;

      const patchData: PatchReviewRequest = {
        content,
        recommendedMenus: menuList.map((menu) => menu.recommendedMenuName),
        prevImages: prevImages.map((item) => item.reviewPhotoS3Key),
        newImages: data.map((item) => {
          if(isSuccessResponse(item)){
            return item.data.s3Key
          }else{
            return ""
          }
        }),
        priceRange: selectedPrice,
      }

      patchReviewMutation.mutate({reviewId:reviewData?.reviewId, data: patchData}, {
        onSuccess: (response) => {
          toast.dismiss(loadingToastId);
          if(isSuccessResponse(response)){
            customToast.success("리뷰 수정을 완료했습니다.");
            queryClient.invalidateQueries({queryKey: ["taste-map-thumbnail", params.placeId, userInfo?.userId]});
            // 폼 초기화
            setContent('');
            setImages([]);
            router.push("/home");
          }else{
            customToast.error("리뷰 수정에 실패했습니다.");
          } 
        },
        onError: (error) => {
          toast.dismiss(loadingToastId);
          console.log(error);
          customToast.error(error?.message || "리뷰 수정 중 오류가 발생했습니다.");
        }
      })
      
    } catch (error) {
      toast.dismiss(loadingToastId);
      customToast.error("리뷰 수정에 실패했습니다.");
      console.error('글 등록 오류:', error);
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

  const addMenuInput = () => {
    menuIndex.current += 1;
    console.log(menuIndex.current);
    const newInput:Menu = {
      recommendedMenuId: menuIndex.current,
      recommendedMenuName: ''
    };
    setMenuList([...menuList, newInput]);
  };

  const removeMenuInput = (id: number) => {
    if (menuList.length > 1) {
      setMenuList(menuList.filter(input => input.recommendedMenuId !== id));
    }
  };

  const updateMenuInput = (id: number, value: string) => {
    setMenuList(menuList.map(input => 
      input.recommendedMenuId === id ? { ...input, recommendedMenuName: value } : input
    ));
  };
  
  return {
    reviewData,
    content,
    images,
    menu,
    menuList,
    selectedPrice,
    isSubmitting : patchReviewMutation.isPending,
    fileInputRef,
    priceOptions,
    prevImages,
    removePrevImage,
    setContent,
    setImages,
    setMenu,
    setMenuList,
    setSelectedPrice,
    clearReviewData,
    handleImageUpload,
    handleFileInputClick,
    handlePriceSelect,
    handleSubmit,
    handleKeyDown,
    removeImage,
    addMenuInput,
    removeMenuInput,
    updateMenuInput,
  }
}

export default useReviewModify;