import { useGuestModeStore } from "@/shared/stores";
import { Button } from "@/shared/ui/Button";
import { customToast } from "@/shared/ui/CustomToast";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  userId: number;
  nickname: string;
}

const MapOwnerThumbnail = (props: Props) => {
  const router = useRouter();
  const isGuestMode = useGuestModeStore((state) => state.isGuestMode);

  const handleSubscribe = () => {
    if (isGuestMode) {
      customToast.needLogin(() => {
        router.push("/");
      });
    }
  };

  return (
    <div className="flex justify-center items-center gap-5 bg-transparent w-full absolute z-[800] top-10">
      <Button
        className="bg-black/70 rounded-xl p-2.5 cursor-pointer"
        onClick={() => {
          router.push("/home");
        }}
      >
        <Image
          src="/icons/arrow_back.svg"
          alt="이전"
          width={16}
          height={16}
          className="h-4 w-4"
        />
      </Button>
      <div className="bg-black/70 px-4 py-1 rounded-full flex items-center gap-4">
        <span className="text-white font-semibold">
          {props.nickname}의 맛지도
        </span>
        <Button
          className="py-0.5 px-1.5 rounded-xl bg-white cursor-pointer"
          type="button"
          onClick={handleSubscribe}
        >
          <span className="text-sm font-semibold">구독</span>
        </Button>
      </div>
    </div>
  );
};

export default MapOwnerThumbnail;
