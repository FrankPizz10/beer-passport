import { Text, View, TouchableOpacity } from "react-native";
import { standardStyles } from "../Styles/styles";

type BeerCard = {
    id: number;
    name: string;
};

interface BeerCardProps {
    beer: BeerCard;
    handleBeerPress: (beerId: number) => void;
}

const BeerCard: React.FC<BeerCardProps> = ({ beer, handleBeerPress }) => {
    const handlePress = () => {
        handleBeerPress(beer.id);
    };
    
    return (
        <View style={standardStyles.basicCard}>
          <TouchableOpacity onPress={() => handlePress()}>
            <Text style={standardStyles.basicCardText}>{beer.name}</Text>
          </TouchableOpacity>
        </View>
      );
};

export default BeerCard;