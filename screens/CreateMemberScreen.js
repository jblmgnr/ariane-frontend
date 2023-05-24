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
  ListItem,
  Switch,
} from "@react-native-material/core";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMember } from "../reducers/members";
import { fontFamily } from "../modules/deco";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import ImagePicker from "../components/ImagePicker";
import MyDatePicker from "../components/MyDatePicker";
import MyCitySelector from "../components/MyCitySelector";

import { Gender, RelationShipCombo, RelationShip } from "../modules/common";
const { getFetchAPI } = require("../modules/util");

const FETCH_API = getFetchAPI();

const initialMemberState = {
  tree: null,
  firstName: "",
  lastName: "",
  nickName: "",
  birthDate: null,
  deathDate: "",
  birthCity: { name: "", latitude: 0, longitude: 0 },
  currentCity: { name: "", latitude: 0, longitude: 0 },
  relationShip: RelationShip.none,
  job: "",
  hobbies: "",
  gender: Gender.undefined,
  group: null,
  sameBlood: true,
  father: null,
  mother: null,
  photo: null,
  partner: null,
};

export default function CreateMemberScreen({ route, navigation }) {
  const { create, editedMember = null } = route.params;
  console.log(
    "    \u001b[31m MODE  : ==================  \u001b[0m",
    create ? "CREATE" : "EDIT",
    editedMember
  );
  const dispatch = useDispatch();
  const { height, width, scale, fontScale } = useWindowDimensions();

  // From reducer
  const members = useSelector((state) => state.members.value);
  const user = useSelector((state) => state.user.value);
  initialMemberState.tree = user.tree;

  // Contents of father, mother and partner must be defined before the use states
  // because they are used to set default values of editedMembers.
  const partnerItems = [];
  partnerItems.push({ key: "0", value: "Aucun lien", id: null });
  for (let i = 0; i < members.length; i++) {
    const m = members[i];
    let value = m.firstName + " " + m.lastName;
    if (m.nickName && m.nickName.length > 0) value += " (" + m.nickName + ")";
    partnerItems.push({ key: (i + 1).toString(), value, id: m._id });
  }

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
  // States
  const [relationShipKey, setRelationShipKey] = useState("");
  // const [fatherKey, setFatherKey] = useState(
  //   editedMember ? keyFromIdInItems(editedMember.father, fatherItems) : ""
  // );
  const [fatherKeyState, setFatherKeyState] = useState("");
  const [motherKeyState, setMotherKeyState] = useState("");
  const [partnerKeyState, setPartnerKeyState] = useState("");
  const [defaultFatherKey, setDefaultFatherKey] = useState("");
  const [defaultMotherKey, setDefaultMotherKey] = useState("");
  const [defaultPartnerKey, setDefaultPartnerKey] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [member, setMember] = useState(initialMemberState);
  const [resetImagePicker, setResetImagePicker] = useState(false);

  const [f, setF] = useState("");
  const [m, setM] = useState("");
  const [p, setP] = useState("");
  // console.log(
  //   "==================================================== FATHER KEY ",
  //   defaultFatherKey
  // );
  // console.log(
  //   "==================================================== MOTHER KEY ",
  //   defaultMotherKey
  // );

  useEffect(() => {
    if (create) return;
    //  In edition mode, update fields with info of editedMember
    console.log("Gender  : ", editedMember.gender);

    const birthCity = editedMember.birthCity
      ? editedMember.birthCity
      : initialMemberState.birthCity;

    const currentCity = editedMember.currentCity
      ? editedMember.currentCity
      : initialMemberState.currentCity;
    setMember({
      ...member,
      firstName: editedMember.firstName,
      lastName: editedMember.lastName,
      nickName: editedMember.nickName,
      birthDate: editedMember.birthDate,
      gender: editedMember.gender,
      sameBlood: editedMember.sameBlood,
      job: editedMember.job,
      birthCity: birthCity,
      currentCity: currentCity,
    });

    if (editedMember.sameBlood) {
      const fKey = keyFromIdInItems(editedMember.father, fatherItems);
      console.log("father key  FFFFFFFFFFFFFFFFFFF : ", fKey);
      // setDefaultFatherKey(fKey);
      setF(fKey);
      console.log(
        "father key  AAAAABBBBBBBBBBBBBBBBBBBBBBBBBBBAAAAAAAAAAAAAAAA : ",
        defaultFatherKey
      );
      const mKey = keyFromIdInItems(editedMember.mother, motherItems);
      console.log("Mother key  MMMMMMMMMMMMMMMMMMMMM  : ", mKey);
      // setDefaultMotherKey(mKey);
      setM(mKey);
      setP(keyFromIdInItems(editedMember.partner, partnerItems));
    }
  }, []);

  const showStatusMessage = (message) => {
    setStatusMessage(message);

    setTimeout(() => {
      setStatusMessage("");
    }, 3000);
  };

  function keyFromIdInItems(id, items) {
    console.log("Try to find key of id ; ", id);
    // console.log(items);
    const foundEntry = items.find((e) => e.id == id);

    console.log(" YYYYYYYYYYESSSSSSSSSS  KEY ; ", foundEntry);
    if (foundEntry) return foundEntry;

    return items[0];
  }

  const onFatherChanged = (key) => {
    console.log("key parent : ", key, " to be found in ");
    const item = fatherItems.find((r) => r.key === key);
    const parentId = item ? item.id : null;
    console.log("=========================> Father id : ", parentId);
    setDefaultFatherKey(key);
    setMember({ ...member, father: parentId });
  };

  const onMotherChanged = (key) => {
    // console.log("key parent : ", key, " to be found in ", memberItems);
    const item = motherItems.find((r) => r.key === key);
    const parentId = item ? item.id : null;
    // console.log("Mother id : ", parentId);
    setMember({ ...member, mother: parentId });
  };

  const onPartnerKeyChanged = (key) => {
    // console.log("key parent : ", key, " to be found in ", memberItems);
    const item = partnerItems.find((r) => r.key === key);
    const parentId = item ? item.id : null;
    // console.log("Partner id : ", parentId);
    setMember({ ...member, partner: parentId });
  };

  let c = 0;
  // Check validity of input fields before to save the member
  //----------------------------------------------------------
  const checkMember = async () => {
    let status = {
      result: true,
      error: [],
      warning: [],
    };
    if (member.gender === Gender.undefined) {
      status.result = false;
      status.error.push("Selectionner un genre !");
    }
    if (relationShipKey === RelationShip.none && member.group === null) {
      status.warning.push("Vous n'avez selectionné ni relation, ni groupe.");
    }

    if (member.firstName === "" || member.lastName === "") {
      status.result = false;
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
  const saveMember = async () => {
    const status = await checkMember();

    console.log(c++, "Status : ", status);
    if (!status.result) {
      alert(status.error.join("\n"));
      return;
    }

    console.log("Status ", status);

    const route = create ? "POST" : "PUT";

    const fields = {
      tree: member.tree,
      lastName: member.lastName,
      firstName: member.firstName,
      nickName: member.nickName,
      father: member.father,
      mother: member.mother,
      partner: member.partner,
      gender: member.gender,
      job: member.job,
      birthDate: member.birthDate,
      photo: member.photo,
      birthCity: member.birthCity,
      currentCity: member.currentCity,
      sameBlood: member.sameBlood,
    };

    if (!create) fields["_id"] = editedMember._id;

    console.log("Try to save ", fields);

    fetch(FETCH_API + "/members", {
      method: route,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.result) {
          alert(data.error);
          return;
        }

        member._id = data.newMember._id;

        showStatusMessage(
          member.firstName + " " + member.lastName + " sauvegrdé"
        );

        if (create) {
          console.log("Member Saved in DB OK ", member);
          dispatch(addMember(member));

          // Clear interface
          setMember(initialMemberState);
          // TODO Did: Initialiser les drop down Pere et Mere !!!
          setDefaultFatherKey("");
          setDefaultMotherKey("");
          // Clear the image picker
          setResetImagePicker((prevReset) => !prevReset);
        }
        //clear textInput birthCity and currentCity
        // setBirthCity("");
        // setCurrentCity("");
      });
  };

  // load to TabNavigator
  // ------------------------------------------------------------
  const onPress = () => {
    navigation.goBack();
  };

  // Update birthDate in reducer
  // ------------------------------------------------------------
  const updateBirthDate = (birthDate) => {
    setMember({ ...member, birthDate });
  };

  const updateBirthCity = (city) => {
    console.log("IN CREATE MEMEBER :: birth city ", city);
    setMember({ ...member, birthCity: city });
  };

  const updateCurrentCity = (city) => {
    console.log("IN CREATE MEMEBER :: current city ", city);
    setMember({ ...member, currentCity: city });
  };

  console.log("==================================================== f KEY ", f);
  console.log("==================================================== m KEY ", m);

  return (
    <KeyboardAwareScrollView
      style={{
        marginTop: Platform.OS === "android" ? 30 : 60,
        backgroundColor: "#ffffff",
      }}
    >
      <View style={styles.container}>
        <View style={styles.buttoncontainer}>
          <TouchableOpacity onPress={onPress} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={30} color="#7C4DFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputsView}>
          <View style={styles.imagePicker}>
            <ImagePicker
              uploadUrl={FETCH_API + "/upload"}
              onUpload={(data) => {
                console.log("Image uploaded:", data);
                setMember({ ...member, photo: data.url });
              }}
              reset={resetImagePicker}
              diameter={100}
              style={styles.imagePicker}
            />
          </View>
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

          <MyDatePicker
            defaultValue={member.birthDate}
            setValueCallback={updateBirthDate}
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
          <ListItem
            title={
              member.gender === Gender.female
                ? "Issue de la famille"
                : "Issu de la famille"
            }
            trailing={
              <Switch
                value={member.sameBlood}
                onValueChange={(value) =>
                  setMember({ ...member, sameBlood: value })
                }
              />
            }
            onPress={() => setInternal(!enabled)}
          />
          {member.sameBlood && (
            <SelectList
              style={styles.input}
              onSelect={() => onFatherChanged(fatherKeyState)}
              setSelected={setFatherKeyState}
              fontFamily={fontFamily}
              data={fatherItems}
              search={false}
              boxStyles={[styles.input, { borderRadius: 5 }]}
              placeholder="Père"
              defaultOption={f} //default selected option
            />
          )}
          {member.sameBlood && (
            <SelectList
              style={styles.input}
              onSelect={() => onMotherChanged(motherKeyState)}
              setSelected={setMotherKeyState}
              fontFamily={fontFamily}
              data={motherItems}
              search={false}
              boxStyles={[styles.input, { borderRadius: 5 }]}
              placeholder="Mère"
              defaultOption={m} //default selected option
            />
          )}
          {!member.sameBlood && (
            <SelectList
              style={styles.input}
              onSelect={() => onPartnerKeyChanged(partnerKeyState)}
              setSelected={setPartnerKeyState}
              fontFamily={fontFamily}
              data={partnerItems}
              search={false}
              boxStyles={[styles.input, { borderRadius: 5 }]}
              placeholder="Lié à"
              defaultOption={p} //default selected option
            />
          )}
          <TextInput
            label="Activité"
            variant="outlined"
            onChangeText={(value) => setMember({ ...member, job: value })}
            value={member.job}
            style={styles.input}
          />
          <MyCitySelector
            label="Ville de naissance"
            defaultValue={member.birthCity.name}
            setValueCallback={updateBirthCity}
          />
          <MyCitySelector
            label="Ville actuelle"
            defaultValue={member.currentCity.name}
            setValueCallback={updateCurrentCity}
          />
        </View>
        <Text style={styles.statusMessage}>{statusMessage}</Text>
        <View>
          <Button
            onPress={() => {
              saveMember();
            }}
            title={create ? "Créé le membre" : "Modifie le membre"}
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
  validatebuttonbirthcity: {
    width: "30%",
    borderRadius: 5,
    fontFamily: fontFamily,
    marginBottom: 5,
    marginLeft: 10,
    position: "absolute",
    right: 5,
    bottom: 63,
  },
  validatebuttoncurrentcity: {
    width: "30%",
    borderRadius: 5,
    fontFamily: fontFamily,
    marginBottom: 5,
    marginLeft: 10,
    position: "absolute",
    right: 5,
    bottom: -6,
  },

  container: {
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#ffffff",
    marginTop: Platform.OS === "android" ? 30 : 0,
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
  imagePicker: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  button: {
    width: "80%",
    borderRadius: 5,
    fontFamily: fontFamily,
    marginBottom: 5,
  },
  buttoncontainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    position: "absolute",
    marginTop: 50,
    width: "100%",
  },
  backButton: {
    padding: 5,
    margin: 10,
    borderColor: "#7C4DFF",
    borderWidth: 1,
    borderRadius: 5,
  },
});
