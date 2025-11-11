import {useEffect, useState} from "react";
import {useIsFocused} from "@react-navigation/native";
import {useAuth} from "../backend/context/AuthContext";
import axiosInstance from "../backend/axiosInstance";
import {Badge, Box, Button, HStack, Pressable, Spinner, VStack, Text, FlatList} from "native-base";
import {Alert} from "react-native";

export default function IncomingTaskScreen({navigation}) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [priorityFilter, setPriorityFilter] = useState("Wszystkie");

    const isFocused = useIsFocused();
    const { user } = useAuth();

    const nextDays = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + 1);
        return new Intl.DateTimeFormat("pl-PL").format(d);
    });

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/tasks?userId=${user.id}`);
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) fetchTasks();
    }, [isFocused, user]);

    const toggleDone = async (task) => {
        try {
            await axiosInstance.put(`/tasks/${task.id}`, { ...task, done: !task.done });
            setTasks(prev => prev.map(t => t.id === task.id ? { ...t, done: !t.done } : t));
        } catch (error) {
            console.error("Error toggling done:", error);
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (priorityFilter === "Wszystkie") return true;
        return task.priority === priorityFilter;
    });

    const tasksByDay = nextDays.map(day => ({
        date: day,
        data: filteredTasks.filter(task => task.date === day)
    }));

    const deleteTask = async (task) => {
        try {
            await axiosInstance.delete(`/tasks/${task.id}`);
            setTasks(prevTasks => prevTasks.filter(t => t.id !== task.id));
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    const handleLongPress = async(task) => {
        Alert.alert('Usuwanie zadania', 'Czy napewno chcesz usunąć to zadanie?', [
            {
                text: "Usuń",
                onPress: () => deleteTask(task),
                style: "destructive"
            },
            {
                text: "Anuluj",
                style: "cancel"
            }
        ]);
    }

    const renderTask = ({ item }) => (
        <Box bg="gray.100" p={4} rounded="2xl" mb={3} w="98%" ml={1} shadow={1}>
            <HStack justifyContent="space-between" alignItems="center">
                <Pressable
                    style={{ flex: 1 }}
                    onPress={() => navigation.getParent().navigate("TaskDetails", { itemId: item.id })}
                    onLongPress={() => handleLongPress(item)}
                    delayLongPress={500}
                >
                    <VStack>
                        <Text fontSize="md" bold>{item.title}</Text>
                        {item.tags?.length > 0 && (
                            <HStack space={1} mt={1}>
                                {item.tags.map((tag, idx) => (
                                    <Badge key={idx} colorScheme="purple">{tag}</Badge>
                                ))}
                            </HStack>
                        )}
                        {item.priority && (
                            <Badge mt={1} colorScheme={
                                item.priority === "Wysoki" ? "red" :
                                    item.priority === "Średni" ? "yellow" : "green"
                            }>{item.priority}</Badge>
                        )}
                    </VStack>
                </Pressable>
                <Pressable onPress={() => toggleDone(item)}>
                    <Badge colorScheme={item.done ? "green" : "red"} variant="solid" size="sm" rounded="full">
                        {item.done ? "✓" : "X"}
                    </Badge>
                </Pressable>
            </HStack>
        </Box>
    );

    return (
        <VStack flex={1} px={5} pt={20} bg="white">
            <HStack space={2} mb={4} justifyContent="center">
                {["Wszystkie", "Wysoki", "Średni", "Niski"].map(level => (
                    <Button
                        key={level}
                        size="sm"
                        colorScheme={priorityFilter === level ? "blue" : "gray"}
                        onPress={() => setPriorityFilter(level)}
                    >
                        {level}
                    </Button>
                ))}
            </HStack>

            {loading ? (
                <Spinner size="lg" />
            ) : (
                tasksByDay.map(({ date, data }) => (
                    <Box key={date} mb={4}>
                        {data.length > 0 && (
                            <>
                                <Text
                                    fontSize="xl"
                                    bold
                                >{date}</Text>
                                <FlatList
                                    data={data}
                                    keyExtractor={item => item.id.toString()}
                                    renderItem={renderTask}
                                    showsVerticalScrollIndicator={false}
                                />
                            </>
                        )}
                    </Box>
                ))
            )}
        </VStack>
    );
}