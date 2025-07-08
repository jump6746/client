import { useQuery } from "@tanstack/react-query";
import { getTasteMapAPI } from "../api";
import { useGuestModeStore } from "@/shared/stores";

interface Props {
  tasteMapId: number | null;
  userMapx: number;
  userMapy: number;
}

const useTasteMap = (params: Props) => {  

  const isGuestMode = useGuestModeStore((state) => state.isGuestMode);

  return useQuery({
    queryKey: ["taste-map", params.tasteMapId, params.userMapx, params.userMapy],
    queryFn: () => getTasteMapAPI(params),
    staleTime: 1000 * 60 * 10,
    enabled: !isGuestMode && params.tasteMapId != 0,
  })
}

export default useTasteMap;