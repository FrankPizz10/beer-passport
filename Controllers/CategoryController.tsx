import { useEffect, useState } from "react";
import { Beer } from "../Models/SQLData";
import { API_URL } from "@env";
import { auth } from "../Models/firebase";

export const useCategory = (cat: string) => {
  const [beers, setBeers] = useState([] as Beer[]);
  useEffect(() => {
    const fetchBeersByCat = async () => {
      try {
        if (!cat) return;
        const url = `${API_URL}/api/beers/cat`;
        const token = await auth.currentUser?.getIdToken();
        async function fetchBeersHelper(): Promise<Beer[]> {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
              cat: cat,
            }),
          });
          const beers = await response.json();
          return beers;
        }
        const beers = await fetchBeersHelper();
        setBeers(beers);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBeersByCat();
  }, [cat]);
  return beers;
};
