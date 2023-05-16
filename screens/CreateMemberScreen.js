import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Button, TextInput } from "@react-native-material/core";

import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAddUser } from "../reducers/user";
import { fontFamily } from "../modules/deco";

export default function CreateMemberScreen() {
  const { height, width, scale, fontScale } = useWindowDimensions();
  const [member, setMember] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    birthDate: "",
    deathDate: "",
    birthCity: "",
    currentCity: "",
    job: "",
    hobbies: "",
  });

  return (
    <KeyboardAwareScrollView style={{ backgroundColor: "red" }}>
      <View style={[styles.container, { height: height }]}>
        <View style={styles.inputsView}>
          <TextInput
            label="Prénom"
            variant="outlined"
            onChangeText={(value) => setMember({ ...member, firstName: value })}
            value={member.firstName}
            style={styles.input}
            titleStyle={{ fontFamily }}
          />
          <TextInput
            label="Nom"
            variant="outlined"
            onChangeText={(value) => setMember({ ...member, lastName: value })}
            value={member.lastName}
            style={styles.input}
            titleStyle={{ fontFamily }}
          />
          <TextInput
            label="Surnom"
            variant="outlined"
            onChangeText={(value) => setMember({ ...member, nickname: value })}
            value={member.nickname}
            style={styles.input}
            titleStyle={{ fontFamily }}
          />
          {/* TODO : Did : Format date*/}
          <TextInput
            label="Date de naissance"
            variant="outlined"
            onChangeText={(value) => setMember({ ...member, bir: value })}
            value={member.nickname}
            style={styles.input}
            titleStyle={{ fontFamily }}
          />
        </View>
        <View>
          <Text>Create member Screen !!!!!!!!!!</Text>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#fff",
  },
  inputsView: {
    justifyContent: "center",
    width: "80%",
    flex: 1,
  },
  input: {
    width: "100%",
    fontFamily: "Quicksand",
    marginBottom: 5,
    marginTop: 5,
  },
});
