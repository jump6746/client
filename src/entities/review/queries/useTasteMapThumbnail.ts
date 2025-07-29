import { useQuery } from "@tanstack/react-query";
import { getTasteMapThumbnailAPI } from "../api";
import { useLoginInfo } from "@/entities/auth/queries";
import { useGeolocation } from "@/features/map/hooks";

interface Props {
  id?: string | null;
  ownerId?: number;
}

const useTasteMapThumbnail = (params: Props) => {

  const { userInfo } = useLoginInfo();
  const { currentLocation } = useGeolocation();

  const mapX = currentLocation?.lng ?? 126.978;
  const mapY = currentLocation?.lat ?? 37.5665;

  return useQuery({
    queryKey: ["taste-map-thumbnail", params.id, userInfo?.userId, mapX, mapY],
    queryFn: () => getTasteMapThumbnailAPI({id: params.id, userId: userInfo?.userId, userMapx: mapX, userMapy: mapY}),
    staleTime: 1000 * 60 * 5,
    enabled: !!params.id
  })
}

export default useTasteMapThumbnail;