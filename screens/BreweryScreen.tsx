import { EXPO_PUBLIC_API_URL } from "@env";
import { Brewery } from "../Models/SQLData";
import { BreweryProps } from "../props";
import { useEffect, useState } from "react";
import { auth } from "../Models/firebase";
import { View, Text } from "react-native";


const BreweryScreen = (props: BreweryProps) => {
    const [brewery, setBrewery] = useState<Brewery>({} as Brewery);
    
    useEffect(() => {
        const fetchBrewery = async () => {
            try {
                const url = `${EXPO_PUBLIC_API_URL}/api/breweries/${props.route.params.brewery_id}`;
                const token = await auth.currentUser?.getIdToken();
                const response = await fetch(url, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                });
                const brewery = await response.json();
                setBrewery(brewery);
            } catch (error) {
                console.log(error);
            }
        }
        fetchBrewery();
    }, [props.route.params.brewery_id]);


    return (
        <View>
            <Text>{brewery.name}</Text>
            <Text>{brewery.city}</Text>
            <Text>{brewery.state}</Text>
            <Text>{brewery.country}</Text>
        </View>
    )
}

export default BreweryScreen;