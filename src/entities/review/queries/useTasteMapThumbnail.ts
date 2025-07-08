import { useSuspenseQuery } from "@tanstack/react-query";
import { getTasteMapThumbnailAPI } from "../api";
import { useUserStore } from "@/shared/stores";

interface Props {
  id?: string;
}

const useTasteMapThumbnail = (params: Props) => {

  const userId = useUserStore((state) => state.userId);

  return useSuspenseQuery({
    queryKey: ["taste-map-thumbnail", params.id, userId],
    queryFn: () => getTasteMapThumbnailAPI({...params, userId}),
    staleTime: 1000 * 60 * 5,
  })
}

export default useTasteMapThumbnail;