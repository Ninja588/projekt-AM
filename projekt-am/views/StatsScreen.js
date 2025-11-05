import React from "react";
import { Dimensions, ScrollView } from "react-native";
import { Box, Center, Text, VStack } from "native-base";
import { BarChart } from "react-native-chart-kit";

export default function StatsScreen() {
    const screenWidth = Dimensions.get("window").width - 64;

    return (
        <Box flex={1} bg="#f3f4f6">
            <ScrollView
                contentContainerStyle={{
                    paddingTop: 60,
                    paddingBottom: 40,
                    alignItems: "center",
                }}
            >
                <Center>
                    <VStack space={5} alignItems="center" w="90%">
                        <VStack space={1} alignItems="center">
                            <Text fontSize="3xl" fontWeight="bold" color="black">
                                Statystyki zadań
                            </Text>
                            <Text fontSize="md" color="black">
                                Podsumowanie tygodnia
                            </Text>
                        </VStack>
                        <Text
                            fontSize="lg"
                            fontWeight="semibold"
                            color="gray.500"
                            mb={0}
                            textAlign="center"
                        >
                            Liczba wykonanych zadań w tym tygodniu
                        </Text>
                        <BarChart
                            data={{
                                labels: ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Ndz"],
                                datasets: [{ data: [1, 2, 3, 5, 8, 9, 2] }],
                            }}
                            width={screenWidth}
                            height={220}
                            fromZero
                            showValuesOnTopOfBars
                            chartConfig={{
                                backgroundGradientFrom: "#6583fa",
                                backgroundGradientTo: "#002aff",
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                propsForBackgroundLines: {
                                    stroke: "rgba(255, 255, 255, 0.2)",
                                },
                                barPercentage: 0.5,
                            }}
                            style={{
                                borderRadius: 16,
                            }}
                         yAxisLabel="" yAxisSuffix=""
                        />

                        <Text
                            fontSize="lg"
                            fontWeight="semibold"
                            color="gray.500"
                            mb={3}
                            textAlign="center"
                        >
                            Liczba niewykonanych zadań w tym tygodniu
                        </Text>
                        <BarChart
                            data={{
                                labels: ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Ndz"],
                                datasets: [{ data: [0, 1, 2, 0, 1, 3, 2] }],
                            }}
                            width={screenWidth}
                            height={220}
                            fromZero
                            showValuesOnTopOfBars
                            chartConfig={{
                                backgroundGradientFrom: "#f87171",
                                backgroundGradientTo: "#b91c1c",
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                propsForBackgroundLines: {
                                    stroke: "rgba(255, 255, 255, 0.2)",
                                },
                                barPercentage: 0.5,
                            }}
                            style={{
                                borderRadius: 16,
                            }}
                            yAxisLabel="" yAxisSuffix=""
                        />
                    </VStack>
                </Center>
            </ScrollView>
        </Box>
    );
}
