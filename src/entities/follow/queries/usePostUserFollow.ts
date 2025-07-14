import { useMutation } from "@tanstack/react-query";
import postUserAPI from "../api/postUserAPI";

const usePostUserFollow = () => {

  return useMutation({
    mutationFn: postUserAPI,
  })
}

export default usePostUserFollow;