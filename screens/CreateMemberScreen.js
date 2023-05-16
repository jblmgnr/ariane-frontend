import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SelectList } from "react-native-dropdown-select-list";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  Button,
  TextInput,
  Stack,
  IconButton,
} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAddUser } from "../reducers/user";
import { fontFamily } from "../modules/deco";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { Gender, RelationShipCombo, RelationShip } from "../modules/common";

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
    relationShip: RelationShip.None,
    job: "",
    hobbies: "",
    gender: Gender.Undefined,
  });

  const [relationShip, setRelationShip] = useState("");

  const onRelationChanged = (key) => {
    const relationShip = RelationShipCombo.find((r) => r.key === key).value;
    console.log("Relation ship : ", relationShip);

    setMember({ ...member, relationShip: relationShip });
  };

  const onGenderChanged = (gender) => {
    console.log("Gender  :", gender);
    setMember({ ...member, gender });
  };

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
          />
          <TextInput
            label="Nom"
            variant="outlined"
            onChangeText={(value) => setMember({ ...member, lastName: value })}
            value={member.lastName}
            style={styles.input}
          />
          <TextInput
            label="Surnom"
            variant="outlined"
            onChangeText={(value) => setMember({ ...member, nickname: value })}
            value={member.nickname}
            style={styles.input}
          />
          {/* TODO : Did : Format date*/}
          <TextInput
            label="Date de naissance"
            variant="outlined"
            onChangeText={(value) => setMember({ ...member, bir: value })}
            value={member.nickname}
            style={styles.input}
          />
          <View style={styles.genderView}>
            <FontAwesome
              style={styles.genderIcon}
              name="male"
              size={35}
              color={member.gender === Gender.Male ? "#4781ff" : "#AAAAAA"}
              onPress={() => {
                onGenderChanged(Gender.Male);
              }}
            />
            <FontAwesome
              style={styles.genderIcon}
              name="female"
              size={35}
              color={member.gender === Gender.Female ? "#f081f6" : "#AAAAAA"}
              onPress={() => {
                onGenderChanged(Gender.Female);
              }}
            />
          </View>
          <SelectList
            onSelect={() => onRelationChanged(relationShip)}
            setSelected={setRelationShip}
            fontFamily={fontFamily}
            data={RelationShipCombo}
            search={false}
            boxStyles={{ borderRadius: 0 }} //override default styles
            defaultOption={{ key: "1", value: "Relation" }} //default selected option
          />
          <Text>After selector</Text>
        </View>
        <View>
          <Button
            onPress={() => {
              navigation.navigate("CreateMember");
            }}
            title="Créé le membre"
            uppercase={false}
            style={styles.button}
            titleStyle={{ fontFamily: fontFamily }}
          />
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
    fontFamily: fontFamily,
    marginBottom: 5,
    marginTop: 5,
  },
  genderView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  genderIcon: {
    margin: 10,
  },
});
