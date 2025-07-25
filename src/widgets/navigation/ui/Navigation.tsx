"use client";

import Image from "next/image";
import Link from "next/link";

const Navigation = () => {
  return (
    <nav className="flex justify-between w-full py-2 px-4 items-center">
      <Link href="/subscribe" className="flex flex-col gap-1 items-center">
        <Image
          src="/icons/compass_icon.svg"
          alt="나침반"
          width={24}
          height={24}
        />
        <span className="text-xs">구독 목록</span>
      </Link>
      <Link href="/home" className="flex flex-col gap-1 items-center">
        <Image src="/icons/map_icon.svg" alt="지도" width={24} height={24} />
        <span className="text-xs">내 지도</span>
      </Link>
      <Link href="/my" className="flex flex-col gap-1 items-center">
        <Image
          src="/icons/mypage_icon.svg"
          alt="마이페이지"
          width={24}
          height={24}
        />
        <span className="text-xs">마이페이지</span>
      </Link>
    </nav>
  );
};

export default Navigation;
