import React, { useState, useRef } from "react";
import { View, TextInput, FlatList, Text, Pressable, StyleSheet, Keyboard } from "react-native";
import { Service } from "@/constants/mocks/mockTypes";
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Text strings must be rendered within a <Text>component',
]);

type SearchBarProps = {
  options: Service[];
  setSelected: (selected: Service) => void;
  setVisible: (visible: boolean) => void;
};

export const SearchBar: React.FC<SearchBarProps> = ({ options, setSelected, setVisible }) => {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<Service[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  const handleChange = (text: string) => {
    setQuery(text);
    if (text.length > 0) {
      const matches = options.filter((service) =>
        service.name.toLowerCase().includes(text.toLowerCase()) ||
        service.description.toLowerCase().includes(text.toLowerCase())
      );
      setFiltered(matches);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelect = (service: Service) => {
    // Immediately dismiss keyboard and blur input
    Keyboard.dismiss();
    textInputRef.current?.blur();
    
    // Update state
    setQuery(service.name);
    setShowDropdown(false);
    setIsFocused(false);
    setSelected(service);
    setVisible(true);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    // Remove the timeout delay - let it blur immediately when not selecting
    setIsFocused(false);
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.searchContainer,
        isFocused && styles.searchContainerFocused,
        showDropdown && styles.searchContainerWithDropdown
      ]}>
        <View style={styles.inputWrapper}>
          <View style={styles.searchIcon}>
            <Text style={styles.searchIconText}>🔍</Text>
          </View>
          <TextInput
            ref={textInputRef}
            placeholder="Cerca un servei o instal·lació"
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={styles.textInput}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <Pressable 
              onPress={() => {
                setQuery("");
                setShowDropdown(false);
                Keyboard.dismiss();
                textInputRef.current?.blur();
              }}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </Pressable>
          )}
        </View>

        {showDropdown && filtered.length > 0 && (
          <View style={styles.dropdown}>
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id.toString()}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable 
                  onPress={() => handleSelect(item)}
                  style={({ pressed }) => [
                    styles.dropdownItem,
                    pressed && styles.dropdownItemPressed
                  ]}
                >
                  <View style={styles.locationIcon}>
                    <Text style={styles.locationIconText}>🏢</Text>
                  </View>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{item.name}</Text>
                    <Text style={styles.serviceDescription} numberOfLines={1}>
                      {item.description}
                    </Text>
                    {item.avg_price && (
                      <Text style={styles.servicePrice}>
                        ${item.avg_price}
                      </Text>
                    )}
                  </View>
                </Pressable>
              )}
              showsVerticalScrollIndicator={false}
              style={styles.flatList}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    zIndex: 999,
  },
  searchContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchContainerFocused: {
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  searchContainerWithDropdown: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchIconText: {
    fontSize: 18,
    opacity: 0.6,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "400",
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: "#9CA3AF",
    fontWeight: "bold",
  },
  dropdown: {
    backgroundColor: "white",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  flatList: {
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F9FAFB",
  },
  dropdownItemPressed: {
    backgroundColor: "#F9FAFB",
  },
  locationIcon: {
    marginRight: 12,
  },
  locationIconText: {
    fontSize: 16,
    opacity: 0.7,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "600",
    marginBottom: 2,
  },
  serviceDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  servicePrice: {
    fontSize: 14,
    color: "#059669",
    fontWeight: "500",
  },
});