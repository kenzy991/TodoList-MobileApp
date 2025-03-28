import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginPage from "./Componenets/LoginPage";
import HomePage from "./Componenets/HomePage";
import UpdatePage from "./Componenets/UpdatePage";
import AddTaskPage from "./Componenets/AddTaskPage";
import "../global.css";

const Stack = createStackNavigator();

function index() {
    return (
        
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
                <Stack.Screen name="Home" component={HomePage} />
                <Stack.Screen name="AddTask" component={AddTaskPage} />
                <Stack.Screen name="Update" component={UpdatePage} />
            </Stack.Navigator>
       
    );
}

export default index;
