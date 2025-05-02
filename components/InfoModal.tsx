import React from "react";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import Modal from "react-native-modal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedPressable } from "@/components/ThemedPressable";
import { useThemeColor } from "@/hooks/useThemeColor";
import ClockIcon from "../assets/images/Icons/clock.png";
import DestinoIcon from "../assets/images/Icons/information.png";
import { Image as RNImage } from "react-native";

interface InfoModalProps {
  isVisible: boolean;
  onClose: () => void;
  imageUrl: number | { uri: string } | { uri: string; headers?: any };
  onSelect: () => void;
  title?: string;
  description?: string; // <-- Afegim això
  minutesText?: string;
  distanceText?: string;
  buttonText?: string;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isVisible,
  onClose,
  imageUrl,
  onSelect,
  title = "Lloc",
  minutesText = "2 min",
  distanceText = "1 km",
  buttonText = "Seleccionar",
  description = "",
}) => {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
      propagateSwipe
    >
      <View style={[styles.container, { backgroundColor }]}>
        {/* Marca superior tipo "handle" */}
        <View style={styles.handle} />

        <Image
          source={typeof imageUrl === "string" ? { uri: imageUrl } : imageUrl} // de moment ho fem així perquè son les dades mockup però ja ho canviarem més endevant si s'escau
          style={styles.image}
          resizeMode="cover"
        />

        {/* Contenido inferior */}
        <View style={styles.bottomContent}>
          {/* Izquierda */}
          <View style={styles.infoSection}>
            <ThemedText
              type="title"
              style={[styles.title, { color: textColor }]}
            >
              {title}
            </ThemedText>
            <ThemedText
              type="default"
              style={[{ marginBottom: 8, color: textColor }]}
            >
              {description}
            </ThemedText>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <RNImage source={ClockIcon} style={styles.metaIcon} />
                <ThemedText
                  type="default"
                  style={[styles.metaText, { color: textColor }]}
                >
                  {minutesText}
                </ThemedText>
              </View>

              <View style={styles.metaItem}>
                <RNImage source={DestinoIcon} style={styles.metaIcon} />
                <ThemedText
                  type="default"
                  style={[styles.metaText, { color: textColor }]}
                >
                  {distanceText}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Derecha*/}
          <View style={styles.buttonWrapper}>
            <ThemedPressable
              type="button"
              onPress={onSelect}
              style={styles.button}
            >
              <ThemedText
                type="bold"
                style={{ color: textColor, fontSize: 16 }}
              >
                {buttonText}
              </ThemedText>
            </ThemedPressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
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
});
