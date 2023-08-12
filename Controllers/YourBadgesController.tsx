import { useEffect, useState } from "react";
import { UserBadge } from "../Models/SQLData";
import { API_URL } from "@env";
import { auth } from "../Models/firebase";

export const useYourBadges = (userId: number) => {
  const [badges, setBadges] = useState([] as UserBadge[]);
  const fetchBadges = async () => {
    try {
      const badgesurl = `${API_URL}/api/userbadges/${userId}`;
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(badgesurl, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
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
