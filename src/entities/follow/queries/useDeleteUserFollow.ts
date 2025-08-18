import { useMutation } from "@tanstack/react-query";
import { deleteUserAPI } from "../api";

const useDeleteUserFollow = () => {
  return useMutation({
    mutationFn: deleteUserAPI,
  });
};

export default useDeleteUserFollow;
