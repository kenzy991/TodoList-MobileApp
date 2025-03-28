import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState(""); 
  const [messageType, setMessageType] = useState(""); 
  const navigation = useNavigation();

  const handleAuth = async () => {
    const url = isLogin ? "https://fake-form.onrender.com/api/todo/login" : "https://fake-form.onrender.com/api/todo/register";
  
    try
     {
      const response = await axios.post(url, { email, password });
      if (response.data.success) 
        {
        await AsyncStorage.setItem("token", response.data.token);
        setMessageType("success");
        setMessage(isLogin ? " Login successful!" : " Registration successful!");
        setTimeout(() => navigation.replace("Home"), 1000);
      } 
      else 
      {
        setMessageType("error");
        setMessage(" An unexpected error occurred.");
      }
    } catch (error) {
      setMessageType("error");
      setMessage( " An error occurred. Please try again.");
    }
  };

  return (
    <View className="justify-center items-center flex-1 bg-[#1E1E2D] p-5">
      <Text className=" text-4xl font-bold color-[#FFD700] mb-7">{isLogin ? "Login" : "Register"}</Text>

      <View className=" bg-[#2A2A40]  w-full shadow-md shadow-black/20 rounded-lg p-8">
        <TextInput  className="border-b-2 border-b-[#FFD700] py-5 text-md color-[white] mb-5" placeholder="Email" value={email} 
        onChangeText={setEmail} keyboardType="email-address" placeholderTextColor="#ccc"/>

        <TextInput className="border-b-2 border-b-[#FFD700] py-5 text-md color-[white] mb-5" placeholder="Password" value={password}
        onChangeText={setPassword} secureTextEntry placeholderTextColor="#ccc" />

{message && 
(
  <Text
    className={`text-lg text-center my-10 ${messageType === "success" ? "text-green-500" : "text-red-500"}`} >{message}
  </Text>
)
}
        <TouchableOpacity className="bg-[#FFD700] p-3   rounded-lg mt-4" onPress={handleAuth}>
          <Text className=" text-xl text-center font-bold color-[#1E1E2D]">{isLogin ? "Login" : "Register"}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text className="text-md color-[#FFD700] mt-7">
          {isLogin ? "Register" : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default Login;
