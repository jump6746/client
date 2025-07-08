import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getMyProfileAPI, patchMyProfileAPI} from "@/entities/my/api";
import {isSuccessResponse} from "@/shared/lib";

const useMyProfile = () => {
  const getMyProfile = useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const res = await getMyProfileAPI();
      if (!isSuccessResponse(res)) {
        throw new Error(res.message);
      }
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  })
  const queryClient = useQueryClient();

  const patchMyProfile = useMutation({
    mutationFn: patchMyProfileAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['myProfile']});
    },
  })

  return {
    getMyProfile,
    patchMyProfile,
  }
}

export default useMyProfile;