import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
  Modal,
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
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMember } from "../reducers/members";
import { fontFamily } from "../modules/deco";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import ImagePicker from "../components/ImagePicker";
import MyDatePicker from "../components/MyDatePicker";

import { Gender, RelationShipCombo, RelationShip } from "../modules/common";
const { getFetchAPI, showObject, showObjects } = require("../modules/util");

const FETCH_API = getFetchAPI();

const initialMemberState = {
  tree: null,
  firstName: "",
  lastName: "",
  nickName: "",
  birthDate: null,
  deathDate: "",
  birthCity: { name: null, latitude: 0, longitude: 0 },
  currentCity: { name: null, latitude: 0, longitude: 0 },
  relationShip: RelationShip.none,
  job: "",
  hobbies: "",
  gender: Gender.undefined,
  group: null,
  father: null,
  mother: null,
  photo: null,
  partner: null,
};
export default function CreateMemberScreen({ navigation }) {
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
  const [partnerKey, setPartnerKey] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [member, setMember] = useState(initialMemberState);
  const [reset, setReset] = useState(false);
  const [internal, setInternal] = useState(true); // Whether member belongs to family or is linked to family by its spouse

  // Ref

  // let statusMessage = "Empty";
  const showStatusMessage = (message) => {
    setStatusMessage(message);

    setTimeout(() => {
      setStatusMessage("");
    }, 3000);
  };

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

  const onPartnerKeyChanged = (key) => {
    // console.log("key parent : ", key, " to be found in ", memberItems);
    const item = partnerItems.find((r) => r.key === key);
    const parentId = item ? item.id : null;
    console.log("Partner id : ", parentId);
    setMember({ ...member, partner: parentId });
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
        partner: member.partner,
        gender: member.gender,
        job: member.job,
        birthDate: member.birthDate,
        photo: member.photo,
        birthCity: member.birthCity,
        currentCity: member.currentCity,
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
    // Clear the image picker
    setReset((prevReset) => !prevReset);
    //clear textInput birthCity and currentCity
    // setBirthCity();
    // setCurrentCity();
  };

  // load to TabNavigator
  // ------------------------------------------------------------
  const onPress = () => {
    navigation.navigate("TabNavigator");
  };

  // Update birthDate in reducer
  // ------------------------------------------------------------
  const updateBirthDate = (birthDate) => {
    setMember({ ...member, birthDate });
  };

  //check via fetch if city exists
  //-----------------------------------------------------------------------

  const checkBirthCity = async () => {
    const response = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${member.birthCity}&limit=1`
    );
    const data = await response.json();
    if (data.features.length === 0) {
      alert("Ville inconnue, veuillez vérifier l'orthographe");
    } else {
      setMember({
        ...member,
        birthCity: {
          name: data.features[0].properties.city,
          latitude: data.features[0].geometry.coordinates[1],
          longitude: data.features[0].geometry.coordinates[0],
        },
      });
      alert("Ville enregistrée");
    }
  };

  const checkcurrentCity = async () => {
    const response = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${member.currentCity}&limit=1`
    );
    const data = await response.json();
    if (data.features.length === 0) {
      setMember({ ...member, currentCity: "" });
      alert("Ville inconnue, veuillez vérifier l'orthographe");
    } else {
      setMember({
        ...member,
        currentCity: {
          name: data.features[0].properties.city,
          latitude: data.features[0].geometry.coordinates[1],
          longitude: data.features[0].geometry.coordinates[0],
        },
      });
      alert("Ville enregistrée");
    }
  };

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
              reset={reset}
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

          <Text>Date de naissance</Text>
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
                value={internal}
                onValueChange={() => setInternal(!internal)}
              />
            }
            onPress={() => setInternal(!enabled)}
          />
          {internal && (
            <SelectList
              onSelect={() => onRelationChanged(relationShipKey)}
              setSelected={setRelationShipKey}
              fontFamily={fontFamily}
              data={RelationShipCombo}
              search={false}
              boxStyles={{ borderRadius: 0 }} //override default styles
              defaultOption={{ key: "1", value: "Relation" }} //default selected option
            />
          )}
          {internal && (
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
          )}
          {internal && (
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
          )}
          {!internal && (
            <SelectList
              style={styles.input}
              onSelect={() => onPartnerKeyChanged(partnerKey)}
              setSelected={setPartnerKey}
              fontFamily={fontFamily}
              data={partnerItems}
              search={false}
              boxStyles={[styles.input, { borderRadius: 5 }]}
              placeholder="Lié à"
              defaultOption={partnerItems[0]} //default selected option
            />
          )}
          <TextInput
            label="Activité"
            variant="outlined"
            onChangeText={(value) => setMember({ ...member, job: value })}
            value={member.job}
            style={styles.input}
          />
          <TextInput
            label="Ville de naissance"
            variant="outlined"
            onChangeText={(value) => setMember({ ...member, birthCity: value })}
            value={member.birthCity.name}
            style={styles.input}
          />
          <Button
            title="valider"
            uppercase={false}
            style={styles.validatebuttonbirthcity}
            titleStyle={{ fontFamily: fontFamily }}
            onPress={checkBirthCity}
          />
          <TextInput
            label="Ville actuelle"
            variant="outlined"
            onChangeText={(value) =>
              setMember({ ...member, currentCity: value })
            }
            value={member.currentCity.name}
            style={styles.input}
          />
          <Button
            title="valider"
            uppercase={false}
            style={styles.validatebuttoncurrentcity}
            titleStyle={{ fontFamily: fontFamily }}
            onPress={checkcurrentCity}
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
