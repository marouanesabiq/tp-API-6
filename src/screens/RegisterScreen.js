import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { registerUser } from '../database/database';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs");
            return;
        }
        try {
            await registerUser(name, email, password);
            Alert.alert("Succès", "Inscription réussie");
            navigation.navigate('Login');
        } catch (e) {
            // Check if error is due to unique constraint
            if (e.message && e.message.includes('UNIQUE constraint failed')) {
                Alert.alert("Erreur", "Cette adresse email est déjà utilisée.");
                console.log("Registration failed: Email already exists."); // Log safely instead of console.error
            } else {
                Alert.alert("Erreur", "Une erreur est survenue lors de l'inscription.");
                console.error(e);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Inscription</Text>
            <TextInput
                style={styles.input}
                placeholder="Nom"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
            />
            <Button title="S'inscrire" onPress={handleRegister} />
            <Button title="Déjà un compte ? Se connecter" onPress={() => navigation.navigate('Login')} color="gray" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        justifyContent: 'center'
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5
    }
});