import React, { useState } from "react";
import {Box, HStack, Button} from "native-base";
import TodayTaskScreen from "./TodayTaskScreen";
import IncomingTaskScreen from "./IncomingTaskScreen";

export default function TaskListScreen({ navigation }) {
    const [view, setView] = useState("today");

    return (
        <Box flex={1} bg="white">
            <Box px={4} pt={20} pb={2} bg="white">
                <HStack space={2} justifyContent="center">
                    <Button
                        size="sm"
                        variant={view === "today" ? "solid" : "outline"}
                        colorScheme={view === "today" ? "blue" : "gray"}
                        onPress={() => setView("today")}
                    >
                        Dzisiejsze
                    </Button>
                    <Button
                        size="sm"
                        variant={view === "next" ? "solid" : "outline"}
                        colorScheme={view === "next" ? "blue" : "gray"}
                        onPress={() => setView("next")}
                    >
                        Nadchodzące
                    </Button>
                </HStack>
            </Box>
            <Box flex={1}>
                {view === "today" ? (
                    <TodayTaskScreen navigation={navigation} key="today" />
                ) : (
                    <IncomingTaskScreen navigation={navigation} key="next" />
                )}
            </Box>
        </Box>
    );
}
