import { useState, useEffect, DependencyList } from "react";
import { DesensitizedUserServerDataBannerColor } from "../constants/types/types";
import { fetchUserServerDataWithBannerColor } from "./apiGetRequest";

export const useAsync = <T>(
  asyncFunction: () => Promise<T>,
  dependencies: DependencyList = []
): { data: T | null; isLoading: boolean; error: Error | null } => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    asyncFunction()
      .then((response) => {
        setData(response);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, dependencies);

  return { data, isLoading, error };
};

export const useServerData = (
  serverImageId?: string
): {
  data: DesensitizedUserServerDataBannerColor[] | null;
  isLoading: boolean;
  error: Error | null;
} => {
  // Pass the serverImageId to the useAsync hook
  const { data, isLoading, error } = useAsync<
    DesensitizedUserServerDataBannerColor[]
  >(() => fetchUserServerDataWithBannerColor(undefined, serverImageId));

  return { data, isLoading, error };
};
