import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

function AddTask() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [date, setDate] = useState("");
  const [repeat, setRepeat] = useState("None");
  const [token, setToken] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    };
    getToken();
  }, []);

  const addTask = () => {
    if (!title.trim() || !date.trim()) return;

    const taskData = {
      title,
      content: details,
      completed: true,
      endDate: date,
    };

    axios
      .post("https://fake-form.onrender.com/api/todo/", taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data.success) {
          navigation.goBack();
        }
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
  };

  return (
    <View className="flex-1 bg-[#1E1E2D] p-5">
      <Text className="text-xl font-bold text[#FFD700] mb-5">New Task</Text>

      <Text className="text-lg text-yellow-400 mb-2">What needs to be done?</Text>
      <TextInput className="border border-[#FFD700] p-2 rounded text-white text-lg mb-4" placeholder="Enter task here" placeholderTextColor="#aaa"
        value={title} onChangeText={setTitle} />

      <Text className="text-lg text-[#FFD700] mb-2">Details</Text>
      <TextInput className="border border-[#FFD700] p-2 rounded text-white text-lg mb-4 min-h-[60px] text-top" placeholder="Enter task details"
        placeholderTextColor="#aaa" value={details} onChangeText={setDetails} multiline />

      <Text className="text-lg text-yellow-400 mb-2">End Date</Text>
      <TextInput className="border border-yellow-400 p-2 rounded text-white text-lg mb-4" placeholder="2025-10-12T14:30:15.456Z"
        placeholderTextColor="#aaa" value={date} onChangeText={setDate} />

      <Text className="text-lg text-[#FFD700]mb-2">Repeat</Text>
      <View style={{
        borderWidth: 1,
        borderColor: "#FFD700",
        borderRadius: 5,
        paddingHorizontal: 2,
        marginBottom: 16
      }}>
        <Picker
          selectedValue={repeat}
          onValueChange={(itemValue) => setRepeat(itemValue)}
          style={{ color: "white" }}
        >
          <Picker.Item label="None" value="None" />
          <Picker.Item label="Daily" value="Daily" />
          <Picker.Item label="Weekly" value="Weekly" />
          <Picker.Item label="Monthly" value="Monthly" />
          <Picker.Item label="Yearly" value="Yearly" />
        </Picker>
      </View>
      <TouchableOpacity className="bg-[#FFD700] w-16 h-16 rounded-full justify-center items-center self-end" onPress={addTask}>
        <Ionicons name="checkmark" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}
export default AddTask

