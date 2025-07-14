import { useLoginInfo } from "@/entities/auth/queries"
import { useQuery } from "@tanstack/react-query"
import { getSubscriptionsAPI } from "../api";

const useGetSubscriptions = () => {

  const { userInfo } = useLoginInfo();

  return useQuery({
    queryKey: ["subscriptions", userInfo?.userId],
    queryFn: () => getSubscriptionsAPI(),
    staleTime: 1000 * 60 * 3,
  })
}

export default useGetSubscriptions;