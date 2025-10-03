import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import NotesListScreen from "../views/NotesList";
import GalleryScreen from "../views/GalleryScreen";
import AudioScreen from "../views/AudioScreen";
import ProfileScreen from "../views/ProfileScreen";

const Tab = createBottomTabNavigator();

function Tabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ size, focused }) => {
                    let iconName;
                    let color = focused ? "red" : "gray";

                    switch (route.name) {
                        case "Notatki":
                            iconName = "document-text-outline";
                            break;
                        case "Galeria":
                            iconName = "images-outline";
                            break;
                        case "Audio":
                            iconName = "mic-outline";
                            break;
                        case "Profil":
                            iconName = "person-outline";
                            break;
                        default:
                            iconName = "ellipse-outline";
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarLabelStyle: { fontSize: 12 },
                tabBarActiveTintColor: "red",
                tabBarInactiveTintColor: "gray",
                headerShown: false,
            })}
        >
            <Tab.Screen name="Notatki" component={NotesListScreen} />
            <Tab.Screen name="Galeria" component={GalleryScreen} />
            <Tab.Screen name="Audio" component={AudioScreen} />
            <Tab.Screen name="Profil" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

export default Tabs;
