import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { CategoryProps } from "../props";
import { useNavigation } from "@react-navigation/core";
import { Category } from "../Models/SQLData";
import { EXPO_PUBLIC_API_URL } from "@env";
import { useCategory } from "../Controllers/CategoryController";
import { auth } from "../Models/firebase";
import { BackgroundColor } from "../Styles/colors";
import { Dropdown } from "react-native-element-dropdown";
import { standardStyles } from "../Styles/styles";
import BeerCard from "../components/BeerCard";
import { PixelRatio } from "react-native";

interface CategoryMap {
  key: number;
  value: string;
}

const getFontSizeFromPixelRatio = (pixelRatio: number) => {
  if (pixelRatio < 1.5) {
    return 22;
  }
  if (pixelRatio < 2) {
    return 16;
  }
  if (pixelRatio < 3) {
    return 10;
  }
  if (pixelRatio < 3.5) {
    return 10;
  }
  else {
    return 8;
  }
}

const CategoryScreen = (props: CategoryProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [selected, setSelected] = useState("");
  const [categories, setCategories] = useState([] as CategoryMap[]);

  const beersByCategory = useCategory(selected);

  useEffect(() => {
    console.log("Pixel Ratio", PixelRatio.getFontScale());
    console.log("font size", getFontSizeFromPixelRatio(PixelRatio.getFontScale()));
    const fetchCatgeories = async () => {
      try {
        const url = `${EXPO_PUBLIC_API_URL}/api/categories`;
        async function fetchCategoriesHelper(): Promise<CategoryMap[]> {
          const token = await auth.currentUser?.getIdToken();
          const response = await fetch(url, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });
          const data = await response.json();
          const categories: CategoryMap[] = data.map((item: Category) => {
            return { key: item.id, value: item.cat_name };
          });
          return categories;
        }
        const categories = await fetchCategoriesHelper();
        setCategories(categories);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCatgeories();
  }, []);

  const handleSelected = (item: number) => {
    const cat = categories.find((cat) => cat.key === item)?.value.toString();
    setSelected(cat!);
  };

  const handleBeerPress = (beerId: number) => {
    navigation.navigate("Beer", {
      beer_id: beerId,
    });
  };

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <Dropdown
          placeholder="Select a category"
          placeholderStyle={styles.placeholder}
          data={categories}
          onChange={(item) => handleSelected(item.key)}
          selectedTextStyle={styles.placeholder}
          containerStyle={styles.dropDown}
          itemTextStyle={styles.items}
          labelField="value"
          valueField="key"
          mode="modal"
        />
      </View>
      <ScrollView>
        {beersByCategory?.map((beer) => {
          return (
            <BeerCard key={beer.id} beer={beer} handleBeerPress={handleBeerPress} />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  root: {
    backgroundColor: BackgroundColor,
    flex: 1,
  },
  container: {
    padding: 16,
  },
  placeholder: {
    color: "black",
    fontWeight: "bold",
    // fontSize: Dimensions.get("window").width / 15,
    fontSize: getFontSizeFromPixelRatio(PixelRatio.getFontScale()),
  },
  items: {
    color: "black",
    fontWeight: "bold",
    fontSize: getFontSizeFromPixelRatio(PixelRatio.getFontScale()),
  },
  dropDown: {
    backgroundColor: BackgroundColor,
    padding: 10,
    margin: 10,
    borderRadius: 5,
    justifyContent: "center",
    height: Dimensions.get("window").height * 0.60,
  },
});
