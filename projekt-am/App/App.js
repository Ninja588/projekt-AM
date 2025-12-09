import React, {useEffect} from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootStack from "../navigation/stack";
import { NativeBaseProvider } from "native-base";
import { AuthProvider } from "../backend/context/AuthContext";
import { setupNotifications } from "../utils/notifications";

export default function App() {
    useEffect(() => {
        setupNotifications();
    }, []);

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
