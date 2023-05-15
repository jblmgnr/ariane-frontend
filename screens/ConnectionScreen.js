import { StyleSheet, Text, View, KeyboardAvoidingView } from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAddUser } from "../reducers/user";
import { Button, TextInput, Stack } from "@react-native-material/core";
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text>Ariane</Text>
      <View style={styles.inputChoices}>
        <Button
          onPress={() => {
            setSubscribe(false);
          }}
          title="Se connecter"
          uppercase={false}
          variant={doSubscribe ? "text" : "contained"}
          style={styles.button}
        />

        <Button
          onPress={() => {
            setSubscribe(true);
          }}
          uppercase={false}
          title={"S'inscrire"}
          variant={doSubscribe ? "contained" : "text"}
        />
      </View>
      <TextInput
        label="Nom"
        variant="outlined"
        onChangeText={(value) => setUserInfo({ ...userInfo, lastName: value })}
        value={userInfo.lastName}
        style={[{ display: doSubscribe ? "flex" : "none" }, styles.input]}
      />
      <TextInput
        label="Prénom"
        variant="outlined"
        onChangeText={(value) => setUserInfo({ ...userInfo, firstName: value })}
        value={userInfo.firstName}
        style={[{ display: doSubscribe ? "flex" : "none" }, styles.input]}
      />
      <TextInput
        label="Adresse mail"
        variant="outlined"
        autoCapitalize="none"
        onChangeText={(value) => onEmailChanged(value)}
        value={userInfo.email}
        style={styles.input}
        color={isEmailValid ? "#6101EE" : "#FF0000"}
      />

      {isEmailErrorVisible && (
        <Text style={styles.alert}>L'adresse mail n'est pas valide</Text>
      )}

      <TextInput
        label="Mot de passe"
        variant="outlined"
        secureTextEntry={true}
        onChangeText={(value) => setUserInfo({ ...userInfo, password: value })}
        value={userInfo.password}
        style={styles.input}
      />
      <Button
        onPress={doAction}
        style={{ display: "flex" }}
        title={doSubscribe ? "S'inscrire" : "Se connecter"}
        uppercase={false}
      ></Button>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-around",
  },
  input: {
    width: 200,
    height: 40,
  },
  inputChoices: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  alert: {
    color: "#FF0000",
  },
});
