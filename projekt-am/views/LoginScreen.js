import React, { useState } from "react";
import {Button, Text, VStack, HStack, Pressable, Center} from "native-base";
import {Keyboard, TextInput, TouchableWithoutFeedback, StyleSheet} from "react-native";
import axiosInstance from "../backend/axiosInstance";

import { useAuth } from "../backend/context/AuthContext";

export default function LoginScreen() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [registerSwitch, setRegisterSwitch] = useState(false);

    const { login } = useAuth();

    const handleLogin = async () => {
        if (username.trim() === "" || password.trim() === "") {
            alert("Podaj login i hasło!");
            return;
        }

        try {
            const response = await axiosInstance.get(`/users?username=${username}&password=${password}`);
            if (response.data.length > 0) {
                const user = response.data[0];
                alert(`Witaj, ${user.username}!`);
                await login(user);
            } else {
                alert("Błędny login lub hasło!");
            }
        } catch (error) {
            console.error("Błąd logowania:", error);
            alert("Wystąpił błąd przy logowaniu.");
        }
    };

    const handleRegister = async () => {
        if (!username.trim() || !email.trim() || !password.trim()) {
            alert("Wypełnij wszystkie pola!");
            return;
        }

        try {
            const checkUser = await axiosInstance.get(`/users?username=${username}`);
            if (checkUser.data.length > 0) {
                alert("Taki użytkownik już istnieje!");
                return;
            }

            const newUser = {
                username,
                email,
                password,
                avatar: null
            };

            await axiosInstance.post("/users", newUser);
            alert("Konto zostało utworzone!");
            handleShowRegister();
        } catch (error) {
            console.error("Błąd rejestracji:", error);
            alert("Wystąpił błąd przy rejestracji.");
        }
    };

    const handleShowRegister = () => {
        setRegisterSwitch(!registerSwitch);
        setUsername("");
        setEmail("");
        setPassword("");
    }

    const showLogin = () => {
        return (
            <VStack space={5} w="100%" maxW="300px">
                <Text fontSize="2xl" fontWeight="bold" textAlign="center">
                    Zaloguj się
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nazwa użytkownika"
                    value={username}
                    onChangeText={setUsername}
                    placeholderTextColor="gray"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Hasło"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                    placeholderTextColor="gray"
                />

                <Button onPress={handleLogin} colorScheme="blue">
                    Zaloguj się
                </Button>

                <HStack justifyContent="center" space={1}>
                    <Text>Nie masz konta?</Text>
                    <Pressable onPress={handleShowRegister}>
                        <Text fontWeight="bold" color="blue.500">
                            Zarejestruj się
                        </Text>
                    </Pressable>
                </HStack>
            </VStack>
        );
    }

    const showRegister = () => {
        return (
            <VStack space={5} w="100%" maxW="300px">
                <Text fontSize="2xl" fontWeight="bold" textAlign="center">
                    Zarejestruj się
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nazwa użytkownika"
                    value={username}
                    onChangeText={setUsername}
                    placeholderTextColor="gray"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="gray.500"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Hasło"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="gray"
                />

                <Button onPress={handleRegister} colorScheme="blue">
                    Zarejestruj się
                </Button>

                <HStack justifyContent="center" space={1}>
                    <Text>Masz już konto?</Text>
                    <Pressable onPress={handleShowRegister}>
                        <Text fontWeight="bold" color="blue.500">
                            Powrót do ekranu logowania
                        </Text>
                    </Pressable>
                </HStack>
            </VStack>
        );
    }

    const styles = StyleSheet.create({
        input: {
            height: 40,
            borderWidth: 1,
            padding: 10,
        },
    });

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Center flex={1}>
                {registerSwitch ? showRegister() : showLogin()}
            </Center>
        </TouchableWithoutFeedback>
    );
}
