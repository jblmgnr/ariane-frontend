import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAddUser } from "../reducers/user";
import { Button, TextInput, Stack } from "@react-native-material/core";

export default function ConnectionScreen({ navigation }) {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [userInfos, setUserInfos] = useState({
    lastName: "",
    firstName: "",
    email: "",
    password: "",
  });

  //Ajout d'un user en BDD en vérifiant si les données sont ok
  const signUp = () => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; //regex pour vérifier si l'email est valide
    if (re.test(userInfos.email) === false) {
      setVisible(true);
    } else {
      fetch("http://10.33.210.172:3000/users/signup", {
        // BIEN PENSER A CHANGER L'URL DU FETCH
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lastName: userInfos.lastName,
          firstName: userInfos.firstName,
          email: userInfos.email,
          password: userInfos.password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            console.log("Success:", data);
            dispatch(setAddUser(data));
            navigation.navigate("TabNavigator");
          } else {
            alert(data.error);
          }
        })
        .catch((error) => {
          console.error("back is not start", error);
        });
    }
  };

  //connection d'un user déjà existant
  const signIn = () => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; //regex pour vérifier si l'email est valide
    if (re.test(userInfos.email) === false) {
      setVisible(true);
    } else {
      fetch("http://10.33.210.172:3000/users/signin", {
        // BIEN PENSER A CHANGER L'URL DU FETCH
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userInfos.email,
          password: userInfos.password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            console.log("Success:", data);
            dispatch(setAddUser(data));
            navigation.navigate("TabNavigator");
          } else {
            alert(data.error);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <Text>Ariane</Text>
      <View style={styles.inputChoices}>
        <Button
          onPress={() => {
            setIsVisible(false);
          }}
          title="Se connecter"
          uppercase={false}
          variant={isVisible ? "text" : "contained"}
          style={styles.button}/>

        <Button
          onPress={() => {
            setIsVisible(true);
          }}
          uppercase={false}
          title={"S'inscrire"}
          variant={isVisible ? "contained" : "text"} />
      </View>
      <TextInput
        label="Nom"
        variant="outlined"
        onChangeText={(value) =>
          setUserInfos({ ...userInfos, lastName: value })
        }
        value={userInfos.lastName}
        style={[{ display: isVisible ? "flex" : "none" }, styles.input]}
      />
      <TextInput
        label="Prénom"
        variant="outlined"
        onChangeText={(value) =>
          setUserInfos({ ...userInfos, firstName: value })
        }
        value={userInfos.firstName}
        style={[{ display: isVisible ? "flex" : "none" }, styles.input]}
      />
      <TextInput
        label="Adresse mail"
        variant="outlined"
        autoCapitalize="none"
        onChangeText={(value) => setUserInfos({ ...userInfos, email: value })}
        value={userInfos.email}
        style={styles.input}
      />
      <Text style={[styles.alert, { display: visible ? "flex" : "none" }]}>
        L'adresse mail n'est pas valide
      </Text>
      <TextInput
        label="Mot de passe"
        variant="outlined"
        secureTextEntry={true}
        onChangeText={(value) =>
          setUserInfos({ ...userInfos, password: value })
        }
        value={userInfos.password}
        style={styles.input}
      />
      <Button
        onPress={signUp}
        style={{ display: !isVisible ? "none" : "flex" }}
        title={"S'inscrire"}
        uppercase={false}
      ></Button>

      <Button
        onPress={signIn}
        style={{ display: isVisible ? "none" : "flex" }}
        title="Se connecter"
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
  button: {

  },
});
