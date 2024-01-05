import { useState, useMemo } from "react";

type ItemWithName = {
  name?: string;
  user_name?: string;
};

type SearchableObject<T> = {
  initialList: T[];
  nameKey: keyof T;
  defaultResults: T[];
};

export const useSearchFilter = <T extends ItemWithName>({
  initialList,
  nameKey,
  defaultResults
}: SearchableObject<T>) => {
  const [searchInput, setSearchInput] = useState("");

  const filteredList = useMemo(() => {
    if (searchInput.length === 0 && defaultResults.length > 0) {
      return defaultResults;
    }
    return initialList
      .filter((item) =>
        String(item[nameKey]).toLowerCase().includes(searchInput.toLowerCase()),
      )
      .slice(0, 20)
      .sort((a, b) => String(a[nameKey]).localeCompare(String(b[nameKey])));
  }, [searchInput, initialList, nameKey]);

  return {
    searchInput,
    setSearchInput,
    filteredList,
  };
};
