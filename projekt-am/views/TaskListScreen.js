import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Box, Text, Spinner, Pressable, Badge, HStack, VStack, Button } from "native-base";
import axiosInstance from "../backend/axiosInstance";

export default function TaskListScreen({ navigation }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("/tasks");
            setTasks(response.data);
        } catch (error) {
            console.error("Error: ", error);
        } finally {
            setLoading(false);
        }
    };

    // jak nie ma tych trzech kropek to kaplica (nadpisuje wtedy wszystkie dane i zostaje jedynie zmienione 'done' XD)
    // trzy kropki robia kopie wszystkich pól i zmienia sie wtedy tylko 'done'
    const toggleDone = async (task) => {
        try {
            await axiosInstance.put(`/tasks/${task.id}`, {
                ...task,
                done: !task.done
            });
            setTasks((prevTasks) =>
                prevTasks.map((t) =>
                    t.id === task.id ? { ...t, done: !t.done } : t
                )
            );
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const renderTask = ({ item }) => {
        return (
            <Pressable
                onPress={() => navigation.navigate("TaskDetails", {})}
            >
                <Box
                    bg="gray.100"
                    p={4}
                    rounded="2xl"
                    mb={3}
                    w={"100%"}
                    shadow={1}
                >
                    <HStack justifyContent="space-between" alignItems="center">
                        <VStack>
                            <Text fontSize="md" bold>
                                {item.title}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                                {item.date}
                            </Text>
                        </VStack>
                        <Pressable
                        onPress={() => toggleDone(item)}
                        >
                            <Badge
                                colorScheme={item.done ? "green" : "red"}
                                variant="solid"
                                size="sm"
                                left={3}
                                rounded={"full"}
                            >
                                {item.done ? "✓" : "X"}
                            </Badge>
                        </Pressable>
                    </HStack>
                </Box>
            </Pressable>
        );
    };

    return (
        <Box flex={1} px={5} bg="white" pt={20}>
            {loading ? (
                <Spinner size="lg" />
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderTask}
                    showsVerticalScrollIndicator={false}
                />
            )}
            <Button
                mt={5}
                onPress={() => navigation.navigate("AddEditTask")}
                colorScheme="blue"
                rounded="2xl"
                mb={5}
            >
                Dodaj zadanie
            </Button>
        </Box>
    );
}
