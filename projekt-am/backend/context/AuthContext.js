import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("user");
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                    navigation.reset( {
                        index: 0,
                        routes: [{ name: "Tabs" }],
                    });
                }
            } catch (error) {
                console.error("Błąd ładowania danych użytkownika:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadUser();
    }, []);

    const login = async (userData) => {
        try {
            setUser(userData);
            await AsyncStorage.setItem("user", JSON.stringify(userData));

            navigation.reset({
                index: 0,
                routes: [{ name: "Tabs" }],
            });
        } catch (error) {
            console.error("Błąd podczas logowania:", error);
        }
    };

    const logout = async () => {
        try {
            navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
            });
            setUser(null);
            await AsyncStorage.removeItem("user");
        } catch (error) {
            console.error("Błąd podczas wylogowania:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth() musi być użyty wewnątrz <AuthProvider>");
    }
    return context;
};
