import { useState, useMemo } from "react";
import { fetchFriends } from "../Models/Requests";

type ItemWithName = {
  name?: string;
  user_name?: string;
};

type SearchableObject<T> = {
  initialList: T[];
  nameKey: keyof T;
};

export const useSearchFilter = <T extends ItemWithName, K extends keyof T>({
  initialList,
  nameKey,
}: SearchableObject<T>) => {
  const [searchInput, setSearchInput] = useState("");

  const filteredList = useMemo(() => {
    return initialList
      .filter((item) =>
        String(item[nameKey]).toLowerCase().includes(searchInput.toLowerCase())
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
