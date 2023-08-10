import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Collection } from "../Models/SQLData";
import { fetchCollection } from "../Models/Requests";
import { CollectionProps } from "../props";

const CollectionScreen = (props: CollectionProps) => {
  const [collection, setCollection] = useState({} as Collection | undefined);

  useEffect(() => {
    const getCollectionData = async () => {
      await fetchCollection(props.route.params.collection_id)
        .then((data) => setCollection(data))
        .catch((error) => console.log(error));
    };
    getCollectionData();
  });

  return (
    <View>
      <Text>CollectionScreen</Text>
      <Text>{collection?.name}</Text>
      <Text>{collection?.description}</Text>
      <Text>{collection?.difficulty}</Text>
    </View>
  );
};

export default CollectionScreen;
