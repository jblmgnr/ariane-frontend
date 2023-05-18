import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
  Platform,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../reducers/user";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";

export default function InviteScreen() {
  return (
    <View>
      <Text>Invite Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 50,
  },
});
