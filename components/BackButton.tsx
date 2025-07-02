import { useNavigation } from "expo-router";
import { IconButton, useTheme } from "react-native-paper";

const BackButton = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <IconButton
      icon="arrow-back"
      iconColor={theme.colors.primary}
      size={24}
      onPress={() => navigation.goBack()}
    />
  );
};
