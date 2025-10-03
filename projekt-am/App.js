import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootStack from "./navigation/stack";
import { NativeBaseProvider } from "native-base";

export default function App() {
    return (
        <NativeBaseProvider>
            <NavigationContainer>
                <RootStack />
            </NavigationContainer>
        </NativeBaseProvider>
    );
}
