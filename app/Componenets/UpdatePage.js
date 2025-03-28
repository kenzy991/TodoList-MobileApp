import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

function UpdateTask({ route }) {
  const { task } = route.params;
  const [title, setTitle] = useState(task.title);
  const [details, setDetails] = useState(task.content);
  const [date, setDate] = useState(task.endDate || "2025-10-12T14:30:15.456Z"); // قيمة افتراضية بصيغة ISO
  const [repeat, setRepeat] = useState(task.repeat);
  const [list, setList] = useState(task.list);
  const [message, setMessage] = useState("");
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

  const updateTask = async () => {
    if (!title.trim()) {
      setMessage("Please enter a task title!");
      return;
    }

    if (!token) {
      setMessage("Authentication error. Please log in again.");
      return;
    }

    const updatedTaskData = {
      title,
      content: details,
      completed: task.completed,
      endDate: date, 
      repeat,
      list,
    };

    try {
      await axios.patch(
        `https://fake-form.onrender.com/api/todo/${task._id}`,
        updatedTaskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Task updated successfully!");
      setTimeout(() => navigation.goBack(), 1000);
    } catch (error) {
      setMessage("Error updating the task!");
    }
  };

  return (
    <View className="flex-1 bg-[#1E1E2D] p-5">
      <Text className="text-3xl font-bold text-[#FFD700] mb-7">Update Task</Text>

      {message ? <Text className="text-lg text-[#FFD700] text-center mb-2">{message}</Text> : null}

      <Text className="text-lg text-[#FFD700] mb-1">Task Title</Text>
      <TextInput className="border border-[#FFD700] p-2 rounded-md text-white text-lg mb-4" value={title} onChangeText={setTitle}/>

      <Text className="text-lg text-[#FFD700] mb-1">Details</Text>
      <TextInput className="border border-[#FFD700] p-2 rounded-md text-white text-lg mb-4 min-h-[60px]" value={details}
        onChangeText={setDetails} multiline numberOfLines={4}/>

      <Text className="text-lg text-[#FFD700] mb-1"> End Date</Text>
      <TextInput className="border border-[#FFD700] p-2 rounded-md text-white text-lg mb-4" value={date} onChangeText={setDate}
        placeholder="YYYY-MM-DDTHH:mm:ss.SSSZ" keyboardType="default"/>

      <Text className="text-lg text-[#FFD700] mb-1">Repeat</Text>
      <View style={{
        borderWidth: 2,borderColor: "#FFD700", borderRadius: 8,paddingHorizontal: 5,marginBottom: 16}}>
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

export default UpdateTask;
