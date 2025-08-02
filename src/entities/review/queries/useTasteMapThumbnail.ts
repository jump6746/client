import { useQuery } from "@tanstack/react-query";
import { getTasteMapThumbnailAPI } from "../api";
import { useLoginInfo } from "@/entities/auth/queries";
import { useGeolocation, useMapURL } from "@/features/map/hooks";
import { APIErrorResponse, ResponseDTO } from "@/shared/types/api-structure";
import { PlaceThumbnail } from "../model";

interface Props {
  id?: string | null;
}

const useTasteMapThumbnail = (params: Props) => {

  const { getOwnerIdFromURL } = useMapURL();
  const { userInfo } = useLoginInfo();
  const { currentLocation } = useGeolocation();

  const mapX = currentLocation?.lng ?? 126.978;
  const mapY = currentLocation?.lat ?? 37.5665;
  const userId = Number(getOwnerIdFromURL()) || userInfo?.userId || null;

  return useQuery<ResponseDTO<PlaceThumbnail>, APIErrorResponse>({
    queryKey: ["taste-map-thumbnail", params.id, userId, mapX, mapY],
    queryFn: () => getTasteMapThumbnailAPI({id: params.id, userId, userMapx: mapX, userMapy: mapY}),
    staleTime: 1000 * 60 * 5,
    enabled: !!userId || !!params.id
  });
}

export default useTasteMapThumbnail;