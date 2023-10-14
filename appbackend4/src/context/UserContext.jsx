import axios from "axios";
import { createContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from "react-native";

export const userContext = createContext()

const initialState = {
    _id: null,
    name: null,
    email: null,
    token : null
};

export const UserProvider = (props) => {
    const [isLogin, setIsLogin] = useState(false);
    const [userData, setUserData] = useState(initialState)
    const [token, setToken] = useState(null);

    useEffect(() =>{
        const verify = async () => {
            try {
                const token = await AsyncStorage.getItem("token")

                token? (setToken(token), setIsLogin(true)) : (setIsLogin(false), setToken(false))
            } catch (error) {
                console.log("Error en verify", error.message)
            }
        };

        verify()
    }, [])

    const login = async (formulario) => {
        try {
            const {data} = await axios.post(`/user/login`, formulario)

            setToken(data.data.token)
            setUserData(data.data)
            setIsLogin(true)
            await AsyncStorage.setItem("token", data.data.token)
        } catch (error) {
            if(!error.response.data.ok){
                return Alert.alert("Error", error.response.data.message)
            }
            console.log("Error en login", error.message)
        }
    }
};

const register = async (formulario) => {
    try {
        const {data} = await axios.post(`/user/register`, formulario)

        setToken(data.data.token)
        setUserData(data.data)
        setIsLogin(true)
        await AsyncStorage.setItem("token", data.data.token)
    } catch (error) {
        if(!error.response.data.ok){
            return Alert.alert("Error", error.response.data.message)
        }
        console.log("Error en register", error.message)
    }
}


const exit = async () => {
    try {
        await AsyncStorage.removeItem("token");
        setUserData(initialState);
        setIsLogin(false);
    } catch (error) {
        console.log("Error en exit", error.message)
    };

    const value = {
        login,
        exit,
        isLogin,
        userData,
        token,
        register
    }

    return <userContext.Provider value = {value} {...props}/>
};