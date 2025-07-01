import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Modal from "react-native-modal";
import { Button } from "react-native-paper";
import React, { useState } from "react";
import { StyleSheet, Dimensions, Image, Pressable, View } from "react-native";
import Animated from "react-native-reanimated";
import { useCanvasGestures } from "@/hooks/useCanvasGestures";
import { GestureDetector } from "react-native-gesture-handler";
import AutocompleteSearch from "@/components/AutocompleteSearch";

export default function Six() {
  const { gesture, animatedStyle, isPanning } = useCanvasGestures();
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      {modalVisible && (
        <View>
          <Pressable
            style={styles.overlay}
            onPress={() => {
              setModalVisible(false);
            }}
          />
          <Modal
            isVisible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            onBackdropPress={() => setModalVisible(false)}
            onSwipeComplete={() => setModalVisible(false)}
            swipeDirection="down"
            propagateSwipe
            style={styles.modal}
          >
            <ThemedView style={{ padding: 20 }}>
              <ThemedText type="title">Modal Title</ThemedText>
              <ThemedText type="default">This is a modal content.</ThemedText>
              <Button
                onPress={() => {
                  console.log("Modal Button Pressed");
                  setModalVisible(false);
                }}
              >
                <ThemedText>Close Modal</ThemedText>
              </Button>
            </ThemedView>
          </Modal>
        </View>
      )}
      <ThemedView style={{ flex: 1 }}>
        {/* Contingut fix centrat */}
        <ThemedView
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 20,
            backgroundColor: "white",
          }}
        >
          <ThemedText type="title">Six</ThemedText>
          <AutocompleteSearch />

          <ThemedText type="default">This is the sixth tab.</ThemedText>
          <Button
            onPress={() => {
              console.log("Button Pressed");
              setModalVisible(true);
            }}
          >
            <ThemedText>Click Me</ThemedText>
          </Button>
        </ThemedView>

        {/* Zona interactiva amb gestures */}
        <GestureDetector gesture={gesture}>
          <Animated.View style={[{ flex: 1 }, animatedStyle]}>
            <Image
              source={{
                uri: "https://i.pinimg.com/736x/b1/86/21/b1862191bd2085ca4a88e4be7b6087f3.jpg",
              }}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "cover",
              }}
            />
          </Animated.View>
        </GestureDetector>

        {/* Modal */}
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
    zIndex: 1001,
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    maxHeight: Dimensions.get("window").height * 0.5,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginVertical: 10,
  },
  image: {
    width: "100%",
    height: 150,
  },
  bottomContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  infoSection: {
    flex: 2,
  },
  title: {
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaIcon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
  metaText: {
    fontSize: 14,
  },
  buttonWrapper: {
    flex: 1,
    alignItems: "flex-end",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderRadius: 10,
    minHeight: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 1000,
  },
});
