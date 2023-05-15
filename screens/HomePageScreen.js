import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Modal,
    TextInput,
  } from "react-native";
  import MaterialIcons from "react-native-vector-icons/MaterialIcons";
  import { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { setAddUser } from "../reducers/user";
  
  export default function HomePageScreen() {
    return (
      <View>
        <Text>HomePage Screen</Text>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "space-around",
    },
  });
  