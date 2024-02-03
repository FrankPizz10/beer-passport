import { useCallback, useState } from "react";
import { UserBadge } from "../Models/SQLData";
import { EXPO_PUBLIC_API_URL } from "@env";
import { auth } from "../Models/firebase";
import { useFocusEffect } from "@react-navigation/core";

export const useYourBadges = (userId?: number) => {
  const [badges, setBadges] = useState([] as UserBadge[]);
  const fetchBadges = async () => {
    try {
      const badgesurl = userId
        ? `${EXPO_PUBLIC_API_URL}/api/userbadges/${userId}}`
        : `${EXPO_PUBLIC_API_URL}/api/userbadges/`;
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

  useFocusEffect(
    useCallback(() => {
      fetchBadges();
    }, []),
  );

  return badges;
};
