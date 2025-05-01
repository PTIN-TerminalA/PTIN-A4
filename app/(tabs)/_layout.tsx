import { Tabs } from "expo-router";
import React from "react";
import { Platform, Image } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000000",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarShowLabel: false,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Map",
          tabBarIcon: ({ color }) => (
            <Image source={require('../../assets/images/Icons/mapa.png')} style={{ width: 24, height: 24, tintColor: color }} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Shopping",
          tabBarIcon: ({ color }) => (
            <Image source={require('../../assets/images/Icons/shopping.png')} style={{ width: 24, height: 24, tintColor: color }} />
          ),
        }}
      />
      <Tabs.Screen
        name="flights"
        options={{
          title: "Flights",
          tabBarIcon: ({ color }) => (
            <Image source={require('../../assets/images/Icons/scanner.png')} style={{ width: 24, height: 24, tintColor: color }} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => (
            <Image source={require('../../assets/images/Icons/chatting.png')} style={{ width: 24, height: 24, tintColor: color }} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Image source={require('../../assets/images/Icons/user.png')} style={{ width: 24, height: 24, tintColor: color }} />
          ),
        }}
      />
      <Tabs.Screen
        name="edit-name"
        options={{
          //Not showing edit-name page until we need it
          href: null,
        }}
      />
      <Tabs.Screen
        name="edit-password"
        options={{
          //Not showing edit-password page until we need it
          href: null,
        }}
      />
      <Tabs.Screen
        name="edit-birthdate"
        options={{
          //Not showing edit-password page until we need it
          href: null,
        }}
      />
    </Tabs>
  );
}
