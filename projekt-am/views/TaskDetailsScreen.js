import React, { useEffect, useState } from "react";
import { Image, Modal, TouchableOpacity } from "react-native";
import {Box, Text, Center, Spinner, Button, VStack, Badge, ScrollView, HStack} from "native-base";
import axiosInstance from "../backend/axiosInstance";

export default function TaskDetailsScreen({ route, navigation }) {
    const [taskId, setTaskId] = useState(null);
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);

    // state powiększenia
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {

        setTaskId(route.params.itemId);
        // console.log("ustawiono");
        // console.log(taskId, route.params);

    }, [route?.params?.taskId]);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                // console.log("skibid?");
                setLoading(true);
                const response = await axiosInstance.get(`/tasks/${taskId}`);
                setTask(response.data);
            } catch (error) {
                console.error("Błąd pobierania szczegółów zadania:", error);
            } finally {
                setLoading(false);
            }
        };

        if (taskId) fetchTask();
    }, [taskId]);

    const toggleDone = async () => {
        try {
            const updatedTask = { ...task, done: !task.done };
            await axiosInstance.put(`/tasks/${taskId}`, updatedTask);
            setTask(updatedTask);
        } catch (error) {
            console.error("Błąd aktualizacji statusu zadania:", error);
        }
    };

    if (loading) {
        return (
            <Center flex={1}>
                <Spinner size="lg" />
            </Center>
        );
    }

    if (!task) {
        return (
            <Center flex={1}>
                <Text>Nie znaleziono zadania</Text>
            </Center>
        );
    }

    return (
        <ScrollView flex={1} bg="white" p={5}>
            <VStack space={4}>
                <Text fontSize="2xl" bold>
                    {task.title}
                </Text>

                <Badge
                    colorScheme={task.done ? "green" : "red"}
                    alignSelf="flex-start"
                    p={2}
                >
                    {task.done ? "Zrobione" : "Do zrobienia"}
                </Badge>

                {/* zdjecia  */}
                {task.images && task.images.length > 0 ? (
                    <HStack space={2} flexWrap="wrap">
                        {task.images.map((uri) => (
                            <TouchableOpacity key={uri} onPress={() => setSelectedImage(uri)}>
                                <Image
                                    source={{ uri }}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: 10,
                                        marginBottom: 6
                                    }}
                                />
                            </TouchableOpacity>
                        ))}
                    </HStack>
                ) : (
                    <Text color="gray.400">Brak zdjęć</Text>
                )}

                {/* powiekszanie zdjecia */}
                <Modal visible={!!selectedImage} transparent={true}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            backgroundColor: "rgba(0,0,0,0.8)",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        onPress={() => setSelectedImage(null)}
                    >
                        {selectedImage && (
                            <Image
                                source={{ uri: selectedImage }}
                                style={{
                                    width: "90%",
                                    height: "70%",
                                    resizeMode: "contain"
                                }}
                            />
                        )}
                        <Text style={{ color: "white", marginTop: 20, fontSize: 18 }}>
                            Kliknij aby zamknąć
                        </Text>
                    </TouchableOpacity>
                </Modal>

                <Box>
                    <Text color="gray.500">Opis:</Text>
                    <Text fontSize="md">{task.description || "Brak opisu"}</Text>
                </Box>

                <Box>
                    <Text color="gray.500">Data:</Text>
                    <Text fontSize="md">{task.date || "Brak daty"}</Text>
                </Box>

                <Box>
                    <Text color="gray.500">Priorytet:</Text>
                    <Text fontSize="md">{task.priority}</Text>
                </Box>

                <Box>
                    <Text color="gray.500">Tagi:</Text>
                    <Text fontSize="md">
                        {task.tags && task.tags.length > 0 ? task.tags.join(", ") : "Brak tagów"}
                    </Text>
                </Box>

                <VStack space={3} mt={5}>
                    <Button colorScheme={task.done ? "red" : "green"} onPress={toggleDone}>
                        {task.done ? "Oznacz jako niezrobione" : "Oznacz jako zrobione"}
                    </Button>

                    <Button
                        colorScheme="blue"
                        onPress={() => navigation.navigate("AddEditTask", { task })}
                    >
                        Edytuj zadanie
                    </Button>
                </VStack>
            </VStack>
        </ScrollView>
    );
}
