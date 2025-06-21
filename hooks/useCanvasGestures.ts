import { Dimensions, Keyboard } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";

const screen = Dimensions.get("window");

export function useCanvasGestures() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const startScale = useSharedValue(1);
  const focalX = useSharedValue(screen.width / 2);
  const focalY = useSharedValue(screen.height / 2);
  const isPanning = useSharedValue(false);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const pinchGesture = Gesture.Pinch()
    .onStart((e) => {
      startScale.value = scale.value;
      focalX.value = e.focalX;
      focalY.value = e.focalY;
    })
    .onUpdate((e) => {
      // Zoom limitat entre 0.5 i 3
      scale.value = Math.max(0.5, Math.min(3, startScale.value * e.scale));
    });

  // Track last translation values to calculate deltas
  const lastOffsetX = useSharedValue(0);
  const lastOffsetY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(dismissKeyboard)();
      isPanning.value = true;
      lastOffsetX.value = translateX.value;
      lastOffsetY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateX.value = lastOffsetX.value + e.translationX;
      translateY.value = lastOffsetY.value + e.translationY;
    })
    .onEnd(() => {
      isPanning.value = false;
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onBegin(() => {
      runOnJS(dismissKeyboard)();
    })
    .onEnd(() => {
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
      scale.value = withTiming(1);
    });

  const gesture = Gesture.Simultaneous(
    panGesture,
    pinchGesture,
    doubleTapGesture
  );

  const animatedStyle = useAnimatedStyle(() => {
    const dx = focalX.value - screen.width / 2;
    const dy = focalY.value - screen.height / 2;

    return {
      transform: [
        { translateX: translateX.value - dx * (scale.value - 1) },
        { translateY: translateY.value - dy * (scale.value - 1) },
        { scale: scale.value },
      ],
    };
  });

  return {
    gesture,
    animatedStyle,
    isPanning,
  };
}
