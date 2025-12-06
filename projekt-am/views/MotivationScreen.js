import React, {useEffect, useRef, useState} from "react";
import { Center, Text, Button, Box } from "native-base";
import quotes from "../assets/quotes/quotes.json";
import { Accelerometer } from "expo-sensors";

export default function MotivationScreen() {
    const [quote, setQuote] = useState(null);
    const [dailyQuote, setDailyQuote] = useState(null);

    const lastShake = useRef(0);

    const getRandomQuote = () => {
        const random = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(random);
    };

    const getQuoteOfADay = () => {
        const date = new Date();

        const dayOfYear = Math.floor(
            (date - new Date(date.getFullYear(), 0, 0)) / 86400000 // 86400000 to liczba ms w dniu
        );

        const index = dayOfYear % quotes.length;
        const dailyQuote = quotes[index];

        setDailyQuote(dailyQuote);
    }

    useEffect(() => {
        getRandomQuote();
        getQuoteOfADay();

        Accelerometer.setUpdateInterval(100);

        const subscription = Accelerometer.addListener((data) => {
            const { x, y, z } = data;

            const acceleration = Math.sqrt(x*x + y*y + z*z);

            const sensitivity = 1.78;

            if (acceleration >= sensitivity) {
                const now = Date.now();
                if (now - lastShake.current > 500) {
                    lastShake.current = now;
                    getRandomQuote();
                }
            }
        });

        return () => {
            subscription && subscription.remove();
        };
    }, []);

    return (
        <Center flex={1} px={5} bg="white">
            <Box
                p={5}
                rounded="2xl"
                shadow={3}
                bg="gray.100"
                w="100%"
                maxW="90%"
                alignItems="center"
            >
                <Text fontSize="lg" italic textAlign="center">
                    “{quote?.text || "Ładowanie cytatu..."}”
                </Text>
                <Text fontSize="sm" mt={2} textAlign="center" color="gray.500">
                    ~ Autorzy aplikacji
                </Text>
            </Box>

            <Button mt={10} onPress={getRandomQuote} colorScheme="blue" rounded="2xl">
                Nowy cytat
            </Button>

            <Text fontSize="xs" color="gray.400" mt={2}>
                (lub potrząśnij telefonem)
            </Text>

            <Box
                position={"absolute"}
                bottom={8}
                p={1}
                mb={8}
                rounded="2xl"
                shadow={3}
                bg="gray.100"
                w="100%"
                maxW="90%"
                alignItems="center"
            >
                <Text fontSize="lg" textAlign="center" bold>
                    Cytat dnia:
                </Text>
                <Text fontSize="md" mt={2} italic textAlign="center">
                    "{dailyQuote?.text || "Błąd w pobieraniu cytatu"}"
                </Text>
            </Box>
        </Center>
    );
}
