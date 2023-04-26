import { useEffect, useState } from "react";
import { Beer } from "../Models/SQLData";
import { API_URL } from "@env";

export const useCategory = (cat: string) => {
  const [beers, setBeers] = useState([] as Beer[]);
  useEffect(() => {
    const fetchBeersByCat = async () => {
      try {
        const url = API_URL + "/api/beers/cat";
        async function fetchBeersHelper(): Promise<Beer[]> {
          console.log(cat);
          const response = await fetch(url, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
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
