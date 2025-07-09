import { useMutation } from "@tanstack/react-query"
import { patchJjimAPI } from "../api"

const usePatchJjim = () => {
  return useMutation({
    mutationFn: patchJjimAPI,
  });
}

export default usePatchJjim;