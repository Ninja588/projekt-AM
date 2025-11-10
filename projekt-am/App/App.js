import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootStack from "../navigation/stack";
import { NativeBaseProvider } from "native-base";
import { AuthProvider } from "../backend/context/AuthContext";

export default function App() {
    return (
        <NativeBaseProvider>
            <NavigationContainer>
                <AuthProvider>
                    <RootStack />
                </AuthProvider>
            </NavigationContainer>
        </NativeBaseProvider>
    );
}
