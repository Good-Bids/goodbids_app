import { useMutation, useQuery } from "@tanstack/react-query";
import { updateCharityAdmin } from "./useCharityAdmin";
import useSupabase from "./useSupabase";

const supabaseClient = useSupabase();

/**
 * getAuction
 * 
 * ServerSide - false
 * 
 * Supabase call that fetches a single auction Via 
 * createBrowserSupabaseClient helper client from 
 * @supabase/auth-helpers-nextjs
 * 
 * @param charityId string - uuid4 charity Id not null / undefined
 */
const getCharity = async (charityId: string) => {

  try {

    const result = await supabaseClient
      .from("charity")
      .select()
      .eq("charity_id", charityId)
      .limit(1)
      .single()
      .throwOnError();

    return {
      status: result.status,
      statusMessage: result.statusText,
      charity: result.data,
      hasError: false,
      rawError: null,
    }

  } catch (err: any) {

    return {
      status: err?.code ?? "5000",
      statusMessage: err?.message ?? "unknown error type",
      charity: undefined,
      hasError: true,
      errorObj: err,
    }

  }
};

/**
 * useCharityQuery
 * 
 * ServerSide - false
 * 
 * React hook that fetches a single Charity Via 
 * createBrowserSupabaseClient wrapped in ReactQuery.
 * 
 * React query returns required UI data on top of errors that can
 * be surfaced. Since this is also wrapping the Supabase query and its 
 * errors ( can be network or db related etc )
 * 
 * Error from ReactQuery is in error
 * Error from SubQuery with Supabase is in data
 * 
 * TODO: validate charityId and strip it from possible misuse
 * its passed directly from the address bar into this query 
 * 
 * return types are inferred
 */
export const useCharityQuery = (charityId?: string | undefined) => {

  // below in temporary - short circuit 
  if(charityId === undefined) {
    return (
      {
        queryStatus: {
          isLoading: false,
          isError: false
        },
        auction: undefined,
        hasError: true,
        errorMessage: "Invalid charity ID",
        errorObj: {
          code: "5000",
          message: "Invalid charity ID"
        }
      }
    ) as const
  }

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['charityQueryResults', charityId],
    queryFn: async () => {
      return await getCharity(charityId);
    }
  });

  return (
    {
      queryStatus: {
        isLoading,
        isError
      },
      charity: data?.charity ?? undefined,
      hasError: (data?.hasError || isError) ? true : false,
      errorMessage: (data?.hasError || isError) ? data?.statusMessage ?? "React Query encountered an error" : "",
      errorObj: (data?.hasError || isError) ? data?.errorObj ?? error : null
    }
  ) as const
  
  /*
  const result = useQuery(["charity", charityId], () => getCharity(charityId), {
    enabled: Boolean(charityId),
  });
  return result;
  */

};


const createCharity = async (data) => {
  const { data: charityData, error } = await supabaseClient
    .from("charity")
    .insert({ email: data.email, ein: data.ein, name: data.name })
    .select()
    .limit(1)
    .single();

  if (error) {
    throw error;
  } else {
    return charityData;
  }
};

export const useCreateCharity = (data) => {
  return useMutation(() => createCharity(data), {
    onSuccess: async (charityData) => {
      const updateData = updateCharityAdmin(
        charityData.charity_id,
        data.adminId
      );
      return updateData;
    },
  });
};
