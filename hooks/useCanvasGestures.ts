import { Dimensions, Keyboard } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withTiming,
} from "react-native-reanimated";

const screen = Dimensions.get("window");
const imageWidth = 600 * 1.3;
const imageHeight = 400 * 1.3;
export function useCanvasGestures() {
  // Escala per ajustar a pantalla (fit-center)
  const scaleToFit = Math.min(
    screen.width / imageWidth,
    screen.height / imageHeight
  );
  const isPanning = useSharedValue(false);
  // Centrat
  const offsetX = (screen.width - imageWidth * scaleToFit) / 2;
  const offsetY = (screen.height - imageHeight * scaleToFit) / 2;
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const savedScale = useSharedValue(1);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(3) // or use 3 for triple tap
    .onEnd(() => {
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
      scale.value = withTiming(1);
      savedTranslateX.value = 0;
      savedTranslateY.value = 0;
      savedScale.value = 1;
      isPanning.value = false;
    });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(dismissKeyboard)();
      isPanning.value = true;
    })
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
      isPanning.value = false;
    });

  const pinchGesture = Gesture.Pinch()
    .onBegin(() => {
      runOnJS(dismissKeyboard)();
    })
    .onStart(() => {
      isPanning.value = true;
      runOnJS(dismissKeyboard)();
    })
    .onUpdate((e) => {
      isPanning.value = true;

      scale.value = Math.max(0.5, Math.min(3, savedScale.value * e.scale));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      isPanning.value = false;
    });

  const gesture = Gesture.Simultaneous(
    panGesture,
    pinchGesture,
    doubleTapGesture
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));
  const zoomTo = (xNorm: number, yNorm: number, targetScale = 2) => {
    const xTarget = xNorm;
    const yTarget = yNorm;

    translateX.value = withTiming(xTarget, { duration: 300 });
    translateY.value = withTiming(yTarget, { duration: 300 });
    scale.value = withTiming(targetScale, { duration: 300 });

    savedTranslateX.value = xTarget;
    savedTranslateY.value = yTarget;
    savedScale.value = targetScale;
  };

  return {
    gesture,
    animatedStyle,
    isPanning,
    zoomTo,
  };
}
