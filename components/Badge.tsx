import { Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { decimalToPercent } from "../utils";
import { standardStyles } from "../Styles/styles";
import { MainButtonColor } from "../Styles/colors";
import { UserBadge } from "../Models/SQLData";

interface BadgeProps {
    badge: UserBadge;
    handleBadgePress: (collectionId: number) => void;
}

const Badge: React.FC<BadgeProps> = ({ badge, handleBadgePress }) => {
  const width = Dimensions.get("window").width;

  const handlePress = () => {
      handleBadgePress(badge.collections.id);
  };
  
  return (
    <TouchableOpacity
      style={[styles.badge, badge.earned ? styles.goldenBadge : null]}
      onPress={() => handlePress()}
    >
      <Text style={styles.badgeTitle}>
        {badge.collections.name.toUpperCase()}
      </Text>
      <Text style={standardStyles.basicCardText}>
        {badge.collections.description}
      </Text>
      <Text style={standardStyles.basicCardText}>
        Difficulty: {badge.collections.difficulty}
      </Text>
      <Text style={standardStyles.basicCardText}>
        Progress: {decimalToPercent(badge.progress)}
      </Text>
    </TouchableOpacity>
  );
};

export default Badge;

const styles = StyleSheet.create({
  badgeTitle: {
    fontSize: Dimensions.get("window").width / 15,
    fontWeight: "bold",
    justifyContent: "center",
    marginBottom: 10,
  },
  badge: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: MainButtonColor,
    borderRadius: 12,
    margin: 5,
    width: Dimensions.get("window").width - 50,
    height: Dimensions.get("window").height / 4,
  },
  goldenBadge: {
    backgroundColor: "gold",
  }
});