import { FollowerReview } from "@/entities/follow/model";
import { Button } from "@/shared/ui/Button";
import Image from "next/image";

interface Props {
  data: FollowerReview;
}

const FollowReview = ({ data }: Props) => {
  return (
    <div className="flex flex-col w-full gap-5">
      <div className="flex justify-between items-center px-3">
        <div className="flex gap-2 items-center">
          <div className="w-11 h-11 rounded-full overflow-hidden">
            {data.avatarThumbnail.presignedUrl ? (
              <Image
                src={data.avatarThumbnail.presignedUrl}
                alt="프로필"
                width={45}
                height={45}
                className="w-11 h-11 object-cover"
              />
            ) : (
              <div className="w-11 h-11 bg-gray-200"></div>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex gap-1 items-end">
              <h3 className="font-bold text-lg">{data.reviewPlaceName}</h3>
              <span className="text-md text-gray-500">{data.distance}m</span>
            </div>
            <div className="flex gap-1 items-center">
              <span className="text-sm text-gray-400">{data.nickname}</span>
              <span className="text-sm text-gray-400">
                {data.reviewCreatedAt}
              </span>
            </div>
          </div>
        </div>
        <Button type="button" onClick={() => {}} className="cursor-pointer">
          지도에서 보기
        </Button>
      </div>
      {data.reviewImg.presignedUrl ? (
        <Image
          src={data.reviewImg.presignedUrl}
          alt="리뷰"
          width={400}
          height={280}
          className="w-full h-70 object-cover"
        />
      ) : (
        <div className="w-full h-70 bg-gray-200 flex justify-center items-center">
          <span className="text-gray-400">리뷰 이미지가 없습니다.</span>
        </div>
      )}
    </div>
  );
};

export default FollowReview;
