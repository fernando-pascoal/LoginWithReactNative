import React, { Component } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import Toast from "@rimiti/react-native-toastify";
import PropTypes from "prop-types";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator
} from "react-native";
import styles from "./styles";

import api from "~/services/api";

class Welcome extends Component {
    state = {
        email: "",
        password: "",
        loading: false
    };

    static propTypes = {
        navigation: PropTypes.shape({
            navigate: PropTypes.func
        }).isRequired
    };

    checkUserExists = async (email, password) => {
        const { token } = await api
            .post(`sessions`, {
                email,
                password
            })
            .then(res => res.data);
        return token;
    };

    saveToken = async token => {
        await AsyncStorage.setItem("@app:token", token);
    };

    signIn = async () => {
        const { email, password } = this.state;
        const { navigation } = this.props;

        this.setState({ loading: true });

        try {
            const token = await this.checkUserExists(email, password);
            await this.saveToken(token);

            navigation.navigate("Dashboard");
        } catch (error) {
            const { response } = error;
            this.setState({ loading: false });

            if (!response) {
                return this.toastify.show(
                    "Você esta sem conexão, verifique antes de acessar",
                    2000
                );
            }

            if (error.status === 400) {
                return this.toastify.show("Usuário ou Senha incorretos", 2000);
            }
            console.tron.log(error);

            this.setState({ loading: false });
            return this.toastify.show("Erro no servidor", 1500);
        }
    };

    render() {
        const { email, password, loading } = this.state;

        return (
            <View style={styles.container}>
                {/** StatusBar barStyle altera a cor no iphone backgroundColor no android */}
                <StatusBar barStyle="light-content" backgroundColor="black" />
                <Text style={styles.title}>Bem vindo</Text>
                <Text style={styles.text}>
                    Para continuar informe seu email e senha
                </Text>
                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Email"
                        underlineColorAndroid="transparent"
                        value={email}
                        onChangeText={email => this.setState({ email })}
                    />
                    <TextInput
                        style={styles.input}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Senha"
                        underlineColorAndroid="transparent"
                        value={password}
                        secureTextEntry={true}
                        onChangeText={password => this.setState({ password })}
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={this.signIn}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Entrar</Text>
                        )}
                    </TouchableOpacity>
                    <Toast ref={c => (this.toastify = c)} position="top" />
                </View>
            </View>
        );
    }
}

export default Welcome;
