import React, { useState } from "react";
import {Button, Text, VStack, HStack, Pressable, Center} from "native-base";
import {Keyboard, TextInput, TouchableWithoutFeedback, StyleSheet} from "react-native";

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [registerSwitch, setRegisterSwitch] = useState(false);

    const handleLogin = () => {
        if (username.trim() === "") {
            alert("Podaj nazwę użytkownika!");
            return;
        }
        if (username.trim() === "admin" && password.trim() === "admin") {
            navigation.replace("Tabs");
            return;
        }
        alert("Błędny login lub hasło!");
    };

    const handleRegister = () => {
        if (username.trim() === "") {
            alert("Podaj nazwę użytkownika!");
            return;
        }
        else if (email.trim() === "") {
            alert("Podaj email!");
            return;
        }
        else if (password.trim() === "") {
            alert("Podaj hasło!");
            return;
        }
        alert("Konto zostało pomyślnie utworzone!")
        handleShowRegister();
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
