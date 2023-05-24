import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { Button } from "@react-native-material/core";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Clipboard from "expo-clipboard";

export default function UsersParametersScreen() {
  const user = useSelector((state) => state.user.value);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(
      "Hello, je t'invite à télécharger Ariane pour rejoindre mon arbre généalogique. Lors de l'inscription, renseigne ce code : " +
        user.tree
    );
  };
  return (
    <View style={styles.container}>
      <Text style={{ fontFamily: "Quicksand", color: "white" }}>
        Invite tes proches à rejoindre ton arbre généalogique !
      </Text>
      <Text style={{ fontFamily: "Quicksand", color: "white" }}>
        Voici le message qui sera envoyé, tu peux évidemment le personnaliser :
      </Text>
      <Text style={{ fontFamily: "Quicksand", color: "white" }}>
        Hello, je t'invite à télécharger Ariane pour rejoindre mon arbre
        généalogique. Lors de l'inscription, renseigne ce code : {user.tree}
      </Text>
      <Button
        onPress={copyToClipboard}
        title="Copie l'invitation dans le presse-papier"
        uppercase={false}
        style={styles.button}
        titleStyle={{ fontFamily: "Quicksand" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#363B44",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    padding: 5,
    marginBottom: 10,
  },
  backgroundImage: {
    position: "absolute",
    flex: 1,
    resizeMode: "cover", // or 'stretch'
    zIndex: -1,
    opacity: 0.2,
    transform: [{ scale: 1.5 }],
  },
});
