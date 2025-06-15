import React, { useState } from 'react';
import { View, Modal, TextInput, StyleSheet, Alert, useColorScheme } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import { ThemedText } from "@/components/ThemedText";
import { ThemedPressable } from "@/components/ThemedPressable";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ActivityIndicator } from 'react-native';
import { useRouteRating } from '@/hooks/useRouteRating';

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (rating: number, review: string) => void;
  token: string;
  scheduledTime: string;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  onClose,
  token,
  scheduledTime
}) => {

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const backgroundColorOverlay = useColorScheme() === 'light' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)';
  const [loading, setLoading] = useState(false);
  const { rateRoute, loading: apiLoading, error } = useRouteRating();

  
  const handleSubmit = async () => {
    if (review.length > 200) {
        Alert.alert(
            'Comentari massa llarg',
            'Has superat el límit de 200 caràcters.',
            [{ text: 'Acceptar' }]
        );
        return;
    }

    setLoading(true);

    try {
      await rateRoute(scheduledTime, rating, review, token);
    } catch (error) {
      console.error('Error al enviar la valoració:', error);
      setLoading(false);
    } finally {
      setLoading(false); 
      Alert.alert(
          'Valoració pujada correctament.',
          'Gràcies per la teva opinió, ens ajudarà a millorar el servei. Fins aviat!',
          [{ text: 'Acceptar', onPress: () => onClose() }],
          { cancelable: false }
        );
      setRating(0);
      setReview('');
    }
  };

  const handleSkip = () => {
    onClose();
    setRating(0);
    setReview('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={[styles.overlay, { backgroundColor: backgroundColorOverlay }]}>
        <View style={[styles.modalContainer, { backgroundColor }]}>
          <ThemedText type="title" style={{ marginBottom: 12, textAlign: 'center' }} >Viatge realitzat amb èxit!</ThemedText>
          <ThemedText type="default" style={{ marginBottom: 20, textAlign: 'center' }} >Com ha estat la teva experiència amb Flysy? 
            Deixa una puntuació i una petita resenya.</ThemedText>

          <View style={{ marginBottom: 20 }}>
            <StarRating
              rating={rating}
              onChange={setRating}
              starSize={50}
              color="#FFD700"
              enableHalfStar={false} // Desactiva les mitges estrelles
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Escriu el teu comentari..."
            multiline
            value={review}
            onChangeText={setReview}
          />

          <View style={styles.buttons}>
            <ThemedPressable type="button_secundari" onPress={handleSkip} style={styles.cancelButton}>
              <ThemedText type="bold" style={{ color: textColor, fontSize: 16 }}>Saltar</ThemedText>
            </ThemedPressable>

            <ThemedPressable type="button" onPress={handleSubmit} 
            style={[styles.submitButton, { opacity: rating === 0 || loading ? 0.5 : 1} ]}
            disabled={rating === 0 || loading}>
                {loading ? (
                <ActivityIndicator color={textColor} />
                ) : (
                <ThemedText type="bold" style={{ color: textColor, fontSize: 16 }}>Valorar</ThemedText>
                )}
            </ThemedPressable>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 0,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    minHeight: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderRadius: 10,
    minHeight: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});