import {
  View,
  Image,
  StyleSheet,
  Text,
  useColorScheme,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  Pressable,
} from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { Fragment } from "react";
import { Colors } from "@/constants/Colors";
import { useServiceContext } from "@/contexts/ServiceContext";
import StarRating from "@/components/StarRating";
import useAverageValoration from "@/hooks/useAverageValoration";
import PriceDisplay from "@/components/PriceAvg";
import DirectionButton from "@/components/DirectionButton";
import ScheduleStatus from "@/components/ScheduleStatus";
import { ThemedPressable } from "@/components/ThemedPressable";

export default function ServiceInfoScreen() {
  const colorScheme = useColorScheme() || "light";
  const { id } = useLocalSearchParams<{ id: string }>();
  const { services } = useServiceContext();
  const service = services?.find((p) => p.id === Number(id));

  if (!service) {
    return <Text>Servei no trobat</Text>;
  }

  const handleGoWebsite = (url?: string) => {
    if (!url) return;

    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
    Linking.openURL(formattedUrl).catch(console.error);
  };

  const { average, count } = useAverageValoration(service.valorations ?? []);


  const handleValorationPress= (id: number) => {
    router.push({
      pathname: "/serviceInfo/make-valoration",
      params: { id },
    })
  }
  return (
    <Fragment>
      {/* Titol de la pantalla */}
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerStyle: { backgroundColor: Colors[colorScheme].box },
          headerShadowVisible: false,
        }}
      ></Stack.Screen>

      <SafeAreaView
        style={[styles.container, { backgroundColor: Colors[colorScheme].box }]}
      >
        
        <ThemedText style={[{ fontSize: 40 }, { lineHeight: 40 }]} type="title">
          {service.name}
        </ThemedText>
        
        <View style={[styles.serviceStyle]}>
          <StarRating starSize={25} rating={average}></StarRating>
          <ThemedText type="default" style={styles.ratingCount}>
            ({count || 0})
          </ThemedText>
          
          {service.avg_price && (
            <PriceDisplay
              containerStyle={styles.priceStyle}
              avgPrice={service.avg_price}
              showCategory={true}
              intervalStyle={{ fontSize: 20 }}
              categoryStyle={{ fontSize: 16 }}
            ></PriceDisplay>
          )}
        </View>

        <View style={[styles.serviceStyle, { paddingTop: 16 }]}>
          <DirectionButton></DirectionButton>
          <View style={{ width: 8 }}></View>
          {service.link && (
            <DirectionButton
              label="Visita la Web"
              buttonStyle={[
                { borderWidth: 1 },
                { borderColor: Colors[colorScheme].tint },
                { backgroundColor: Colors[colorScheme].box },
              ]}
              onPress={() => handleGoWebsite(service.link!)}
              iconSource={
                colorScheme === "dark"
                  ? require("@/assets/images/Icons/website_darkmode.png")
                  : require("@/assets/images/Icons/website_lightmode.png")
              }
            ></DirectionButton>
          )}
        </View>
      </SafeAreaView>

      <ScrollView
        style={{ backgroundColor: Colors[colorScheme].background }}
        contentContainerStyle={[styles.scheduleBox]}
        showsVerticalScrollIndicator={false}
      >
        {Array.isArray(service.schedules) && (
          <ScheduleStatus schedules={service.schedules} />
        )}
        <View style={[styles.imageBox]}>
          <Image
            style={[styles.imageStyle]}
            source={
              typeof service.ad_path === "string"
                ? { uri: service.ad_path }
                : service.ad_path
            }
          ></Image>
        </View>
      <ThemedPressable 
          style={[{ alignSelf:"center", width: "50%", height:50}]}
          onPress={() => handleValorationPress(service.id)}>
          <ThemedText style= {[{fontSize: 20}]} type = "bold">
            Valorar
          </ThemedText>
        </ThemedPressable>
      </ScrollView>
    </Fragment>


    
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 125,
    alignItems: "flex-start",
    paddingLeft: 16,
    elevation: 5,
  },
  serviceStyle: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  ratingCount: {
    fontSize: 20,
    marginLeft: 8,
    textAlignVertical: "top",
  },

  priceStyle: {
    textAlignVertical: "top",
    position: "absolute",
    right: 16,
  },

  scheduleBox: {
    width: "100%",
    paddingTop: 8,
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "center",
  },

  imageBox: {
    width: "100%",
    maxHeight: 400,
    overflow: "hidden",
    borderRadius: 30,
    marginTop: 16,
    alignItems: "center",
  },

  imageStyle: {
    resizeMode: "cover",
    borderRadius: 30,
  },
});
