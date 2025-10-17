import React, { useEffect, useState } from "react";
import { Center, Text, Button, Box } from "native-base";
import quotes from "../assets/quotes/quotes.json";

export default function MotivationScreen() {
    const [quote, setQuote] = useState(null);

    const getRandomQuote = () => {
        const random = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(random);
    };

    useEffect(() => {
        getRandomQuote();
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

            <Button mt={10} onPress={getRandomQuote} colorScheme="blue">
                Nowy cytat
            </Button>
        </Center>
    );
}
