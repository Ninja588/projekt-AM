import React from "react";
import {Button, Center, Text} from "native-base";

export default function LoginScreen({navigation}) {
    return (
        <Center flex={1}>
            <Text fontSize="2xl" mb={5}>Login / Rejestracja</Text>
            <Button onPress={() => navigation.replace("Tabs")}>
                Zaloguj się
            </Button>
        </Center>
    );
}
