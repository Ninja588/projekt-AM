import React, {useState} from "react";
import {Box, Text, ScrollView, Pressable, Divider, Switch, HStack} from "native-base";
import logo from  "../assets/images/kfc.png";
import {Image, StyleSheet, View} from "react-native"

import { useAuth } from "../backend/context/AuthContext";

export default function ProfileScreen() {
    const [notifications, setNotifications] = useState(true);

    const { logout, user } = useAuth();

    const styles = StyleSheet.create({
        profileImage: {
            borderColor: "gray",
            borderRadius: 50,
            borderWidth: 3,
            height: 150,
            width: 150,
        },
    });

    return (
        <Box flex={1} pt={20} px={5} bg={"white"} alignItems="center">
            <View>
                <Image style={styles.profileImage} source={logo} />
            </View>
            <Text fontSize={48} fontWeight="bold">{user.username}</Text>
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

                    <Pressable onPress={() => console.log("Zmien email")}>
                        <Text fontSize="md" mb={3}>
                            Zmień email
                        </Text>
                    </Pressable>
                    <Divider mb={3} />

                    <Pressable onPress={() => console.log("Zmien haslo")}>
                        <Text fontSize="md" mb={3}>
                            Zmień hasło
                        </Text>
                    </Pressable>
                    <Divider mb={3} />

                    <Pressable onPress={() => console.log("Zmien zdjecie profilowe")}>
                        <Text fontSize="md" mb={3}>
                            Zmień zdjęcie profilowe
                        </Text>
                    </Pressable>
                    <Divider mb={3} />

                    <Pressable onPress={() => logout()}>
                        <Text fontSize="md" color="red.500">
                            Wyloguj się
                        </Text>
                    </Pressable>
                </ScrollView>
            </Box>
        </Box>
    );
}
