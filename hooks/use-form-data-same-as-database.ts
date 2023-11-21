import { useCallback } from 'react';

// Define a generic type for the hook that extends a Record type
const useFormDataSameAsDatabase = <T extends Record<string, any>, U extends Record<string, any>>(currentValues: T, databaseData: U, isFetching: boolean) => {
  // This hook returns a memoized function that compares currentValues to databaseData
  const formDataSameAsDatabase = useCallback(() => {
    return Object.keys(currentValues).every((key) => currentValues[key] === databaseData[key]);
  }, [currentValues, databaseData, isFetching]);

  return formDataSameAsDatabase;
};

export default useFormDataSameAsDatabase;
