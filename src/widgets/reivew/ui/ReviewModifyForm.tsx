"use client";

import { useReviewModify } from "@/features/review/hooks";
import { Button } from "@/shared/ui/Button";
import { Carousel, CarouselContent, CarouselItem } from "@/shared/ui/Carousel";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ReviewModifyForm = () => {
  const router = useRouter();
  const {
    reviewData,
    content,
    images,
    menuList,
    selectedPrice,
    isSubmitting,
    fileInputRef,
    priceOptions,
    prevImages,
    removePrevImage,
    setContent,
    // setMenuList,
    // setSelectedPrice,
    clearReviewData,
    handleImageUpload,
    handleKeyDown,
    // handleFileInputClick,
    handlePriceSelect,
    handleSubmit,
    removeImage,
    addMenuInput,
    removeMenuInput,
    updateMenuInput,
  } = useReviewModify();

  if (!reviewData) return;

  return (
    <form
      action=""
      className="flex flex-col w-full h-full gap-5 p-4 overflow-auto"
      onSubmit={handleSubmit}
    >
      {/* 버튼란 */}
      <div className="w-full flex justify-between">
        <Button
          type="button"
          onClick={() => {
            clearReviewData();
            router.push("/home");
          }}
        >
          취소
        </Button>
        <Button
          type="submit"
          className="px-2 py-0.5 bg-brand-primary-600 text-white rounded-lg disabled:bg-gray-200 disabled:text-gray-400"
          disabled={isSubmitting}
        >
          수정
        </Button>
      </div>
      {/* 가게 정보 */}
      <div className="flex gap-3 items-center">
        <span>{reviewData.placeGroupName}</span>
        <div className="flex flex-col">
          <span className="font-bold text-lg">{reviewData.placeName}</span>
          <span className="text-sm">{reviewData.placeAddressName}</span>
        </div>
      </div>
      {/* 이미지 업로드 */}
      <Carousel>
        <CarouselContent className="pl-4">
          {prevImages.map((image) => (
            <CarouselItem
              key={image.reviewPhotoId}
              className="w-25 h-25 rounded-2xl overflow-hidden relative"
            >
              <Image
                src={image.reviewPhotoUrl}
                alt={"리뷰"}
                width={100}
                height={100}
                loading="lazy"
                className="object-cover w-full h-full"
              />
              <button
                type="button"
                onClick={() => {
                  removePrevImage(image.reviewPhotoId);
                }}
                className="absolute w-4 h-4 bg-white flex justify-center items-center top-1.5 right-1.5 cursor-pointer rounded-full opacity-80"
              >
                <Image
                  src="/icons/close_small.svg"
                  alt="닫기"
                  width={8}
                  height={8}
                />
              </button>
            </CarouselItem>
          ))}
          {/* 이미지 프리뷰 */}
          {images.map((image) => (
            <CarouselItem
              key={image.id}
              className="w-25 h-25 rounded-2xl overflow-hidden relative"
            >
              <Image
                src={image.preview}
                alt={image.name}
                width={100}
                height={100}
                loading="lazy"
                className="object-cover w-full h-full"
              />
              <button
                type="button"
                onClick={() => {
                  removeImage(image.id);
                }}
                className="absolute w-4 h-4 bg-white flex justify-center items-center top-1.5 right-1.5 cursor-pointer rounded-full opacity-80"
              >
                <Image
                  src="/icons/close_small.svg"
                  alt="닫기"
                  width={8}
                  height={8}
                />
              </button>
            </CarouselItem>
          ))}
          <CarouselItem>
            <label
              htmlFor="file"
              className="w-25 h-25 rounded-2xl border cursor-pointer border-brand-primary-600 flex flex-col gap-1 items-center justify-center"
            >
              <Image
                src="/icons/photo_camera.svg"
                alt="사진 추가"
                width={20}
                height={18}
                className="text-brand-primary-600"
              />
              <span className="text-xs text-brand-primary-600 font-semibold">
                사진 추가하기
              </span>
            </label>
            <input
              id="file"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              ref={fileInputRef}
            />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
      <div>
        <label htmlFor="content"></label>
        <textarea
          id="content"
          placeholder="맛집이라 생각하는 이유를 적어주세요!"
          className="w-full border rounded-xl border-gray-200 p-3 h-45"
          value={content}
          onChange={(e) => {
            setContent(e.currentTarget.value);
          }}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-2xl">추천 메뉴</h3>
        <span>메뉴 이름</span>
        {menuList.map((menuItem, index) => (
          <div
            key={menuItem.recommendedMenuId}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={menuItem.recommendedMenuName}
              onChange={(e) => {
                updateMenuInput(
                  menuItem.recommendedMenuId,
                  e.currentTarget.value
                );
              }}
              onKeyDown={handleKeyDown}
              placeholder={index > 0 ? `메뉴 이름` : "예) 된장찌개"}
              className="border-2 rounded-lg placeholder:font-semibold border-gray-200 w-fit px-2 py-2"
            />
            {menuList.length > 1 && (
              <button
                type="button"
                onClick={() => removeMenuInput(menuItem.recommendedMenuId)}
                className="text-red-500 w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          className="flex items-center gap-1"
          onClick={addMenuInput}
          type="button"
        >
          <div className="text-gray-600 font-semibold bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center">
            +
          </div>
          <span className="text-gray-400 font-semibold text-sm">
            메뉴 추가하기
          </span>
        </button>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-xl">1인당 가격이 어떻게 되나요?</h3>
        <div className="flex flex-wrap w-full gap-2">
          {priceOptions.map((option) => (
            <label
              key={option.id}
              className={`
                cursor-pointer px-2 py-1 rounded-full shadow-md text-sm font-medium text-center transition-all duration-200
                ${
                  selectedPrice === option.id
                    ? "bg-brand-primary-600 border-brand-primary-600 text-white"
                    : "bg-white border-gray-300 text-gray-400 hover:border-red-300 hover:bg-red-400 hover:text-white"
                }
              `}
            >
              <input
                type="radio"
                name="priceRange"
                value={option.id}
                checked={selectedPrice === option.id}
                onChange={(e) =>
                  handlePriceSelect(Number(e.currentTarget.value))
                }
                className="hidden"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>
    </form>
  );
};

export default ReviewModifyForm;
