import { StyleSheet, Text, View, Image } from "react-native";
import { Button } from "@react-native-material/core";
import { useSelector } from "react-redux";
import * as Clipboard from "expo-clipboard";

export default function UsersParametersScreen() {
  const user = useSelector((state) => state.user.value);
  const text =
    "Hello, je t'invite à télécharger Ariane pour rejoindre mon arbre généalogique. Lors de l'inscription, renseigne ce code : ";

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(text + user.tree);
  };
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={styles.backgroundImage}
      />
      <Text style={styles.headerText}>
        Invite tes proches à rejoindre ton arbre généalogique !
      </Text>
      <View style={styles.centeredContainer}>
        <Text style={styles.bodyText}>
          Voici le message qui sera envoyé, tu peux évidemment le personnaliser
          :
        </Text>
        <Text style={[styles.inviteText, styles.spacing]}>
          {text} {user.tree}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          onPress={copyToClipboard}
          title="Copie l'invitation dans le presse-papier"
          uppercase={false}
          style={styles.button}
          titleStyle={{ fontFamily: "Quicksand" }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#363B44",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    width: "100%",
  },
  headerText: {
    marginTop: Platform.OS === "ios" ? 50 : 30,
    marginBottom: 30,
    fontFamily: "Quicksand",
    color: "white",
    fontSize: 24,
    textAlign: "center",
  },
  bodyText: {
    fontFamily: "Quicksand",
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  inviteText: {
    fontFamily: "Quicksand",
    color: "white",
    fontSize: 16,
    textAlign: "center",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  spacing: {
    marginTop: 30,
  },
  button: {
    padding: 5,
    marginBottom: 10,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  backgroundImage: {
    position: "absolute",
    flex: 1,
    resizeMode: "cover",
    zIndex: -1,
    opacity: 0.2,
    transform: [{ scale: 1.5 }],
  },
});
