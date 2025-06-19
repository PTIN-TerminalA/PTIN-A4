import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Platform } from "react-native";
import { BottomNavigation } from "react-native-paper";
import { CommonActions } from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Color from "color";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const themeColors = Colors[colorScheme ?? "light"];
  const translucentButton = Color(themeColors.button).alpha(0.5).rgb().string();
  const iconColor = Color(themeColors.box)
    .mix(Color(themeColors.text), 0.5)
    .rgb()
    .string();
  const routes = [
    { key: "explore", title: "Shopping" },
    { key: "flights", title: "Flights" },
    { key: "index", title: "Mapa" },
    { key: "chat", title: "Chat" },
    { key: "profile", title: "Profile" },
  ];

  return (
    <Tabs
      initialRouteName="index"
      backBehavior="initialRoute"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: themeColors.text,
        tabBarInactiveTintColor: themeColors.tabIconSelected,
        tabBarStyle: {
          position: "absolute",
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
      tabBar={({ navigation, state, descriptors }) => {
        const navigationState = state;

        return (
          <BottomNavigation.Bar
            navigationState={navigationState}
            shifting={false}
            style={[
              styles.bottomBar,
              {
                backgroundColor: themeColors.box,
                paddingBottom: insets.bottom,
                height: 80 + insets.bottom,
              },
            ]}
            activeIndicatorStyle={[
              styles.activeIndicator,
              { backgroundColor: translucentButton },
            ]}
            labeled={true}
            onTabPress={({ route }) => {
              const tabIndex = navigationState.routes.findIndex(
                (r) => r.key === route.key
              );
              if (tabIndex !== -1 && tabIndex !== state.index) {
                // update index is unnecessary because React Navigation controls index internally
                navigation.navigate(route.name); // <-- Use route.name, not route.key here
              }
            }}
            renderIcon={({ route, focused }) => {
              const { options } = descriptors[route.key];
              const color = themeColors.tint;
              return options.tabBarIcon?.({ focused, color, size: 24 }) || null;
            }}
            getLabelText={({ route }) => {
              const { options } = descriptors[route.key];
              return options.title || route.name;
            }}
          />
        );
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: "Serveis",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "shopping" : "shopping-outline"}
              color={
                focused
                  ? Color(color)
                      .mix(Color(themeColors.button), 0.3)
                      .rgb()
                      .string()
                  : color
              }
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="flights"
        options={{
          title: "Vols",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "shield-airplane" : "shield-airplane-outline"}
              color={
                focused
                  ? Color(color)
                      .mix(Color(themeColors.button), 0.3)
                      .rgb()
                      .string()
                  : color
              }
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Mapa",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "map" : "map-outline"}
              color={
                focused
                  ? Color(color)
                      .mix(Color(themeColors.button), 0.3)
                      .rgb()
                      .string()
                  : color
              }
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "chat" : "chat-outline"}
              color={
                focused
                  ? Color(color)
                      .mix(Color(themeColors.button), 0.3)
                      .rgb()
                      .string()
                  : color
              }
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "account" : "account-outline"}
              color={
                focused
                  ? Color(color)
                      .mix(Color(themeColors.button), 0.3)
                      .rgb()
                      .string()
                  : color
              }
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderTopWidth: 0,
  },
  activeIndicator: {
    borderRadius: 16,
    height: 32,
  },
});
