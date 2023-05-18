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
import { addMember } from "../reducers/members";
import { fontFamily } from "../modules/deco";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { Gender, RelationShipCombo, RelationShip } from "../modules/common";
const { getFetchAPI, showObject, showObjects } = require("../modules/util");

const FETCH_API = getFetchAPI();

const initialMemberState = {
  tree: null,
  firstName: "",
  lastName: "",
  nickName: "",
  birthDate: "",
  deathDate: "",
  birthCity: "",
  currentCity: "",
  relationShip: RelationShip.none,
  job: "",
  hobbies: "",
  gender: Gender.undefined,
  group: null,
  father: null,
  mother: null,
};
export default function CreateMemberScreen() {
  const dispatch = useDispatch();
  const { height, width, scale, fontScale } = useWindowDimensions();

  // From reducer
  const members = useSelector((state) => state.members.value);
  const user = useSelector((state) => state.user.value);
  initialMemberState.tree = user.tree;

  // States
  const [relationShipKey, setRelationShipKey] = useState("");
  const [fatherKey, setFatherKey] = useState("");
  const [motherKey, setMotherKey] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [member, setMember] = useState(initialMemberState);

  // Ref

  // let statusMessage = "Empty";
  const showStatusMessage = (message) => {
    setStatusMessage(message);

    setTimeout(() => {
      setStatusMessage("");
    }, 3000);
  };

  // // Create contents of member drop down for Parent and Partner
  // const memberItems = [];
  // for (let i = 0; i < members.length; i++) {
  //   const m = members[i];
  //   // console.log("In create member item  ");
  //   let value = m.firstName + " " + m.firstName;
  //   if (m.nickName && m.nickName.length > 0) value += " (" + m.nickName + ")";
  //   memberItems.push({ key: (i + 1).toString(), value, id: m._id });
  // }

  // showObjects(memberItems, "Members items");

  const fatherItems = [];
  fatherItems.push({ key: "0", value: "Père inconnu", id: null });
  for (let i = 0; i < members.length; i++) {
    const m = members[i];
    if (m.gender !== Gender.male) continue;
    let value = m.firstName + " " + m.lastName;
    if (m.nickName && m.nickName.length > 0) value += " (" + m.nickName + ")";
    fatherItems.push({ key: (i + 1).toString(), value, id: m._id });
  }
  const motherItems = [];
  motherItems.push({ key: "0", value: "Mère inconnue", id: null });
  for (let i = 0; i < members.length; i++) {
    const m = members[i];
    if (m.gender !== Gender.female) continue;
    let value = m.firstName + " " + m.lastName;
    if (m.nickName && m.nickName.length > 0) value += " (" + m.nickName + ")";
    motherItems.push({ key: (i + 1).toString(), value, id: m._id });
  }

  // console.log("Available members  : ", members.length);
  // console.log("Member items  : ", memberItems);

  const onRelationChanged = (key) => {
    console.log("key ship : ", key);

    const relationShip = RelationShipCombo.find((r) => r.key === key).value;
    console.log("Relation ship : ", relationShip);

    setMember({ ...member, relationShip: relationShip });
  };

  const onFatherChanged = (key) => {
    // console.log("key parent : ", key, " to be found in ", memberItems);
    const item = fatherItems.find((r) => r.key === key);
    const parentId = item ? item.id : null;
    console.log("=========================> Father id : ", parentId);
    setMember({ ...member, father: parentId });
  };

  const onMotherChanged = (key) => {
    // console.log("key parent : ", key, " to be found in ", memberItems);
    const item = motherItems.find((r) => r.key === key);
    const parentId = item ? item.id : null;
    console.log("Mother id : ", parentId);
    setMember({ ...member, mother: parentId });
  };

  // Check validity of input fields before to save the member
  //----------------------------------------------------------
  const checkMember = () => {
    let status = {
      value: true,
      error: [],
      warning: [],
    };
    if (member.gender === Gender.undefined) {
      status.value = false;
      status.error.push("Selectionner un genre !");
    }
    if (relationShipKey === RelationShip.none && member.group === null) {
      status.warning.push("Vous n'avez selectionné ni relation, ni groupe.");
    }

    if (member.firstName === "" || member.lastName === "") {
      status.value = false;
      status.error.push("Les noms et prénoms sont obligatoires.");
    }
    return status;
  };

  const onGenderChanged = (gender) => {
    console.log("Gender  :", gender);
    setMember({ ...member, gender });
  };

  // Save a member in DB and in reducer
  //====================================
  const saveMember = () => {
    const status = checkMember();
    if (!status.value) {
      alert(status.error.join("\n"));
      return;
    }

    console.log("Status ", status);
    console.log("Need tosave : ", member);
    console.log("Fater : ", member.father);

    showObject(member, "SAVINNNNNNNNNNNNNG");

    fetch(FETCH_API + "/members", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tree: member.tree,
        lastName: member.lastName,
        firstName: member.firstName,
        nickName: member.nickName,
        father: member.father,
        mother: member.mother,
        gender: member.gender,
        job: member.job,
        birthDate: member.birthDate,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.result) {
          alert(data.error);
          return;
        }
        console.log("Member Saved in DB OK ", member);
        dispatch(addMember(member));
        showStatusMessage(member.firstName + " " + member.lastName + " créé");
      });
    // .catch((error) => {
    //   console.error("3 While connecting back-end on : " + FETCH_API, error);
    // });

    // Clear interface
    setMember(initialMemberState);
    // TODO Did: Initialiser les drop down Pere et Mere !!!
    setFatherKey("");
    setMotherKey("");
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
            onChangeText={(value) => setMember({ ...member, nickName: value })}
            value={member.nickName}
            style={styles.input}
          />
          {/* TODO : Did : Format date*/}
          <TextInput
            label="Date de naissance"
            variant="outlined"
            onChangeText={(value) => setMember({ ...member, birthDate: value })}
            value={member.birthDate}
            style={styles.input}
          />
          <View style={styles.genderView}>
            <FontAwesome
              style={styles.genderIcon}
              name="male"
              size={35}
              color={member.gender === Gender.male ? "#4781ff" : "#AAAAAA"}
              onPress={() => {
                onGenderChanged(Gender.male);
              }}
            />
            <FontAwesome
              style={styles.genderIcon}
              name="female"
              size={35}
              color={member.gender === Gender.female ? "#f081f6" : "#AAAAAA"}
              onPress={() => {
                onGenderChanged(Gender.female);
              }}
            />
          </View>
          {/* <SelectList
            onSelect={() => onRelationChanged(relationShipKey)}
            setSelected={setRelationShipKey}
            fontFamily={fontFamily}
            data={RelationShipCombo}
            search={false}
            boxStyles={{ borderRadius: 0 }} //override default styles
            defaultOption={{ key: "1", value: "Relation" }} //default selected option
          /> */}
          <SelectList
            style={styles.input}
            onSelect={() => onFatherChanged(fatherKey)}
            setSelected={setFatherKey}
            fontFamily={fontFamily}
            data={fatherItems}
            search={false}
            boxStyles={[styles.input, { borderRadius: 5 }]}
            placeholder="Père"
            defaultOption={fatherItems[0]} //default selected option
          />
          <SelectList
            style={styles.input}
            onSelect={() => onMotherChanged(motherKey)}
            setSelected={setMotherKey}
            fontFamily={fontFamily}
            data={motherItems}
            search={false}
            boxStyles={[styles.input, { borderRadius: 5 }]}
            placeholder="Mère"
            defaultOption={motherItems[0]} //default selected option
          />
          <TextInput
            label="Activité"
            variant="outlined"
            onChangeText={(value) => setMember({ ...member, job: value })}
            value={member.job}
            style={styles.input}
          />
        </View>
        <Text style={styles.statusMessage}>{statusMessage}</Text>
        <View>
          <Button
            onPress={() => {
              saveMember();
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
  statusMessage: {
    fontWeight: 700,
    marginBottom: 5,
  },
});
