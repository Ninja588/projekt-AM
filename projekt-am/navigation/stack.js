import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./tab";

import LoginScreen from "../views/LoginScreen";
import NoteDetailsScreen from "../views/NoteDetailsScreen";
import AddNoteScreen from "../views/AddNoteScreen";
import EditNoteScreen from "../views/EditNoteScreen";

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
                name="NoteDetails"
                component={NoteDetailsScreen}
                options={{ title: "Szczegóły notatki" }}
            />
            <Stack.Screen
                name="AddNote"
                component={AddNoteScreen}
                options={{ title: "Dodaj notatkę" }}
            />
            <Stack.Screen
                name="EditNote"
                component={EditNoteScreen}
                options={{ title: "Edytuj notatkę" }}
            />
        </Stack.Navigator>
    );
}

export default RootStack;
