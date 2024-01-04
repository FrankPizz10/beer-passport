import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { CategoryProps } from "../props";
import { useNavigation } from "@react-navigation/core";
import { Category } from "../Models/SQLData";
import { API_URL } from "@env";
import { useCategory } from "../Controllers/CategoryController";
import { auth } from "../Models/firebase";
import { BackgroundColor } from "../Styles/colors";
import { Dropdown } from "react-native-element-dropdown";
import { standardStyles } from "../Styles/styles";

interface CategoryMap {
  key: number;
  value: string;
}

const CategoryScreen = (props: CategoryProps) => {
  const navigation = useNavigation<(typeof props)["navigation"]>();
  const [selected, setSelected] = useState("");
  const [categories, setCategories] = useState([] as CategoryMap[]);

  const beersByCategory = useCategory(selected);

  useEffect(() => {
    const fetchCatgeories = async () => {
      try {
        const url = `${API_URL}/api/categories`;
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
          labelField="value"
          valueField="key"
          mode="modal"
        />
      </View>
      <ScrollView>
        {beersByCategory?.map((beer) => {
          return (
            <View key={beer.id} style={standardStyles.basicCard}>
              <TouchableOpacity onPress={() => handleBeerPress(beer.id)}>
                <Text style={standardStyles.basicCardText}>{beer.name}</Text>
              </TouchableOpacity>
            </View>
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
    fontSize: 30,
  },
  dropDown: {
    backgroundColor: BackgroundColor,
    padding: 10,
    margin: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
});
