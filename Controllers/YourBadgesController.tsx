import { useEffect, useState } from "react";
import { UserBadge } from "../Models/SQLData";
import { API_URL } from "@env";

export const useYourBadges = (userId: number) => {
  const [badges, setBadges] = useState([] as UserBadge[]);
  const fetchBadges = async () => {
    try {
      const badgesurl = `${API_URL}/api/userbadges/${userId}`;
      const response = await fetch(badgesurl);
      const badges = await response.json();
      setBadges(badges);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, [userId]);

  return badges;
};
