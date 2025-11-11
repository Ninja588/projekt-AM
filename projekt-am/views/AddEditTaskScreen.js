import React, { useState, useEffect } from "react";
import { Badge, Box, Button, HStack, Pressable, Text, VStack } from "native-base";
import { TextInput, Platform } from "react-native";
import axiosInstance from "../backend/axiosInstance";
import { useAuth } from "../backend/context/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AddEditTaskScreen({ route, navigation }) {
    const { user } = useAuth();

    // czy edycja
    const editableTask = route.params?.task || null;

    // pola
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Średni");
    const [date, setDate] = useState(null);

    // tagi
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState([]);

    const [showDatePicker, setShowDatePicker] = useState(false);

    const today = new Intl.DateTimeFormat("pl-PL").format(new Date());

    // Jesli Edycja to:
    useEffect(() => {
        if (editableTask) {
            setTitle(editableTask.title);
            setDescription(editableTask.description);
            setPriority(editableTask.priority);
            setDate(editableTask.date);
            setTags(editableTask.tags || []);
        }
    }, [editableTask]);

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
        }
        setTagInput("");
    };

    const removeTag = (tag) => {
        setTags(tags.filter(t => t !== tag));
    };

    const onChangeDate = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const formatted = selectedDate.toLocaleDateString("pl-PL");
            setDate(formatted);
        }
    };

    const handleSave = async () => {
        if (!title.trim()) return;

        const taskPayload = {
            userId: user.id,
            title,
            description,
            priority,
            date: date || today,
            tags,
            done: editableTask ? editableTask.done : false,
            image: editableTask ? editableTask.image : null
        };

        try {
            if (editableTask) {
                //Edycja
                await axiosInstance.put(`/tasks/${editableTask.id}`, taskPayload);
            } else {
                //dodawanie
                await axiosInstance.post("/tasks", taskPayload);
            }

            navigation.goBack();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <Box flex={1} bg="white" p={5} pt={20}>
            <VStack space={4}>

                <Text fontSize="2xl" bold>
                    {editableTask ? "Edytuj zadanie" : "Dodaj zadanie"}
                </Text>

                <Text fontSize="md" bold>Nazwa:</Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        padding: 10,
                        borderRadius: 10,
                        height: 40
                    }}
                    placeholder="<Nazwa>"
                    value={title}
                    onChangeText={setTitle}
                />

                <Text fontSize="md" bold>Opis:</Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        padding: 10,
                        borderRadius: 10,
                        height: 120,
                        textAlignVertical: "top"
                    }}
                    multiline
                    placeholder="<Opis>"
                    value={description}
                    onChangeText={setDescription}
                />

                <Text fontSize="md" bold>Priorytet:</Text>
                <HStack space={2}>
                    {["Wysoki", "Średni", "Niski"].map(level => (
                        <Button
                            key={level}
                            size="sm"
                            colorScheme={priority === level ? "blue" : "gray"}
                            onPress={() => setPriority(level)}
                        >
                            {level}
                        </Button>
                    ))}
                </HStack>

                <Text fontSize="md" bold>Termin:</Text>
                <Button colorScheme="green" onPress={() => setShowDatePicker(true)}>
                    {date ? `Wybrano: ${date}` : "Wybierz datę"}
                </Button>
                {showDatePicker && (
                    <DateTimePicker
                        value={new Date()}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "calendar"}
                        onChange={onChangeDate}
                    />
                )}

                <Text fontSize="md" bold>Tagi:</Text>
                <HStack space={2}>
                    <TextInput
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            padding: 10,
                            borderRadius: 10 }}
                        placeholder="<Tag>"
                        value={tagInput}
                        onChangeText={setTagInput}
                    />
                    <Button onPress={handleAddTag}>Dodaj</Button>
                </HStack>

                <HStack space={2} flexWrap="wrap" mt={2}>
                    {tags.map(tag => (
                        <Pressable key={tag} onPress={() => removeTag(tag)}>
                            <Badge colorScheme="purple" mr={1} mb={1}>
                                {tag} X
                            </Badge>
                        </Pressable>
                    ))}
                </HStack>

                <Button mt={5} colorScheme="blue" onPress={handleSave}>
                    {editableTask ? "Zapisz zmiany" : "Dodaj zadanie"}
                </Button>

            </VStack>
        </Box>
    );
}
