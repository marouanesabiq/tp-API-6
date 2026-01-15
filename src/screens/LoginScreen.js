import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { loginUser } from '../database/database';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs");
            return;
        }
        try {
            const user = await loginUser(email, password);
            if (user) {
                navigation.navigate('Planning');
            } else {
                Alert.alert("Erreur", "Identifiants incorrects");
            }
        } catch (e) {
            console.error(e);
            Alert.alert("Erreur", "Une erreur est survenue");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Connexion</Text>
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
            <Button title="Se connecter" onPress={handleLogin} />
            <Button title="Pas de compte ? S'inscrire" onPress={() => navigation.navigate('Register')} color="gray" />
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