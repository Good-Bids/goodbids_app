import { useQuery } from "react-query";
import { checkEin } from "~/queries/charityApi";

export const useCheckCharity = (ein: `${number}`) => {
  const result = useQuery(["charityCheck", ein], () => checkEin(ein));
  return result;
};
