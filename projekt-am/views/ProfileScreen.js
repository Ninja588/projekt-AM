import React, { useState } from "react";
import {Box, Text, ScrollView, Pressable, Divider, Switch, HStack, Button} from "native-base";
import {Image, StyleSheet, View, TextInput, Alert} from "react-native";
import logo from "../assets/images/blank.png";
import axiosInstance from "../backend/axiosInstance";
import { useAuth } from "../backend/context/AuthContext";

import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
    const { user, logout, refresh } = useAuth();
    const [notifications, setNotifications] = useState(true);

    const [showEmailForm, setShowEmailForm] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [emailLoading, setEmailLoading] = useState(false);

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);

    const styles = StyleSheet.create({
        profileImage: {
            borderColor: "gray",
            borderRadius: 50,
            borderWidth: 3,
            height: 150,
            width: 150,
        },
        input: {
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            padding: 10,
            marginBottom: 10,
            fontSize: 16,
        },
    });

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const res = await axiosInstance.patch(`/users/${user.id}`, {
                avatar: result.assets[0].uri
            });
            await refresh(res.data);
        }
    };

    const takeImage = async () => {
        if(await ImagePicker.requestCameraPermissionsAsync()) {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                const res = await axiosInstance.patch(`/users/${user.id}`, {
                    avatar: result.assets[0].uri
                });
                await refresh(res.data);
            }
        }
    }

    const handlePickImage = async () => {
        Alert.alert('Wybieranie zdjęcia profilowego', '', [
            {
                text: "Wybierz z galerii",
                onPress: () => pickImage(),
                style: "default"
            },
            {
                text: "Zrób zdjęcie aparatem",
                onPress: () => takeImage(),
                style: "default"
            },
            {
                text: "Anuluj",
                style: "cancel"
            }
        ]);
    }

    const handleEmailChange = async () => {
        if (!newEmail.trim()) {
            setEmailMessage("Wpisz nowy e-mail.");
            return;
        }

        try {
            setEmailLoading(true);
            setEmailMessage("");

            const res = await axiosInstance.patch(`/users/${user.id}`, {
                email: newEmail,
            });

            await refresh(res.data);
            setEmailMessage("E-mail został zaktualizowany!");
            setShowEmailForm(false);
            setNewEmail("");
        } catch (error) {
            console.error("Błąd aktualizacji e-maila:", error);
            setEmailMessage("Nie udało się zmienić e-maila.");
        } finally {
            setEmailLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        if (!oldPassword.trim() || !newPassword.trim()) {
            setPasswordMessage("Podaj stare i nowe hasło.");
            return;
        }

        try {
            setPasswordLoading(true);
            setPasswordMessage("");

            const response = await axiosInstance.get(`/users/${user.id}`);
            const currentUser = response.data;

            if (currentUser.password !== oldPassword) {
                setPasswordMessage("Stare hasło jest nieprawidłowe.");
                setPasswordLoading(false);
                return;
            }

            const res = await axiosInstance.patch(`/users/${user.id}`, {
                password: newPassword,
            });

            await refresh(res.data);
            setPasswordMessage("Hasło zostało pomyślnie zmienione!");
            setShowPasswordForm(false);
            setOldPassword("");
            setNewPassword("");
        } catch (error) {
            console.error("Błąd zmiany hasła:", error);
            setPasswordMessage("Nie udało się zmienić hasła.");
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <Box flex={1} pt={20} px={5} bg="white" alignItems="center">
            <View>
                <Image style={styles.profileImage} source={user.avatar !== null ? {uri: user.avatar} : logo} />
            </View>

            <Text fontSize={32} fontWeight="bold" mt={3}>
                {user.username}
            </Text>

            <Box
                mt={6}
                mb={6}
                rounded="2xl"
                shadow={3}
                bg="gray.100"
                width="100%"
                flex={1}
                p={4}
            >
                <ScrollView>
                    <HStack justifyContent="space-between" alignItems="center" mb={3}>
                        <Text fontSize="md">Powiadomienia</Text>
                        <Switch
                            isChecked={notifications}
                            onToggle={() => setNotifications(!notifications)}
                            colorScheme="blue"
                        />
                    </HStack>
                    <Divider mb={3} />

                    {!showEmailForm ? (
                        <Pressable onPress={() => setShowEmailForm(true)}>
                            <Text fontSize="md" mb={3} color="blue.600">
                                Zmień email
                            </Text>
                        </Pressable>
                    ) : (
                        <Box>
                            <Text mb={2}>Nowy adres e-mail:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="np. nowy@mail.com"
                                value={newEmail}
                                onChangeText={setNewEmail}
                                autoCapitalize="none"
                            />
                            <HStack justifyContent="space-between">
                                <Button
                                    onPress={handleEmailChange}
                                    isLoading={emailLoading}
                                    colorScheme="blue"
                                    mb={3}
                                >
                                    Zapisz
                                </Button>
                                <Button
                                    variant="ghost"
                                    onPress={() => {
                                        setShowEmailForm(false);
                                        setNewEmail("");
                                        setEmailMessage("");
                                    }}
                                >
                                    Anuluj
                                </Button>
                            </HStack>
                            {emailMessage ? (
                                <Text
                                    mt={2}
                                    color={
                                        emailMessage.includes("błąd") ? "red.500" : "green.500"
                                    }
                                >
                                    {emailMessage}
                                </Text>
                            ) : null}
                        </Box>
                    )}

                    <Divider mb={3} />

                    {!showPasswordForm ? (
                        <Pressable onPress={() => setShowPasswordForm(true)}>
                            <Text fontSize="md" mb={3} color="blue.600">
                                Zmień hasło
                            </Text>
                        </Pressable>
                    ) : (
                        <Box>
                            <Text mb={2}>Obecne hasło:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Podaj obecne hasło"
                                secureTextEntry
                                value={oldPassword}
                                onChangeText={setOldPassword}
                            />
                            <Text mb={2}>Nowe hasło:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Podaj nowe hasło"
                                secureTextEntry
                                value={newPassword}
                                onChangeText={setNewPassword}
                            />
                            <HStack justifyContent="space-between">
                                <Button
                                    onPress={handlePasswordChange}
                                    isLoading={passwordLoading}
                                    colorScheme="blue"
                                    mb={3}
                                >
                                    Zapisz
                                </Button>
                                <Button
                                    variant="ghost"
                                    onPress={() => {
                                        setShowPasswordForm(false);
                                        setOldPassword("");
                                        setNewPassword("");
                                        setPasswordMessage("");
                                    }}
                                >
                                    Anuluj
                                </Button>
                            </HStack>
                            {passwordMessage ? (
                                <Text
                                    mt={2}
                                    color={
                                        passwordMessage.includes("błąd") ||
                                        passwordMessage.includes("nie udało")
                                            ? "red.500"
                                            : "green.500"
                                    }
                                >
                                    {passwordMessage}
                                </Text>
                            ) : null}
                        </Box>
                    )}

                    <Divider mb={3} />

                    <Pressable onPress={() => handlePickImage()}>
                        <Text fontSize="md" mb={3}>
                            Zmień zdjęcie profilowe
                        </Text>
                    </Pressable>
                    <Divider mb={3} />

                    <Pressable onPress={logout}>
                        <Text fontSize="md" color="red.500">
                            Wyloguj się
                        </Text>
                    </Pressable>
                </ScrollView>
            </Box>
        </Box>
    );
}
