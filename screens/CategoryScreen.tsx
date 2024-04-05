import { EXPO_PUBLIC_API_URL } from "@env";
import { BasicBeer, Category } from "../Models/SQLData";
import { CategoryProps } from "../props";
import { useEffect, useState } from "react";
import { auth } from "../Models/firebase";
import { StyleSheet, View, Text, Dimensions, ScrollView } from "react-native";
import { BackgroundColor, TryLikeButtonColor } from "../Styles/colors";
import SimpleCard from "../components/SimpleCard";
import { useNavigation } from "@react-navigation/core";

const CategoryScreen = (props: CategoryProps) => {
  const [category, setCategory] = useState<Category>({} as Category);
  const [categoryBeers, setCategoryBeers] = useState<BasicBeer[]>(
    [] as BasicBeer[],
  );
  const navigation = useNavigation<(typeof props)["navigation"]>();

  const handleBeerPress = (beerId: number) => {
    navigation.navigate("Beer", {
      beer_id: beerId,
    });
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const url = `${EXPO_PUBLIC_API_URL}/api/categories/${props.route.params.cat_id}`;
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const category = await response.json();
        setCategory(category);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategory();
    const fetchCategoryBeers = async () => {
      try {
        const url = `${EXPO_PUBLIC_API_URL}/api/categories/${props.route.params.cat_id}/beers`;
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const beers = await response.json();
        setCategoryBeers(beers);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategoryBeers();
  }, [props.route.params.cat_id]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{category.cat_name}</Text>
      </View>
      <ScrollView style={styles.scrollViewContainer}>
        {categoryBeers?.map((beer) => {
          return (
            <SimpleCard
              key={beer.id}
              item={beer}
              handleCardPress={handleBeerPress}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: Dimensions.get("window").width / 12,
    fontWeight: "bold",
    alignItems: "center",
    textAlign: "center",
  },
  breweryTitle: {
    fontSize: Dimensions.get("window").width / 15,
    alignItems: "center",
    textAlign: "center",
    marginTop: 10,
  },
  styleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  style: {
    fontSize: Dimensions.get("window").width / 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: Dimensions.get("window").width / 20,
    width: Dimensions.get("window").width - 60,
  },
  descriptionContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  abv: {
    fontSize: Dimensions.get("window").width / 20,
    fontWeight: "bold",
  },
  abvContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  brewery: {
    fontSize: Dimensions.get("window").width / 20,
    fontWeight: "bold",
  },
  breweryContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  scrollViewContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: TryLikeButtonColor,
    padding: 10,
    margin: 10,
    borderRadius: 5,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    fontSize: Dimensions.get("window").width / 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
