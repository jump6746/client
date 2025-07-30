import { useQuery } from "@tanstack/react-query";
import { getTasteMapAPI } from "../api";
import { useLoginInfo } from "@/entities/auth/queries";
import { useMapURL } from "@/features/map/hooks";

interface Props {
  userMapx: number;
  userMapy: number;
}

const useTasteMap = (params: Props) => {  

  const { getMapIdFromURL } = useMapURL();
  const { userInfo } = useLoginInfo();

  const tasteMapId = Number(getMapIdFromURL()) || userInfo?.defaultTasteMapId || null;

  return useQuery({
    queryKey: ["taste-map", tasteMapId, params.userMapx, params.userMapy],
    queryFn: () => getTasteMapAPI( {tasteMapId, ...params}),
    staleTime: 1000 * 60 * 10,
    enabled: !!tasteMapId,
  })
}

export default useTasteMap;