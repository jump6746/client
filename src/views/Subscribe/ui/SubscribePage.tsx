"use client";

import { Button } from "@/shared/ui/Button";
import FollowList from "@/widgets/follow/ui/FollowList";
import UserSearch from "@/widgets/follow/ui/UserSearch";
import Image from "next/image";
import { useState } from "react";

const SubscribePage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="w-full h-full relative">
      <section className="flex w-full justify-between items-center p-5">
        <h1 className="text-2xl font-bold">구독 목록</h1>
        <Button
          type="button"
          onClick={() => {
            setIsOpen(true);
          }}
          className="cursor-pointer"
        >
          <Image src="/icons/search.svg" alt="검색" width={24} height={24} />
        </Button>
      </section>
      <FollowList />
      {isOpen ? <UserSearch setIsOpen={setIsOpen} /> : null}
    </div>
  );
};

export default SubscribePage;
