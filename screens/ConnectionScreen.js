import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Image,
  ScrollView,
  useWindowDimensions,
  SafeAreaView,
  Platform,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../reducers/user";
import { Button, TextInput, IconButton } from "@react-native-material/core";
import { useFonts } from "expo-font";
import { fontFamily } from "../modules/deco";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

const { getFetchAPI } = require("../modules/util");

const FETCH_API = getFetchAPI();
console.log("API to fetch : ", FETCH_API);

// useWindowDimensions
// ------------------------------------------------------------

export default function ConnectionScreen({ navigation }) {
  const { height, width, scale, fontScale } = useWindowDimensions();
  const dispatch = useDispatch();
  const a = "navigation";
  const [doSubscribe, setSubscribe] = useState(false); // Connect or Register
  const [isEmailErrorVisible, setEmailErrorVisible] = useState(false); // Display email error message
  const [isEmailValid, setEmailValid] = useState(true); // Display email with error style
  const [userInfo, setUserInfo] = useState({
    lastName: "",
    firstName: "",
    email: "pierrepaul@jacques.com",
    password: "pierrepauljacques",
  });
  const [isPasswordVisible, setPasswordVisible] = useState(false);

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

    if (userInfo.email.length <= 0) {
      alert("L'Email est vide");
      return;
    }
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
        dispatch(setUser(data.user));
        navigation.navigate("TabNavigator");
      })
      .catch((error) => {
        console.error("While connecting back-end on " + FETCH_API, error);
      });
  };

  // Connection d'un user déjà existant
  //-----------------------------------------------------------------------
  const signIn = () => {
    console.log("email : ", userInfo.email);
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
        console.log("SignIn OK");
        dispatch(setUser(data.user));
        navigation.navigate("TabNavigator");
      })
      .catch((error) => {
        console.error("While connecting back-end on " + FETCH_API, error);
      });
  };

  // Check email
  //-----------------------------------------------------------------------
  const onEmailChanged = (value) => {
    console.log("onEmailChanged : ", value);

    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; //regex pour vérifier si l'email est valide
    setUserInfo({ ...userInfo, email: value });

    const isValid = re.test(value);
    console.log("IS EMAIL VALID : ", isValid);
    setEmailValid(isValid);
  };

  // Style inputs
  //-----------------------------------------------------------------------

  return (
    <KeyboardAwareScrollView style={{ backgroundColor: "white" }}>
      <View style={[styles.container, { height: height }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Ariane</Text>
          <Image
            style={styles.image}
            source={require("../assets/logo-transparent.png")}
          />
          <View style={styles.buttonChoices}>
            <Button
              onPress={() => {
                setSubscribe(false);
              }}
              title="Connexion"
              uppercase={true}
              variant={doSubscribe ? "outlined" : "contained"}
              titleStyle={{ fontFamily: "Quicksand" }}
            />
            <Button
              onPress={() => {
                setSubscribe(true);
              }}
              uppercase={true}
              title={"Inscription"}
              variant={doSubscribe ? "contained" : "outlined"}
              titleStyle={{ fontFamily: "Quicksand" }}
            />
          </View>
        </View>

        <View style={styles.inputsView}>
          {doSubscribe && (
            <TextInput
              label="Prénom"
              variant="outlined"
              onChangeText={(value) =>
                setUserInfo({ ...userInfo, firstName: value })
              }
              value={userInfo.firstName}
              style={[styles.input]}
              inputStyle={{ fontFamily: "Quicksand" }}
            />
          )}

          {doSubscribe && (
            <TextInput
              label="Nom"
              variant="outlined"
              onChangeText={(value) =>
                setUserInfo({ ...userInfo, lastName: value })
              }
              value={userInfo.lastName}
              style={[styles.input]}
              inputStyle={{ fontFamily: "Quicksand" }}
            />
          )}

          <TextInput
            label="Adresse mail"
            variant="outlined"
            autoCapitalize="none"
            onChangeText={(value) => onEmailChanged(value)}
            value={userInfo.email}
            style={styles.input}
            color={isEmailValid ? "#6101EE" : "#FF0000"}
            inputStyle={{ fontFamily: "Quicksand" }}
          />
          {isEmailErrorVisible && (
            <Text style={styles.alert}>L'adresse mail n'est pas valide</Text>
          )}

          <TextInput
            label="Mot de passe"
            variant="outlined"
            secureTextEntry={!isPasswordVisible}
            onChangeText={(value) =>
              setUserInfo({ ...userInfo, password: value })
            }
            value={userInfo.password}
            style={styles.input}
            trailing={(props) => (
              <IconButton
                icon={(props) => <Icon name="eye" {...props} />}
                {...props}
                onPress={() => setPasswordVisible(!isPasswordVisible)}
              />
            )}
            inputStyle={{ fontFamily: "Quicksand" }}
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
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#fff",
    marginTop: Platform.OS === "ios" ? 20 : 30,
  },
  header: {
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 500,
    margin: 20,
  },
  title: {
    fontFamily: "Quicksand",
    fontSize: 40,
    marginTop: Platform.OS === "ios" ? 50 : 30,
  },
  buttonChoices: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 20,
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
  alert: {
    color: "#FF0000",
    fontFamily: "Quicksand",
    marginBottom: 10,
  },
  button: {
    fontFamily: fontFamily,
  },
  validateButton: {
    width: "80%",
    borderRadius: 10,
    marginBottom: 40,
  },
});
