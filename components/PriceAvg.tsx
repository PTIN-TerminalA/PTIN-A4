import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface PriceDisplayProps {
  avgPrice?: number;
  currencySymbol?: string;
  showCategory?: boolean;
  containerStyle?: object;
  intervalStyle?: object;
  categoryStyle?: object;
}
const ColorBudget = {
    budget: '#4CAF50',    // Green
    moderate: '#FF9800',  // Orange
    premium: '#2196F3',   // Blue
    luxury: '#E91E63',    // Pink-red
    unknown: '#607D8B'    // Blue-gray
}
export default function PriceDisplay({
  avgPrice,
  currencySymbol = '€',
  showCategory = true,
  containerStyle = {},
  intervalStyle = {},
  categoryStyle = {},
}: PriceDisplayProps) {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  // Calculate price interval
  const getPriceInterval = () => {
    if (!avgPrice || avgPrice <= 0) return `?${currencySymbol}`;
    
    const lowerBound = Math.max(1, Math.floor(avgPrice * 0.7));
    const upperBound = Math.ceil(avgPrice * 1.3);
    
    if (upperBound - lowerBound < 2) {
      return `${Math.max(1, lowerBound - 1)}-${upperBound + 1}${currencySymbol}`;
    }
    
    return `${lowerBound}-${upperBound}${currencySymbol}`;
  };

  // Determine price category
  const getPriceCategory = () => {
    if (!avgPrice) return '';
    if (avgPrice < 10) return 'Econòmic';
    if (avgPrice < 15) return 'Moderat';
    if (avgPrice < 20) return 'Premium';
    return 'Luxe';
  };

  // Get category color
  const getCategoryColor = () => {
    const category = getPriceCategory();
    switch(category) {
      case 'Econòmic': return ColorBudget.budget;
      case 'Moderat': return ColorBudget.moderate;
      case 'Premium': return ColorBudget.premium;
      case 'Luxe': return ColorBudget.luxury;
      default: return themeColors.text;
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <ThemedText 
        style={[styles.intervalText, intervalStyle]} 
        type="default"
      >
        {getPriceInterval()}
      </ThemedText>
      
      {showCategory && avgPrice && (
        <View style={[styles.categoryPill, { backgroundColor: getCategoryColor() + '20' }]}>
          <ThemedText 
            style={[
              styles.categoryText, 
              { color: getCategoryColor() },
              categoryStyle
            ]} 
            type="subtitle"
          >
            {getPriceCategory()}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  intervalText: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
});