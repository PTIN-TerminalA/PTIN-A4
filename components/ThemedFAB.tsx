import React, { ReactNode, useState } from "react";
import {
  StyleProp,
  ViewStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { AnimatedFAB } from "react-native-paper";
import {
  StyleSheet,
  Platform,
  ScrollView,
  Text,
  SafeAreaView,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ThemedFABProps {
  icon?: string | "camera";
  size?: number | 24;
  animatedValue?: Animated.Value;
  visible: boolean;
  extended: boolean | false;
  label?: string;
  animateFrom: "right" | "left";
  style?: StyleProp<ViewStyle>;
  iconMode?: "dynamic" | "static";
  color?: string | "#ffffffff";
  onPress?: () => void;
}

const ThemedFAB: React.FC<ThemedFABProps> = ({
  icon,
  size,
  animatedValue,
  visible,
  extended,
  label,
  animateFrom,
  style,
  iconMode,
  color,
  onPress,
}) => {
  const [isExtended, setIsExtended] = useState(true);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollPosition = Math.floor(
      e.nativeEvent?.contentOffset?.y ?? 0
    );
    setIsExtended(currentScrollPosition <= 0);
  };

  const fabStyle = { [animateFrom]: 16 };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView onScroll={onScroll} scrollEventThrottle={16}>
        {[...new Array(100).keys()].map((_, i) => (
          <Text key={i}>{i}</Text>
        ))}
      </ScrollView>
      <AnimatedFAB
        icon={() => (
          <MaterialCommunityIcons
            name={"camera"}
            color={color}
            size={size}
          ></MaterialCommunityIcons>
        )}
        label={label ?? "Label"}
        extended={extended}
        onPress={onPress}
        visible={visible}
        animateFrom={animateFrom}
        iconMode={iconMode ?? "static"}
        style={[styles.fabStyle, style, fabStyle]}
      />
    </SafeAreaView>
  );
};

export default ThemedFAB;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fabStyle: {
    bottom: 16,
    right: 16,
    position: "absolute",
  },
});
