import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Image,
  ScrollView,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAddUser } from "../reducers/user";
import { Button, TextInput, Stack } from "@react-native-material/core";
import { useFonts } from "expo-font";
const { getFetchAPI } = require("../modules/util");

const FETCH_API = getFetchAPI();
console.log("API to fetch : ", FETCH_API);
export default function ConnectionScreen({ navigation }) {
  const dispatch = useDispatch();
  const [doSubscribe, setSubscribe] = useState(false); // Connect or Register
  const [isEmailErrorVisible, setEmailErrorVisible] = useState(false); // Display email error message
  const [isEmailValid, setEmailValid] = useState(false); // Display email with error style
  const [userInfo, setUserInfo] = useState({
    lastName: "",
    firstName: "",
    email: "",
    password: "",
  });

  // load font family Quicksand useFont expo-font
  // ------------------------------------------------------------
  const [loaded] = useFonts({
    Quicksand: require("../assets/fonts/Quicksand-Medium.ttf"),
  });

  if (!loaded) {
    return null;
  }

  console.log("test", loaded);
  // Check email and sign in or sign up
  //-----------------------------------------------------------------------
  const doAction = () => {
    setEmailErrorVisible(!isEmailValid);
    console.log("setEmailErrorVisible ", !isEmailValid);

    if (!isEmailValid) {
      return;
    }

    if (doSubscribe) signUp();
    else signIn();
  };

  // Ajout d'un user en BDD
  //-----------------------------------------------------------------------
  const signUp = () => {
    fetch(FETCH_API + "/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lastName: userInfo.lastName,
        firstName: userInfo.firstName,
        email: userInfo.email,
        password: userInfo.password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.result) {
          alert(data.error);
          return;
        }
        console.log("SignUP OK");
        dispatch(setAddUser(data));
        navigation.navigate("TabNavigator");
      })
      .catch((error) => {
        console.error("While connecting back-end on " + FETCH_API, error);
      });
  };

  // Connection d'un user déjà existant
  //-----------------------------------------------------------------------
  const signIn = () => {
    fetch(FETCH_API + "/users/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userInfo.email,
        password: userInfo.password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.result) {
          alert(data.error);
          return;
        }
        console.log("SignUP OK");
        dispatch(setAddUser(userInfo));
        navigation.navigate("TabNavigator");
      })
      .catch((error) => {
        console.error("While connecting back-end on " + FETCH_API, error);
      });
  };

  // Check email
  //-----------------------------------------------------------------------
  const onEmailChanged = (value) => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; //regex pour vérifier si l'email est valide
    setUserInfo({ ...userInfo, email: value });

    const isValid = re.test(value);
    console.log("IS EMAIL VALID : ", isValid);
    setEmailValid(isValid);
  };

  // Style inputs
  //-----------------------------------------------------------------------

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Ariane</Text>
          <Image
            style={styles.image}
            source={require("../assets/logo-transparent.png")}
          />
        </View>
        <View style={styles.buttonChoices}>
          <Button
            onPress={() => {
              setSubscribe(false);
            }}
            title="Se connecter"
            uppercase={false}
            variant={doSubscribe ? "text" : "contained"}
            titleStyle={{ fontFamily: "Quicksand" }}
          />
          <Button
            onPress={() => {
              setSubscribe(true);
            }}
            uppercase={false}
            title={"S'inscrire"}
            variant={doSubscribe ? "contained" : "text"}
            titleStyle={{ fontFamily: "Quicksand" }}
          />
        </View>

        <View style={styles.inputsView}>
          {doSubscribe && (
            <TextInput
              label="Nom"
              variant="outlined"
              onChangeText={(value) =>
                setUserInfo({ ...userInfo, lastName: value })
              }
              value={userInfo.lastName}
              style={[{ display: doSubscribe ? "flex" : "none" }, styles.input]}
              labelStyle={{ fontFamily: "Quicksand" }}
            />
          )}

          {doSubscribe && (
            <TextInput
              label="Prénom"
              variant="outlined"
              onChangeText={(value) =>
                setUserInfo({ ...userInfo, firstName: value })
              }
              value={userInfo.firstName}
              style={[{ display: doSubscribe ? "flex" : "none" }, styles.input]}
              titleStyle={{ fontFamily: "Quicksand" }}
            />
          )}

          <TextInput
            label="Adresse mail"
            variant="outlined"
            autoCapitalize="none"
            onChangeText={(value) => onEmailChanged(value)}
            value={userInfo.email}
            style={styles.input}
            titleStyle={{ fontFamily: "Quicksand" }}
            color={isEmailValid ? "#6101EE" : "#FF0000"}
          />
          {isEmailErrorVisible && (
            <Text style={styles.alert}>L'adresse mail n'est pas valide</Text>
          )}

          <TextInput
            label="Mot de passe"
            variant="outlined"
            secureTextEntry={true}
            onChangeText={(value) =>
              setUserInfo({ ...userInfo, password: value })
            }
            value={userInfo.password}
            style={styles.input}
            titleStyle={{ fontFamily: "Quicksand" }}
          />
        </View>
        <Button
          onPress={doAction}
          title={doSubscribe ? "S'inscrire" : "Se connecter"}
          uppercase={false}
          titleStyle={{ fontFamily: "Quicksand" }}
          style={styles.validateButton}
        ></Button>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // height: 900, // Uwe window dimension and we are OK !!!
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  image: {
    width: 170,
    height: 170,
    borderRadius: 70,
    backgroundColor: "red",
  },
  title: {
    fontFamily: "Quicksand",
    fontSize: 40,
  },
  buttonChoices: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  inputsView: {
    justifyContent: "space-evenly",
    width: "80%",
  },
  input: {
    width: "100%",
    fontFamily: "Quicksand",
    marginBottom: 5,
    marginTop: 5,
  },
  alert: {
    color: "#FF0000",
  },
  button: {
    fontFamily: "Quicksand",
  },
  validateButton: {
    width: "80%",
    borderRadius: 10,
  },
});
