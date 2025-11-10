import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import TaskListScreen from "../views/TaskListScreen";
import CalendarScreen from "../views/CalendarScreen";
import StatsScreen from "../views/StatsScreen";
import ProfileScreen from "../views/ProfileScreen";
import MotivationScreen from "../views/MotivationScreen";
import TodayTaskScreen from "../views/TodayTaskScreen";
import IncomingTaskScreen from "../views/IncomingTaskScreen";

const Tab = createBottomTabNavigator();

function Tabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ size, focused }) => {
                    let iconName;
                    let color = focused ? "#007AFF" : "gray";

                    switch (route.name) {
                        // case "Zadania":
                        //     iconName = "list-outline";
                        //     break;
                        case "Nadchodzące":
                            iconName = "list-outline";
                            break;
                        case "Dziś":
                            iconName = "list-outline";
                            break;
                        case "Kalendarz":
                            iconName = "calendar-outline";
                            break;
                        case "Statystyki":
                            iconName = "bar-chart-outline";
                            break;
                        case "Profil":
                            iconName = "person-outline";
                            break;
                        case "Motywacja":
                            iconName = "sparkles-outline";
                            break;
                        default:
                            iconName = "ellipse-outline";
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarLabelStyle: { fontSize: 12 },
                tabBarActiveTintColor: "#007AFF",
                tabBarInactiveTintColor: "gray",
                headerShown: false,
            })}
        >
            {/*<Tab.Screen name="Zadania" component={TaskListScreen} />*/}
            <Tab.Screen name="Dziś" component={TodayTaskScreen} />
            <Tab.Screen name="Nadchodzące" component={IncomingTaskScreen} />
            <Tab.Screen name="Kalendarz" component={CalendarScreen} />
            <Tab.Screen name="Statystyki" component={StatsScreen} />
            <Tab.Screen name="Motywacja" component={MotivationScreen} />
            <Tab.Screen name="Profil" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

export default Tabs;
