import * as Notifications from 'expo-notifications';
import {Alert, Platform} from "react-native";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export const setupNotifications = async () => {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        Alert.alert('Brak uprawnień!', 'Musisz zezwolić na powiadomienia w ustawieniach, aby otrzymywać powiadomienia.');
        return false;
    }

    return true;
};

export const cancelAllNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("Anulowanie");
};

export const scheduleDailyNotification = async (hour = 9, minute = 0) => {
    await cancelAllNotifications();

    const identifier = await Notifications.scheduleNotificationAsync({
        content: {
            title: "Cześć, sprwadź swoje zadania na dziś",
            body: "Wejdź do aplikacji i zobacz, co masz do zrobienia.",
            sound: true,
        },
        trigger: {
            hour: hour,
            minute: minute,
            repeats: true,
        },
    });

    console.log(`Powiadomienie ${hour}:${minute}, ID: ${identifier}`);
    return identifier;
};

export const requsetNotification = async () => {
    await cancelAllNotifications();

    const identifier = await Notifications.scheduleNotificationAsync({
        content: {
            title: "Cześć, sprwadź swoje zadania na dziś",
            body: "Wejdź do aplikacji i zobacz, co masz do zrobienia.",
            sound: true,
        },
        trigger: null
    });

    console.log(`Powiadomienie, ID: ${identifier}`);
    return identifier;
};