import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAddUser } from "../reducers/user";

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
    <View style={styles.container}>
      <Text>Ariane</Text>
      <TouchableOpacity
        onPress={() => {
          setIsVisible(false);
        }}
      >
        <Text>Se connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setIsVisible(true);
        }}
      >
        <Text>S'inscrire</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Nom"
        onChangeText={(value) =>
          setUserInfos({ ...userInfos, lastName: value })
        }
        value={userInfos.lastName}
        style={{ display: isVisible ? "flex" : "none" }}
      />
      <TextInput
        placeholder="Prénom"
        onChangeText={(value) =>
          setUserInfos({ ...userInfos, firstName: value })
        }
        value={userInfos.firstName}
        style={{ display: isVisible ? "flex" : "none" }}
      />
      <TextInput
        placeholder="Adresse mail"
        autoCapitalize="none"
        onChangeText={(value) => setUserInfos({ ...userInfos, email: value })}
        value={userInfos.email}
      />
      <Text style={[styles.alert, { display: visible ? "flex" : "none" }]}>
        L'adresse mail n'est pas valide
      </Text>
      <TextInput
        placeholder="Mot de passe"
        secureTextEntry={true}
        onChangeText={(value) =>
          setUserInfos({ ...userInfos, password: value })
        }
        value={userInfos.password}
      />
      <TouchableOpacity
        onPress={signUp}
        style={{ display: !isVisible ? "none" : "flex" }}
      >
        <Text>S'inscrire</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={signIn}
        style={{ display: isVisible ? "none" : "flex" }}
      >
        <Text>Se connecter </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
