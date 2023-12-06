import { useEffect, useMemo, useState } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useLocalStorage<T>(key: string, initialValue: T, fetchData: (() => Promise<T>), fetchServerVersion: (() => Promise<number|undefined>), fetchLocalVersion: (() => Promise<number|undefined>)) {
  const [value, setValue] = useState<T>(initialValue);
  const [version, setVersion] = useState<number | null>(null);

  const fetchAndStoreData = async (key: string, fetchData: (() => Promise<any>)) => {
    console.log("Fetching data");
    const data = await fetchData();
    setValue(data);
    await AsyncStorage.setItem(key, JSON.stringify(data));
  }

  useEffect(() => {
    const storeData = async (key: string) => {
        try {
            const storedData = await AsyncStorage.getItem(key);
            if (!storedData) {
                fetchAndStoreData(key, fetchData);
            }
            else {
                const storedVersion = await fetchLocalVersion();
                const fetchedVersion = await fetchServerVersion();
                if (!storedVersion || (fetchedVersion && storedVersion < fetchedVersion)) {
                    fetchAndStoreData(key, fetchData);
                }
                else {
                    setValue(JSON.parse(storedData));
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    storeData(key);
  }, [])

  return [value, setValue] as [T, typeof setValue]
}