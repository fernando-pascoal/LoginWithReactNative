import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";

//Configure o path para o backend
const api = axios.create({
    baseURL: "http://192.168.1.11:3000"
});

api.interceptors.request.use(async config => {
    const token = await AsyncStorage.getItem("@app:token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
