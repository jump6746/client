import { Badge } from "@/shared/ui/Badge/Badge";
import { Button } from "@/shared/ui/Button";

const Components = () => {
  return (
    <div className="flex flex-col gap-10 p-10">
      <div className="flex flex-col gap-5">
        <h3 className="py-5 border-b-2">Button</h3>
        <Button className="w-fit p-2">버튼</Button>
      </div>
      <div className="flex flex-col gap-5">
        <h3 className="py-5 border-b-2">Badge</h3>
        <Badge>음식점</Badge>
      </div>
    </div>
  );
};

export default Components;
