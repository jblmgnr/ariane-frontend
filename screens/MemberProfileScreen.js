import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";

import moment from "moment";
import localization from "moment/locale/fr";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import { Avatar } from "@react-native-material/core";
import { useFonts } from "expo-font";
import { fontFamily } from "../modules/deco";

export default function MemberProfileScreen({ route, navigation }) {
  const { member } = route.params;
  const members = useSelector((state) => state.members.value);

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
  const onPressEdit = () => {
    navigation.navigate("CreateMember", {
      create: false,
      editedMember: member,
    });
  };

  const fatherId = member.father;
  const motherId = member.mother;
  const partnerId = member.partner;

  //search Firstname and Lastname of fatherId, motherId and partnerId on reducers members
  // ------------------------------------------------------------
  const father = members.find((f) => f._id === fatherId);
  const mother = members.find((m) => m._id === motherId);
  const partner = members.find((p) => p._id === partnerId);

  // check if fatherId or motherId or partnerId exist
  // ------------------------------------------------------------
  const showRelation = () => {
    if (fatherId || motherId) {
      return (
        <View style={styles.optionnalinfos}>
          <Text style={styles.subtitle}>Proches</Text>
          <Text style={styles.subtitle}>Père</Text>
          <Text style={styles.text}>
            {fatherId
              ? `${father.firstName} ${father.lastName}`
              : "Non renseigné"}
          </Text>
          <Text style={styles.subtitle}>Mère</Text>
          <Text style={styles.text}>
            {motherId
              ? `${mother.firstName} ${mother.lastName}`
              : "Non renseigné"}
          </Text>
        </View>
      );
    }
    if (partnerId !== null) {
      return (
        <View style={styles.optionnalinfos}>
          <Text style={styles.subtitle}>Proches</Text>
          <Text style={styles.subtitle}>Conjoint</Text>
          <Text style={styles.text}>
            {partner.firstName} {partner.lastName}
          </Text>
        </View>
      );
    }
    if (!fatherId && !motherId && !partnerId) {
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
        <TouchableOpacity onPress={onPressEdit} style={styles.button}>
          <MaterialIcons name="edit" size={30} color="#7C4DFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        {member.photo ? (
          <Avatar
            style={styles.avatar}
            image={{ uri: member.photo }}
            size={100}
            color="black"
          />
        ) : (
          <Avatar
            style={styles.avatar}
            icon={(props) => <Icon name="account" {...props} />}
            color="black"
            size={100}
          />
        )}
        <Text style={styles.title}>
          {member.firstName} {member.lastName}
        </Text>
      </View>

      <View style={styles.container}>
        <ScrollView>
          <Image
            source={require("../assets/logo.png")}
            style={styles.backgroundImage}
          />
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
              {member.birthCity && member.birthCity.name !== ""
                ? member.birthCity.name
                : "Non renseigné"}
            </Text>
            <Text style={styles.subtitle}>Dernière ville de résidence</Text>
            <Text style={styles.text}>
              {member.currentCity && member.currentCity.name !== ""
                ? member.currentCity.name
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
  backgroundImage: {
    position: "absolute",
    flex: 1,
    resizeMode: "cover", // or 'stretch'
    zIndex: -1,
    opacity: 0.5,
    transform: [{ scale: 2 }],
  },
  optionnalinfos: {
    margin: 20,
  },
  maincontainer: {
    flex: 1,
    backgroundColor: "#363B44",
  },
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#363B44",
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
    zIndex: 1,
  },
  button: {
    padding: 5,
    margin: 10,
    borderColor: "#7C4DFF",
    borderWidth: 1,
    borderRadius: 5,
    zIndex: 1,
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
    color: "#FFFFFF",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: "QuicksandBold",
    color: "white",
  },
  text: {
    fontSize: 16,
    fontFamily: fontFamily,
    color: "white",
    marginBottom: 10,
  },
});
