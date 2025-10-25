import React, {useState} from "react";
import {Box, Text} from "native-base";
import CalendarPicker from "react-native-calendar-picker"

export default function CalendarScreen() {
    const [selectedStartDate, setSelectedStartDate] = useState(null);

    const onDateChange = (date) => {
        setSelectedStartDate(date);
    }

    return (
        <Box flex={1} px={2} bg="white">
            <Box
                p={5}
                mt={20}
                rounded="2xl"
                shadow={3}
                bg="gray.100"
                w="100%"
                maxW="100%"
                alignItems="center"
            >
                <CalendarPicker
                    onDateChange={onDateChange}
                    months={[
                        "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
                        "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień",
                    ]}
                    weekdays={["Pon", "Wto", "Śro", "Czw", "Pią", "Sob", "Nie"]}
                    startFromMonday={true}
                    previousTitle="Poprzedni"
                    nextTitle="Następny"
                />
                <Text>Wybrana data: {selectedStartDate ? selectedStartDate.toString() : ""}</Text>
            </Box>
        </Box>
    )
}
