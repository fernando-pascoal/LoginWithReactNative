import React, { Component } from "react";
import AsyncStorage from "@react-native-community/async-storage";

import "~/config/reactotron.js";

import createNavigate from "./routes";

export default class App extends Component {
    state = {
        userChecked: false,
        userLogged: false
    };

    async componentDidMount() {
        const username = await AsyncStorage.getItem("@app:token");

        this.setState({ userChecked: true, userLogged: !!username });
    }

    render() {
        const { userChecked, userLogged } = this.state;

        if (!userChecked) return null;

        const Routes = createNavigate(userLogged);
        return <Routes />;
    }
}
