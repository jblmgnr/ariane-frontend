import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import MyPopup from "./components/MyPopup";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAddUser } from "../reducers/user";

export default function HomePageScreen() {
  const dispatch = useDispatch();

  const [popup, setPopup] = useState("");
  const [tree, setTree] = useState(null);
  const user = useSelector((state) => state.user.value);

  useEffect(() => {
    // If no tree exists, create the first default tree
    if (!user.tree) {
      console.log("Create the default tree !!!!!");
    }
  }, []);

  const closePopup = (buttonPressed) => {
    console.log("Close with action : ", buttonPressed);
    setPopup("");
  };

  const onPress = () => {
    setPopup(
      <MyPopup
        title="What do you want ?"
        buttons={["OK", "Cancel", "YES"]}
        onClose={closePopup}
      />
    );
  };

  return (
    <View>
      <Text>HomePage Screen</Text>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.text}>Click to show popup</Text>
      </TouchableOpacity>
      {popup}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
