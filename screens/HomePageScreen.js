import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import MyPopup from "./components/MyPopup";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTreeId } from "../reducers/user";
import { Button, TextInput } from "@react-native-material/core";
import { fontFamily } from "../modules/deco";

const { getFetchAPI } = require("../modules/util");

const FETCH_API = getFetchAPI();

// Home Page Screen
//======================================================
export default function HomePageScreen({ navigation }) {
  const dispatch = useDispatch();

  const [popup, setPopup] = useState("");
  const user = useSelector((state) => state.user.value);

  useEffect(() => {
    // If no tree exists, create the first default tree
    console.log("user in reduceer : ", user);
    if (!user.tree_id) {
      console.log("Create the default tree !!!!!");
      fetch(FETCH_API + "/trees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Defaut",
          userId: user.id,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.result) {
            alert(data.error);
            return;
          }
          console.log("Tree saved in DB");
          dispatch(setTreeId(data._id));
        })
        .catch((error) => {
          console.error("While connecting back-end on " + FETCH_API, error);
        });
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
      <Button
        onPress={() => {
          navigation.navigate("CreateMember");
        }}
        title="Crée membre"
        uppercase={false}
        style={styles.button}
        titleStyle={{ fontFamily: fontFamily }}
      />
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
