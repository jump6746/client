import { NaverMap } from "@/features/map";
import { Badge } from "@/shared/ui/Badge/Badge";
import { Button } from "@/shared/ui/Button";

const Components = () => {
  return (
    <div className="flex flex-col gap-10 p-10 h-full w-full">
      <div className="flex flex-col gap-5">
        <h3 className="py-5 border-b-2">Button</h3>
        <Button className="w-fit p-2">버튼</Button>
      </div>
      <div className="flex flex-col gap-5">
        <h3 className="py-5 border-b-2">Badge</h3>
        <Badge>음식점</Badge>
      </div>
      <div className="flex flex-col gap-5 w-[370px] h-[500px]">
        <h3 className="py-5 border-b-2">Map</h3>
        <NaverMap
          center={{ lat: 37.5665, lng: 126.978 }}
          zoom={15}
          height="500px"
        />
      </div>
    </div>
  );
};

export default Components;
