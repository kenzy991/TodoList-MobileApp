import { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get("https://fake-form.onrender.com/api/todo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data.data);
    } catch (error) {
      console.error("Fetch Error:", error);
      setError("Unable to load tasks");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  const deleteTask = async (taskId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`https://fake-form.onrender.com/api/todo/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Task deleted successfully!");
      fetchTasks(); 
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  return (
    <View className="flex-1 bg-[#1E1E2D] p-5">
      <Text className="text-5xl font-bold text-[#FFD700] text-center mb-5">Todo List</Text>

      {loading && <ActivityIndicator size="large" color="#FFD700" />}
      {error && <Text className="text-[#FF6B6B] text-center mb-5">{error}</Text>}

      <FlatList 
        data={tasks} 
        keyExtractor={(task) => task._id} 
        renderItem={({ item }) => (
          <View className="bg-[#2A2A40] p-4 rounded-xl mb-2 shadow-md shadow-black/20">
            <Text className="text-2xl font-bold text-white">{item.title}</Text>
            <Text className="text-lg text-[#B0B0C3] my-2">{item.content}</Text>
            <Text className="text-base text-[#FFD700]">{item.completed ? "Completed" : "Not Completed"}</Text>

            <View className="flex-row mt-2 justify-between">
              <TouchableOpacity className="bg-[#E74C3C] p-3 rounded-lg items-center flex-1 mr-1" onPress={() => deleteTask(item._id)}>
                <Ionicons name="trash" size={20} color="white" />
              </TouchableOpacity>

              <TouchableOpacity className="bg-[#2980B9] p-3 rounded-lg items-center flex-1 ml-[5px]" onPress={() => navigation.navigate("Update", { task: item })}>
                <Ionicons name="create" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity 
        className="absolute bottom-[30px] right-[30px] bg-[#FFD700] w-[65px] h-[65px] rounded-full justify-center items-center shadow-lg shadow-black/30" 
        onPress={() => navigation.navigate("AddTask")}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}
export default Home;
