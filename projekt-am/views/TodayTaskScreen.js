import React, {useEffect, useState} from "react";
import {useIsFocused} from "@react-navigation/native";
import {useAuth} from "../backend/context/AuthContext";
import axiosInstance from "../backend/axiosInstance";
import {Badge, Box, Button, HStack, Pressable, Spinner, Text, VStack} from "native-base";
import {SectionList, TextInput} from "react-native";

export default function TodayTaskScreen({ navigation }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const isFocused = useIsFocused();

    const [newTaskTitle, setNewTaskTitle] = useState("");

    const [priorityFilter, setPriorityFilter] = useState("Wszystkie");

    const date = new Date();
    const today = new Intl.DateTimeFormat("pl-PL").format(date);

    const { user } = useAuth();

    const isDateBefore = (dateStr1, dateStr2) => {
        if (!dateStr1 || !dateStr2) return false;

        const [day1, month1, year1] = dateStr1.split('.').map(Number);
        const [day2, month2, year2] = dateStr2.split('.').map(Number);

        const date1 = new Date(year1, month1 - 1, day1);
        const date2 = new Date(year2, month2 - 1, day2);

        return date1 < date2;
    };

    const filteredTasks = tasks.filter(task => {
        if (priorityFilter === "Wszystkie") return true;
        return task.priority === priorityFilter;
    });

    const sections = [
        {
            title: "Dziś",
            data: filteredTasks.filter(t => t.date === today),
        },
        {
            title: "Przeterminowane",
            data: filteredTasks.filter(t => t.date && isDateBefore(t.date, today)),
        },
        {
            title: "Bez terminu",
            data: filteredTasks.filter(t => !t.date),
        },
    ];


    // jak nie ma tych trzech kropek to kaplica (nadpisuje wtedy wszystkie dane i zostaje jedynie zmienione 'done' XD)
    // trzy kropki robia kopie wszystkich pól i zmienia sie wtedy tylko 'done' F
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

    const QuickAdd = async () => {
        if (!newTaskTitle.trim()) return;

        const newTask = {
            userId: user.id,
            title: newTaskTitle,
            description: "",
            done: false,
            date: today,
            priority: "Średni",
            tags: [],
            image: null
        };

        try {
            const response = await axiosInstance.post("/tasks", newTask);
            setTasks(prev => [response.data, ...prev]);
            setNewTaskTitle("");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const moveToTomorrow = async task => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const newDate = new Intl.DateTimeFormat("pl-PL").format(tomorrow);

        try {
            await axiosInstance.put(`/tasks/${task.id}`, { ...task, date: newDate });
            setTasks(prev =>
                prev.map(t => (t.id === task.id ? { ...t, date: newDate } : t))
            );
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/tasks?userId=${user.id}`);

                setTasks(response.data);
            } catch (error) {
                console.error("Error: ", error);
            } finally {
                setLoading(false);
            }
        };

        if (isFocused) fetchTasks();
    }, [isFocused, user]);

    const renderTask = ({ item }) => {
        return (
            <Box bg="gray.100" p={4} rounded="2xl" mb={3} w="98%" ml={1} shadow={1}>
                <HStack justifyContent="space-between" alignItems="center">
                    <Pressable
                        onPress={() => navigation.getParent().navigate("TaskDetails", { itemId: item.id })}
                        style={{ flex: 1 }}
                    >
                        <VStack>
                            <Text fontSize="md" bold>{item.title}</Text>
                            {item.date && <Text fontSize="sm" color="gray.500">{item.date}</Text>}
                            {item.tags?.length > 0 && (
                                <HStack space={1} mt={1}>
                                    {item.tags.map((tag, idx) => (
                                        <Badge key={idx} colorScheme="purple">{tag}</Badge>
                                    ))}
                                </HStack>
                            )}
                            {item.priority && <Badge mt={1} colorScheme={
                                item.priority === "Wysoki" ? "red" :
                                    item.priority === "Średni" ? "yellow" : "green"
                            }>{item.priority}</Badge>}
                        </VStack>
                    </Pressable>
                    <HStack space={2}>
                        <Pressable onPress={() => toggleDone(item)}>
                            <Badge colorScheme={item.done ? "green" : "red"} variant="solid" size="sm" rounded="full">
                                {item.done ? "✓" : "X"}
                            </Badge>
                        </Pressable>
                        <Button size="sm" colorScheme="blue" onPress={() => moveToTomorrow(item)}>Jutro</Button>
                    </HStack>
                </HStack>
            </Box>
        );
    };

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

            <HStack space={2} mb={4}>
                <TextInput
                    style={{height: 40, borderWidth: 1, padding: 10,}}
                    flex={1}
                    placeholder="Nowe zadanie"
                    value={newTaskTitle}
                    onChangeText={setNewTaskTitle}
                />
                <Button onPress={QuickAdd}>Dodaj</Button>
            </HStack>

            <Box flex={1} px={5} bg="white">
                {loading ? (
                    <Spinner size="lg" />
                ) : (
                    <SectionList
                        sections={sections}
                        keyExtractor={item => item.id.toString()}
                        renderItem={renderTask}
                        renderSectionHeader={({ section: { title, data } }) =>
                            data.length > 0 ? (
                                <Box background={'white'}>
                                    <Text fontSize="xl" bold mb={2}>
                                        {title}
                                    </Text>
                                </Box>
                            ) : null
                        }
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </Box>
            <Button
                mt={5}
                onPress={() => navigation.navigate("AddEditTask")}
                colorScheme="blue"
                rounded="2xl"
                mb={5}
            >
                Dodaj zadanie
            </Button>
        </VStack>
    );
}