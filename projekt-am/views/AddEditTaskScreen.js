import React, { useState } from "react";
import {Badge, Box, Button, HStack, Pressable, Text, VStack} from "native-base";
import { TextInput } from "react-native";
import axiosInstance from "../backend/axiosInstance";
import { useAuth } from "../backend/context/AuthContext";

export default function AddEditTaskScreen({ navigation }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Średni");
    const { user } = useAuth();

    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState([]);

    const today = new Intl.DateTimeFormat("pl-PL").format(new Date());

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
        }
        setTagInput("");
    };

    const removeTag = (tag) => {
        setTags(tags.filter(t => t !== tag));
    };

    const handleAdd = async () => {
        if (!title.trim()) return;

        const newTask = {
            userId: user.id,
            title,
            description,
            done: false,
            date: today,
            priority,
            tags,
            image: null,
        };

        try {
            await axiosInstance.post("/tasks", newTask);
            navigation.goBack();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <Box flex={1} bg="white" p={5} pt={20}>
            <VStack space={4}>

                <Text fontSize="md" bold> Zmiana nazwy: </Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        padding: 10,
                        borderRadius: 10,
                        height: 40,
                        textAlignVertical: "top"
                    }}
                    placeholder="<Nazwa>"
                    value={title}
                    onChangeText={setTitle}
                />

                <Text fontSize="md" bold> Zmiana opisu: </Text>
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


                <Text fontSize="md" bold>Zmiana priorytetów:</Text>
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

                <Text fontSize="md" bold>Dodawanie tagów:</Text>
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


                <Button mt={5} colorScheme="blue" onPress={handleAdd}>
                    Zapisz
                </Button>
            </VStack>
        </Box>
    );
}
