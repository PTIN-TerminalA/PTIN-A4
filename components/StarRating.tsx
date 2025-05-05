import { useColorScheme, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  starSize?: number;
  fullColor?: string;
  emptyColor?: string;
}

export default function StarRating({
  rating,
  maxStars = 5,
  starSize = 16,
  fullColor = Colors.accent_primari,
  emptyColor = Colors[useColorScheme() || 'light'].tint,
}: StarRatingProps) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {Array.from({ length: maxStars }).map((_, index) => {
        const starPosition = index + 1;
        const filled = rating >= starPosition;
        const halfFilled = rating >= starPosition - 0.5 && rating < starPosition;

        return (
          <Ionicons
            key={index}
            name={filled ? 'star' : halfFilled ? 'star-half' : 'star-outline'}
            size={starSize}
            color={filled || halfFilled ? fullColor : emptyColor}
            style={{ marginHorizontal: 1 }}
          />
        );
      })}
    </View>
  );
}