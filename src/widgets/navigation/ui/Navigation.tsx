"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/subscribe",
      icon: "/icons/compass_icon.svg",
      activeIcon: "/icons/compass_active_icon.svg",
      alt: "구독",
      label: "구독 목록",
    },
    {
      href: "/home",
      icon: "/icons/map_icon.svg",
      activeIcon: "/icons/map_active_icon.svg",
      alt: "지도",
      label: "내 지도",
    },
    {
      href: "/my",
      icon: "/icons/mypage_icon.svg",
      activeIcon: "/icons/mypage_active_icon.svg",
      alt: "마이페이지",
      label: "마이페이지",
    },
  ];

  return (
    <nav className="flex justify-between w-full px-15 items-center">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col gap-1 py-2 px-1 items-center transition-colors duration-200 ${
              isActive
                ? "border-t-3 border-brand-primary-600" // 활성화 상태 색상
                : "text-gray-600 hover:text-gray-800" // 비활성화 상태 색상
            }`}
          >
            <Image
              src={isActive ? item.activeIcon : item.icon}
              alt={item.alt}
              width={24}
              height={24}
              className={isActive ? "opacity-100" : "opacity-70"}
            />
            <span
              className={`text-xs font-medium ${
                isActive ? "text-brand-primary-600" : "text-gray-600"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;
