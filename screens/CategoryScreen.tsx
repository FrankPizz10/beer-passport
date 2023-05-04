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
import { SelectList } from "react-native-dropdown-select-list";
import { Category } from "../Models/SQLData";
import { API_URL } from "@env";
import { useCategory } from "../Controllers/CategoryController";

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
          const response = await fetch(url);
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
    navigation.navigate("Beer", { id: beerId });
  };

  return (
    <View>
      <SelectList
        setSelected={handleSelected}
        data={categories}
        boxStyles={styles.dropDown}
      />
      <ScrollView>
        {beersByCategory?.map((beer) => {
          return (
            <View key={beer.id} style={styles.beerCard}>
              <TouchableOpacity onPress={() => handleBeerPress(beer.id)}>
                <Text>{beer.name}</Text>
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
  dropDown: {
    backgroundColor: "white",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  beerCard: {
    backgroundColor: "lightblue",
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
  },
});
