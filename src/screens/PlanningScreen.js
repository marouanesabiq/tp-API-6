import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';

export default function PlanningScreen() {
    const [loading, setLoading] = useState(true);
    const [forecast, setForecast] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [recommendation, setRecommendation] = useState('');

    useEffect(() => {
        fetchWeather();
    }, []);

    const fetchWeather = async () => {
        try {
            setLoading(true);
            // Fetch weather for 7 days
            const response = await fetch(
                'https://api.open-meteo.com/v1/forecast?latitude=33.6&longitude=7.6&daily=precipitation_sum&timezone=auto'
            );
            const data = await response.json();

            // Format data: combine dates and precipitation
            const dailyData = data.daily.time.map((date, index) => ({
                date: date,
                precipitation: data.daily.precipitation_sum[index],
                id: index.toString()
            }));

            setForecast(dailyData);
        } catch (e) {
            Alert.alert("Erreur", "Impossible de charger la météo");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectDate = (item) => {
        setSelectedDate(item.date);
        if (item.precipitation > 0) {
            setRecommendation("Il pleut (" + item.precipitation + "mm). Il est conseillé de jouer au Basket (sport en salle).");
        } else {
            setRecommendation("Ciel dégagé. Vous pouvez planifier un match de Football.");
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => handleSelectDate(item)}>
            <Text style={styles.dateText}>{item.date}</Text>
            <Text>Précip: {item.precipitation} mm</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Planification sportive</Text>
            <Text style={styles.subtitle}>Choisissez une date :</Text>

            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <FlatList
                    data={forecast}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    style={styles.list}
                />
            )}

            {selectedDate && (
                <View style={styles.resultContainer}>
                    <Text style={styles.selectedDate}>Date choisie : {selectedDate}</Text>
                    <Text style={styles.recommendation}>{recommendation}</Text>
                </View>
            )}

            <Button title="Actualiser la météo" onPress={fetchWeather} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        marginTop: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 10
    },
    list: {
        maxHeight: 300,
        marginBottom: 20
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#f9f9f9',
        marginBottom: 5,
        borderRadius: 5
    },
    dateText: {
        fontWeight: 'bold',
        fontSize: 16
    },
    resultContainer: {
        padding: 15,
        backgroundColor: '#e6f7ff',
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#1890ff'
    },
    selectedDate: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5
    },
    recommendation: {
        fontSize: 16,
        color: '#d66',
        fontWeight: 'bold'
    }
});