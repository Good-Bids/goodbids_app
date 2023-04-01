import { useQuery } from "@tanstack/react-query";
import { checkEin } from "~/queries/charityApi";

export const useCheckCharity = (ein?: `${number}`) => {
  const result = useQuery(["charityCheck", ein], () => checkEin(ein), {
    enabled: Boolean(ein),
  });
  return result;
};
