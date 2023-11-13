import { useEffect, useState } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useLocalStorage<T>(key: string, initialValue: T, fetchData: (() => Promise<T>)) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    const storeData = async (key: string) => {
        try {
            const storedData = await AsyncStorage.getItem(key);
            if (storedData) {
                setValue(JSON.parse(storedData));
            }
            else {
                const data = await fetchData();
                setValue(data);
                await AsyncStorage.setItem(key, JSON.stringify(data));
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