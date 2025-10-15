import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./tab";

import LoginScreen from "../views/LoginScreen";
import TaskDetailsScreen from "../views/TaskDetailsScreen";
import AddEditTaskScreen from "../views/AddEditTaskScreen";

const Stack = createNativeStackNavigator();

const options = {
    headerShown: false,
};

function RootStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} options={options} />
            <Stack.Screen name="Tabs" component={Tabs} options={options} />
            <Stack.Screen
                name="TaskDetails"
                component={TaskDetailsScreen}
                options={{ title: "Szczegóły zadania" }}
            />
            <Stack.Screen
                name="AddEditTask"
                component={AddEditTaskScreen}
                options={{ title: "Dodaj / Edytuj zadanie" }}
            />
        </Stack.Navigator>
    );
}

export default RootStack;
