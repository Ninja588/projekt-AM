import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView } from "react-native";
import { Box, Center, Text, VStack } from "native-base";
import { BarChart } from "react-native-chart-kit";
import axiosInstance from "../backend/axiosInstance";
import { useAuth } from "../backend/context/AuthContext";
import { useIsFocused } from "@react-navigation/native";

export default function StatsScreen() {
    const screenWidth = Dimensions.get("window").width - 64;
    const { user } = useAuth();
    const isFocused = useIsFocused();

    const [doneData, setDoneData] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [undoneData, setUndoneData] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [weekRange, setWeekRange] = useState("");
    const [doneCount, setDoneCount] = useState(0);
    const [allCount, setAllCount] = useState(0);
    const [percentage, setPercentage] = useState(0);

    // Funkcja do obliczenia zakresu tygodnia (poniedziałek - niedziela)
    const getWeekRange = () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const sundayOffset = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

        const monday = new Date(today);
        monday.setDate(today.getDate() + mondayOffset);

        const sunday = new Date(today);
        sunday.setDate(today.getDate() + sundayOffset);

        const formatDate = (date) => {
            const d = date.getDate().toString().padStart(2, "0");
            const m = (date.getMonth() + 1).toString().padStart(2, "0");
            return `${d}.${m}`;
        };

        setWeekRange(`${formatDate(monday)} - ${formatDate(sunday)}`);

        return { monday, sunday };
    };

    const fetchStats = async () => {
        if (!user) return;

        try {
            const { monday, sunday } = getWeekRange();
            const res = await axiosInstance.get(`/tasks?userId=${user.id}`);
            const tasks = res.data;

            const done = Array(7).fill(0);
            const undone = Array(7).fill(0);

            tasks.forEach((task) => {
                if (!task.date) return;

                const [d, m] = task.date.split(".");
                const taskDate = new Date(new Date().getFullYear(), parseInt(m) - 1, parseInt(d));

                if (taskDate >= monday && taskDate <= sunday) {
                    const dayIndex = (taskDate.getDay() + 6) % 7;
                    if (task.done) done[dayIndex]++;
                    else undone[dayIndex]++;
                }
            });

            setDoneData(done);
            setUndoneData(undone);
            const doneSum = done.reduce((a, b) => a + b, 0);
            const undoneSum = undone.reduce((a, b) => a + b, 0);
            const allSum = doneSum + undoneSum;

            setDoneCount(doneSum);
            setAllCount(allSum);

            const percent = allSum === 0 ? 0 : Math.round((doneSum / allSum) * 100);
            setPercentage(percent);

        } catch (error) {
            console.error("Błąd podczas pobierania statystyk:", error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [isFocused]);
    const getEmojiForPercentage = (percent) => {
        if (percent <= 25) return "😢";
        if (percent <= 50) return "😕";
        if (percent <= 75) return "🙂";
        return "😄";
    };

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
                            <Text fontSize="3xl" fontWeight="bold" color="black" mt={-4}>
                                Statystyki zadań
                            </Text>
                            <Text fontSize="md" color="black">
                                {weekRange}
                            </Text>
                        </VStack>

                        {/*  WYKONANE */}
                        <Text
                            fontSize="lg"
                            fontWeight="semibold"
                            mt={-3}
                            textAlign="center"
                        >
                            <Text color="green.600">Wykonane zadania</Text>
                            <Text color="coolGray.600">/</Text>
                            <Text color="red.500">Zadania do wykonania</Text>
                        </Text>
                        <Text
                            fontSize="xl"
                            fontWeight="bold"
                            mt={-4}
                            mb={-5}
                            textAlign="center"
                        >
                            <Text color="green.600">{doneCount}</Text>
                            <Text color="coolGray.600">/</Text>
                            <Text color="red.500">{allCount}</Text>
                        </Text>
                        <Text
                            fontSize="lg"
                            fontWeight="semibold"
                            color="gray.500"
                            mb={0}
                            textAlign="center"
                        >
                            <Text color="gray.500">Wynik procentowy:</Text> {percentage}%
                        </Text>
                        <Text fontSize="3xl" mt={-4} textAlign="center">
                            {getEmojiForPercentage(percentage)}
                        </Text>

                        <Text
                            fontSize="lg"
                            fontWeight="semibold"
                            color="green.600"
                            mb={0}
                            textAlign="center"
                        >
                            Liczba wykonanych zadań w tym tygodniu
                        </Text>
                        <BarChart
                            data={{
                                labels: ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Ndz"],
                                datasets: [{ data: doneData }],
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
                            style={{ borderRadius: 16 }}
                            yAxisLabel=""
                            yAxisSuffix=""
                        />

                        {/*  NIEWYKONANE */}
                        <Text
                            fontSize="lg"
                            fontWeight="semibold"
                            color="red.600"
                            mb={3}
                            textAlign="center"
                        >
                            Liczba niewykonanych zadań w tym tygodniu
                        </Text>
                        <BarChart
                            data={{
                                labels: ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Ndz"],
                                datasets: [{ data: undoneData }],
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
                            style={{ borderRadius: 16 }}
                            yAxisLabel=""
                            yAxisSuffix=""
                        />
                    </VStack>
                </Center>
            </ScrollView>
        </Box>
    );
}
