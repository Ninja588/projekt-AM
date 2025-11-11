import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Box, Text, VStack, HStack, Spinner } from "native-base";
import CalendarPicker from "react-native-calendar-picker";
import axiosInstance from "../backend/axiosInstance";
import { useAuth } from "../backend/context/AuthContext";
import { useIsFocused, useNavigation } from "@react-navigation/native";

export default function CalendarScreen() {
    const { user } = useAuth();
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    const [selectedDate, setSelectedDate] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    const formatDate = (date) => {
        if (!date) return "";
        const d = date.getDate().toString().padStart(2, "0");
        const m = (date.getMonth() + 1).toString().padStart(2, "0");
        const y = date.getFullYear();
        return `${d}.${m}.${y}`;
    };

    const fetchTasks = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/tasks?userId=${user.id}`);
            setTasks(res.data || []);
        } catch (error) {
            console.error("Błąd podczas pobierania zadań:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [isFocused]);

    const getTasksForDate = () => {
        if (!selectedDate) return [];

        const targetDay = selectedDate.getDate();
        const targetMonth = selectedDate.getMonth() + 1;
        const targetYear = selectedDate.getFullYear();

        return tasks.filter((t) => {
            if (!t.date) return false;
            const parts = t.date.split(".");
            if (parts.length < 2) return false;

            const taskDay = parseInt(parts[0], 10);
            const taskMonth = parseInt(parts[1], 10);
            const taskYear =
                parts.length === 3 ? parseInt(parts[2], 10) : targetYear;

            if (
                Number.isNaN(taskDay) ||
                Number.isNaN(taskMonth) ||
                Number.isNaN(taskYear)
            ) {
                return false;
            }

            return (
                taskDay === targetDay &&
                taskMonth === targetMonth &&
                taskYear === targetYear
            );
        });
    };

    const tasksForSelectedDate = getTasksForDate();

    const onDateChange = (date) => {
        if (!date) {
            setSelectedDate(null);
            return;
        }
        const jsDate = typeof date.toDate === "function" ? date.toDate() : date;
        setSelectedDate(jsDate);
    };

    const openTaskDetails = (taskId) => {
        navigation.navigate("TaskDetails", { itemId: taskId });
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
            <Box
                p={5}
                mt={20}
                rounded="2xl"
                shadow={3}
                bg="gray.100"
                w="95%"
                alignSelf="center"
            >
                <CalendarPicker
                    onDateChange={onDateChange}
                    months={[
                        "Styczeń",
                        "Luty",
                        "Marzec",
                        "Kwiecień",
                        "Maj",
                        "Czerwiec",
                        "Lipiec",
                        "Sierpień",
                        "Wrzesień",
                        "Październik",
                        "Listopad",
                        "Grudzień",
                    ]}
                    weekdays={["Pon", "Wto", "Śro", "Czw", "Pią", "Sob", "Nie"]}
                    startFromMonday={true}
                    previousTitle="Poprzedni"
                    nextTitle="Następny"
                    todayBackgroundColor="#e0e7ff"
                    selectedDayColor="#3b82f6"
                    selectedDayTextColor="#fff"
                />

                <Text mt={4} fontWeight="bold" textAlign="center" fontSize="md">
                    {selectedDate
                        ? `Wybrana data: ${formatDate(selectedDate)}`
                        : "Wybierz datę, aby zobaczyć zadania"}
                </Text>
            </Box>

            {/* Lista zadań dla wybranego dnia */}
            <Box px={5} mt={6} mb={8}>
                {loading && (
                    <HStack
                        space={2}
                        justifyContent="center"
                        alignItems="center"
                        mt={4}
                    >
                        <Spinner size="lg" color="blue.500" />
                        <Text>Wczytywanie zadań...</Text>
                    </HStack>
                )}

                {!loading && selectedDate && (
                    <>
                        {tasksForSelectedDate.length > 0 ? (
                            <VStack space={3} mt={4}>
                                {tasksForSelectedDate.map((task) => (
                                    <TouchableOpacity
                                        key={task.id}
                                        activeOpacity={0.7}
                                        onPress={() =>
                                            openTaskDetails(task.id)
                                        }
                                    >
                                        <Box
                                            p={4}
                                            rounded="2xl"
                                            bg={task.done ? "green.100" : "red.100"}
                                            shadow={1}
                                        >
                                            <HStack
                                                justifyContent="space-between"
                                                alignItems="center"
                                            >
                                                <VStack>
                                                    <Text
                                                        fontSize="lg"
                                                        fontWeight="bold"
                                                        color={
                                                            task.done
                                                                ? "green.700"
                                                                : "black"
                                                        }
                                                    >
                                                        {task.title}
                                                    </Text>
                                                </VStack>
                                                <Text
                                                    fontSize="sm"
                                                    fontWeight="bold"
                                                    color={
                                                        task.priority ===
                                                        "Wysoki"
                                                            ? "red.500"
                                                            : task.priority ===
                                                            "Średni"
                                                                ? "orange.400"
                                                                    : task.priority ===
                                                                    "Niski"
                                                                    ? "green.500"
                                                                    :"gray.500"
                                                    }
                                                >
                                                    {task.priority}
                                                </Text>
                                            </HStack>
                                        </Box>
                                    </TouchableOpacity>
                                ))}
                            </VStack>
                        ) : (
                            <Text
                                textAlign="center"
                                color="gray.500"
                                mt={4}
                            >
                                Brak zadań w wybranym dniu
                            </Text>
                        )}
                    </>
                )}

                {!loading && !selectedDate && (
                    <Text textAlign="center" color="gray.400" mt={4}>
                        Najpierw wybierz dzień z kalendarza.
                    </Text>
                )}
            </Box>
        </ScrollView>
    );
}
