import React, { useState } from "react";
import { View, TextInput, FlatList, Text, Pressable } from "react-native";

const options = ["Barcelona", "Tarragona", "Girona", "Lleida", "València"];

export default function AutocompleteSearch() {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleChange = (text: string) => {
    setQuery(text);
    if (text.length > 0) {
      const matches = options.filter((o) =>
        o.toLowerCase().includes(text.toLowerCase())
      );
      setFiltered(matches);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelect = (item: string) => {
    setQuery(item);
    setShowDropdown(false);
  };

  return (
    <View
      style={{
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: "white",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        marginTop: 60,
        zIndex: 999,
      }}
    >
      <TextInput
        placeholder="Cerca una ciutat"
        value={query}
        onChangeText={handleChange}
        style={{
          borderWidth: 1,
          borderColor: "gray",
          padding: 10,
          borderRadius: 5,
        }}
      />
      {showDropdown && (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable onPress={() => handleSelect(item)}>
              <Text style={{ padding: 10 }}>{item}</Text>
            </Pressable>
          )}
          style={{
            borderWidth: 1,
            borderColor: "gray",
            borderTopWidth: 0,
            maxHeight: 150,
          }}
        />
      )}
    </View>
  );
}
