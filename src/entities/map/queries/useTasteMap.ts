import { useQuery } from "@tanstack/react-query";
import { getTasteMapAPI } from "../api";

interface Props {
  tasteMapId: number;
  userMapx: number;
  userMapy: number;
}

const useTasteMap = (params: Props) => {
  return useQuery({
    queryKey: ["taste-map", params.tasteMapId, params.userMapx, params.userMapy],
    queryFn: () => getTasteMapAPI(params),
    staleTime: 1000 * 60 * 10,
  })
}

export default useTasteMap;