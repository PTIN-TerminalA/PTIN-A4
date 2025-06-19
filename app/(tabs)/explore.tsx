import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Link } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
//import { services } from "@/constants/mocks/services";
//import { tags } from '@/constants/mocks/services';
import { ThemedTextInput } from "@/components/ThemedTextInput";
import getAverageValoration from "@/hooks/useAverageValoration";
import StarRating from "@/components/StarRating";
import { useTags } from "@/hooks/useTags";
import { useServiceContext } from "@/contexts/ServiceContext";
import { Searchbar, Chip } from "react-native-paper";
import { useState } from "react";
import Color from "color";

export default function ServiceScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() || "light";
  const { services, loading: servicesLoading } = useServiceContext();
  const { tags, loading: tagsLoading } = useTags();
  const [searchQuery, setSearchQuery] = useState(""); // Add search state
  const [activeTag, setActiveTag] = useState<string | null>(null); // Add active tag state

  if (servicesLoading || tagsLoading) {
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, justifyContent: "center" }}
      />
    );
  }

  const filteredServices = services?.filter((service) => {
    const matchesSearch =
      service.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    const matchesTag =
      !activeTag ||
      (service.tags?.some((tag) => tag.name === activeTag) ?? false);
    return matchesSearch && matchesTag;
  });

  const handleServicePress = (id: number) => {
    router.push({
      pathname: "/serviceInfo",
      params: { id },
    });
  };

  return (
    <View
      style={[
        styles.background,
        { backgroundColor: Colors[colorScheme].background },
      ]}
    >
      <SafeAreaView edges={["top"]} style={[styles.container]}>
        {/* TOP BAR */}
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: Colors[colorScheme].background },
          ]}
        >
          <Searchbar
            placeholder="Busca serveis..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[
              styles.searchBar,
              { backgroundColor: Colors[colorScheme].box },
              { borderRadius: 40 },
            ]}
            iconColor={Colors[colorScheme].text}
            placeholderTextColor={Colors[colorScheme].tint}
            inputStyle={{ color: Colors[colorScheme].text }}
          />

          {/* Tags filter row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsContainer}
          >
            {tags
              ?.filter((tag) => tag.name !== "sense preferencia")
              ?.map((tag) => (
                <Chip
                  key={tag.name}
                  mode="flat"
                  selected={activeTag === tag.name}
                  onPress={() =>
                    setActiveTag(activeTag === tag.name ? null : tag.name)
                  }
                  style={[
                    styles.tagChip,
                    {
                      backgroundColor:
                        activeTag === tag.name
                          ? Color(Colors.primari)
                              .mix(Color(Colors[colorScheme].box), 0.5)
                              .rgb()
                              .string()
                          : Colors[colorScheme].box,
                      borderRadius: 30,
                    },
                  ]}
                  textStyle={{
                    color:
                      activeTag === tag.name
                        ? Color(Colors.primari)
                            .mix(Color(Colors[colorScheme].text), 0.5)
                            .rgb()
                            .string()
                        : Colors[colorScheme].text,
                    fontSize: 12,
                  }}
                >
                  {tag.name}
                </Chip>
              ))}
          </ScrollView>
        </View>

        {/* Service cards */}
        <ScrollView
          style={{ backgroundColor: Colors[colorScheme].background }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={{ height: 15 }} />
          {filteredServices?.map((service) => {
            const { average, count } = getAverageValoration(
              service.valorations ?? []
            );
            return (
              <View style={styles.scrollContent} key={service.id}>
                <Link
                  href={{
                    pathname: "/serviceInfo",
                    params: { id: service.id },
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.serviceBox,
                      { backgroundColor: Colors[colorScheme].box },
                    ]}
                    onPress={() => handleServicePress(service.id)}
                  >
                    <View
                      style={[
                        styles.serviceImageBox,
                        { backgroundColor: Colors.primari },
                      ]}
                    >
                      <Image
                        style={styles.serviceImage}
                        source={
                          typeof service.ad_path === "string"
                            ? { uri: service.ad_path }
                            : service.ad_path
                        }
                      />
                    </View>

                    <View style={styles.serviceInfo}>
                      <View style={styles.serviceTags}>
                        {Array.isArray(service.tags) &&
                          service.tags.map((tag, index) => (
                            <View
                              style={[
                                styles.tagStyle,
                                {
                                  backgroundColor:
                                    Colors[colorScheme].background,
                                },
                                { borderColor: Colors[colorScheme].box_border },
                              ]}
                              key={index}
                            >
                              <ThemedText
                                style={[
                                  { color: Colors.accent_primari },
                                  { fontSize: 12 },
                                ]}
                                type={"bold"}
                              >
                                {tag.name}
                              </ThemedText>
                            </View>
                          ))}
                      </View>

                      {/* Name */}
                      <ThemedText style={styles.serviceNameStyle} type={"bold"}>
                        {service.name}
                      </ThemedText>

                      {/* Rating */}
                      <View style={[styles.serviceRateStyle]}>
                        <StarRating rating={average}></StarRating>
                        <ThemedText type="default" style={styles.ratingCount}>
                          ({count || 0})
                        </ThemedText>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Link>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
  },

  topBarContainter: {
    width: "100%",
    height: 90,
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-evenly",
    elevation: 5,
  },

  topBarStyle: {
    width: "90%",
    height: "40%",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },

  bottomBarScroll: {
    width: "90%",
    height: "40%",
    alignSelf: "center",
    flexDirection: "row",
  },

  bottomBarStyle: {
    height: "70%",
    alignItems: "center",
    justifyContent: "flex-start",
    alignSelf: "center",
    flexDirection: "row",
  },

  serchBarInput: {
    flex: 1,
    height: "90%",
    borderRadius: 10,
    paddingStart: 16,
    marginRight: 8,
  },

  searchBarIconBtn: {
    flex: 0,
    height: "90%",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  searchBarIcon: {
    resizeMode: "contain",
    height: "100%",
  },

  searchBarFilterBtn: {
    width: 46,
    height: "90%",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  searchBarTagBtn: {
    height: "90%",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
    marginRight: 8,
    borderWidth: 1,
  },

  searchBarFilterIcon: {
    resizeMode: "contain",
    height: "100%",
  },

  container: {
    flex: 1,
    width: "100%",
  },

  scrollContainer: {
    alignItems: "center",
    paddingBottom: 150,
  },

  linkStyle: {
    width: "100%",
  },

  scrollContent: {
    marginVertical: 16,
    alignItems: "center",
    alignContent: "center",
    width: "90%",
  },

  serviceBox: {
    height: 120,
    width: "100%",
    flexDirection: "row",
    borderRadius: 20,
  },

  serviceImageBox: {
    width: "33%",
    borderStartStartRadius: 20,
    borderBottomStartRadius: 20,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  serviceImage: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },

  serviceInfo: {
    flexDirection: "column",
    alignItems: "flex-start",
  },

  serviceTags: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  tagStyle: {
    marginTop: 4,
    marginLeft: 8,
    paddingHorizontal: 8,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  serviceNameStyle: {
    fontSize: 20,
    paddingLeft: 8,
    paddingTop: 8,
  },

  serviceRateStyle: {
    flexDirection: "row",
    alignItems: "center",
    paddingStart: 8,
  },
  ratingCount: {
    fontSize: 12,
    marginLeft: 8,
    textAlignVertical: "top",
  },

  searchContainer: {
    width: "100%",
    paddingBottom: 8,
  },
  searchBar: {
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  tagsContainer: {
    padding: 16,
    paddingVertical: 2,
  },
  tagChip: {
    marginRight: 8,
    borderWidth: 1,
  },
});
