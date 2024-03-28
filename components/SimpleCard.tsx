import { Text, View, TouchableOpacity } from "react-native";
import { standardStyles } from "../Styles/styles";

type CardT = {
  id: number;
  name: string;
};

interface CardProps {
  item: CardT;
  handleCardPress: (beerId: number) => void;
}

const SimpleCard: React.FC<CardProps> = ({ item, handleCardPress }) => {
  const handlePress = () => {
    handleCardPress(item.id);
  };

  return (
    <View style={standardStyles.basicCard}>
      <TouchableOpacity onPress={() => handlePress()}>
        <Text style={standardStyles.basicCardText} maxFontSizeMultiplier={1.3}>
          {item.name}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SimpleCard;
