import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";

import moment from "moment";
import localization from "moment/locale/fr";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useState } from "react";
import { Button, Avatar } from "@react-native-material/core";
import { useFonts } from "expo-font";
import { fontFamily } from "../modules/deco";

const { getFetchAPI } = require("../modules/util");
const FETCH_API = getFetchAPI();

export default function MemberProfileScreen({ route, navigation }) {
  const { member } = route.params;
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [partnerName, setpartnerName] = useState("");

  // load font family Quicksand Bold useFont expo-font
  // ------------------------------------------------------------
  const [loaded] = useFonts({
    QuicksandBold: require("../assets/fonts/Quicksand-Bold.ttf"),
  });

  if (!loaded) {
    return null;
  }
  // load to TabNavigator
  // ------------------------------------------------------------
  const onPress = () => {
    navigation.navigate("TabNavigator");
  };

  // load to MemberProfileEdit
  // ------------------------------------------------------------
  //   const onPressEdit = () => {
  //     navigation.navigate("MemberProfileEdit");
  //   };

  //fetch Firstname and Lastname of member.father
  // ------------------------------------------------------------
  const fatherId = member.father;

  const fetchFatherName = () => {
    fetch(FETCH_API + "/members")
      .then((response) => response.json())
      .then((datafather) => {
        const father = datafather.members.find(
          (member) => member._id === fatherId
        );
        father
          ? setFatherName(father.firstName + " " + father.lastName)
          : setFatherName("non renseigné");
      })
      .catch((error) => {
        console.error("2 While connecting back-end on " + FETCH_API, error);
      });
  };

  fetchFatherName();

  // fetchFirstName and LastName of member.mother
  // ------------------------------------------------------------
  const motherId = member.mother;
  const fetchMotherName = () => {
    fetch(FETCH_API + "/members")
      .then((response) => response.json())
      .then((datamother) => {
        const mother = datamother.members.find(
          (member) => member._id === motherId
        );
        mother
          ? setMotherName(mother.firstName + " " + mother.lastName)
          : setMotherName("non renseigné");
      })
      .catch((error) => {
        console.error("2 While connecting back-end on " + FETCH_API, error);
      });
  };
  fetchMotherName();

  // fetchFirstName and LastName of member.partner
  const verifyispartner = () => {
    fetch(FETCH_API + "/members")
      .then((response) => response.json())
      .then((datapartner) => {
        const partner = datapartner.members.find(
          (member) => member._id === member.partner
        );
        partner
          ? setpartnerName(partner.firstName + " " + partner.lastName)
          : setpartnerName("non renseigné");
      })
      .catch((error) => {
        console.error("2 While connecting back-end on " + FETCH_API, error);
      });
  };
  verifyispartner();

  // check if member.father or member.mother or member.partner exist
  const showRelation = () => {
    if (member.father || member.mother) {
      return (
        <View style={styles.optionnalinfos}>
          <Text style={styles.subtitle}>Proches</Text>
          <Text style={styles.subtitle}>Père</Text>
          <Text style={styles.text}>{fatherName}</Text>
          <Text style={styles.subtitle}>Mère</Text>
          <Text style={styles.text}>{motherName}</Text>
        </View>
      );
    } else if (member.partner) {
      return (
        <View style={styles.optionnalinfos}>
          <Text style={styles.subtitle}>Proches</Text>
          <Text style={styles.subtitle}>Conjoint</Text>
          <Text style={styles.text}>{partnerName}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.optionnalinfos}>
          <Text style={styles.subtitle}>Proches</Text>
          <Text style={styles.text}>Non renseignés</Text>
        </View>
      );
    }
  };

  showRelation();

  return (
    <View style={styles.maincontainer}>
      <View style={styles.buttoncontainer}>
        <TouchableOpacity onPress={onPress} style={styles.button}>
          <MaterialIcons name="arrow-back" size={30} color="#7C4DFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPress} style={styles.button}>
          <MaterialIcons name="edit" size={30} color="#7C4DFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Avatar image={{ uri: member.photo }} size={100} />
        <Text style={styles.title}>
          {member.firstName} {member.lastName}
        </Text>
      </View>

      <View style={styles.container}>
        <ScrollView>
          <View style={styles.infos}>
            <Text style={styles.subtitle}>Nom</Text>
            <Text style={styles.text}>
              {member.lastName ? member.lastName : "Non renseigné"}
            </Text>
            <Text style={styles.subtitle}>Prénom</Text>
            <Text style={styles.text}>
              {member.firstName ? member.firstName : "Non renseigné"}
            </Text>
            <Text style={styles.subtitle}>Surnom</Text>
            <Text style={styles.text}>
              {member.nickName ? member.nickName : "Non renseignée"}
            </Text>
            <Text style={styles.subtitle}>Téléphone</Text>
            <Text style={styles.text}>
              {member.phone ? member.phone : "Non renseigné"}
            </Text>
            <Text style={styles.subtitle}>Email</Text>
            <Text style={styles.text}>
              {member.email ? member.email : "Non renseigné"}
            </Text>
            <Text style={styles.subtitle}>Date de naissance</Text>
            <Text style={styles.text}>
              {member.birthDate !== null
                ? moment(member.birthDate)
                    .locale("fr", localization)
                    .format("LL")
                : "Non renseigné"}
            </Text>
            <Text style={styles.subtitle}>Ville de naissance</Text>
            <Text style={styles.text}>
              {member.birthCity === null
                ? member.birthCity[0].name
                : "Non renseigné"}
            </Text>
            <Text style={styles.subtitle}>Ville actuelle</Text>
            <Text style={styles.text}>
              {member.currentCity === null
                ? member.currentCity[0].name
                : "Non renseigné"}
            </Text>
            <Text style={styles.subtitle}>Job</Text>
            <Text style={styles.text}>
              {member.job ? member.job : "Non renseigné"}
            </Text>
            <Text style={styles.subtitle}>Centres d'intêrets</Text>
            <Text style={styles.text}>
              {!member.hobbies ? member.hobbies : "Non renseigné"}
            </Text>
            <Text style={styles.subtitle}>
              Un peu plus sur {member.firstName}
            </Text>
            <Text style={styles.text}>
              {member.story ? member.story : "Non renseigné"}
            </Text>
          </View>
          {showRelation()}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  optionnalinfos: {
    margin: 20,
  },
  maincontainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    width: "100%",
  },
  infos: {
    marginLeft: 20,
    marginRight: 20,
    borderBottomColor: "#7C4DFF",
    borderBottomWidth: 3,
    justifyContent: "center",
  },

  buttoncontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  button: {
    padding: 5,
    margin: 10,
    borderColor: "#7C4DFF",
    borderWidth: 1,
    borderRadius: 5,
  },
  header: {
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  title: {
    marginTop: 10,
    fontSize: 28,
    fontFamily: "QuicksandBold",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: "QuicksandBold",
  },
  text: {
    fontSize: 16,
    fontFamily: fontFamily,
  },
});
