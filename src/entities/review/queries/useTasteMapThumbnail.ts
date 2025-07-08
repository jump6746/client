import { useSuspenseQuery } from "@tanstack/react-query";
import { getTasteMapThumbnailAPI } from "../api";
import { useLoginInfo } from "@/entities/auth/queries";

interface Props {
  id?: string;
}

const useTasteMapThumbnail = (params: Props) => {

  const { userInfo } = useLoginInfo();

  return useSuspenseQuery({
    queryKey: ["taste-map-thumbnail", params.id, userInfo?.userId],
    queryFn: () => getTasteMapThumbnailAPI({...params, userId: userInfo?.userId}),
    staleTime: 1000 * 60 * 5,
  })
}

export default useTasteMapThumbnail;