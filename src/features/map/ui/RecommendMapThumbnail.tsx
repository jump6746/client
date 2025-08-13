import Image from "next/image";

interface Props {
  title: string;
  mapId: number;
  profileImg: string;
  nickname: string;
  mapImg: { presignedUrl: string; s3Key: string }[];
  score: number;
  onClick: () => void;
}

const RecommendMapThumbnail = (params: Props) => {
  return (
    <div
      className="flex w-full justify-between p-5 items-start border-t-2 border-gray-400 cursor-pointer"
      onClick={params.onClick}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Image
            src={params.profileImg || "/icons/default_profile.svg"}
            alt="프로필"
            width={28}
            height={28}
            className="w-7 h-7 object-contain rounded-full"
          />
          <span className="text-xs font-semibold">{params.nickname}</span>
        </div>
        <h3 className="text-xl font-bold">{params.title}</h3>
        <span className="text-[0.5rem] bg-gray-600 text-white w-fit px-3 py-1.5 rounded-xl">
          먹부심 지수 {params.score}점
        </span>
      </div>
      <div className="bg-gray-100">
        {params.mapImg.length > 0 ? (
          <Image
            src={params.mapImg[0].presignedUrl}
            alt="맛지도"
            width={100}
            height={100}
            className="w-25 h-25 object-contain"
          />
        ) : (
          <div className="w-25 h-25 bg-gray-200 flex flex-col items-center justify-center text-gray-400">
            <span className="text-xs">대표 이미지가</span>
            <span className="text-xs">없습니다.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendMapThumbnail;
