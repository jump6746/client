import { useSuspenseQuery } from "@tanstack/react-query";
import { getTasteMapThumbnailAPI } from "../api";

interface Props {
  id: string;
  userId: string | null;
}

const useTasteMapThumbnail = (params: Props) => {
  return useSuspenseQuery({
    queryKey: ["taste-map-thumbnail", params.id, params.userId],
    queryFn: () => getTasteMapThumbnailAPI(params),
    staleTime: 1000 * 60 * 5,
  })
}

export default useTasteMapThumbnail;