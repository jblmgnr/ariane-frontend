import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { useSelector } from "react-redux";

export default function GameScreen({ navigation }) {
  const members = useSelector((state) => state.members.value);

  const verifyBeforeGoGameMap = () => {
    const memberHaveCurrentCity = members.filter(
      (e) =>
        e.currentCity !== "" &&
        e.currentCity.latitude !== 0 &&
        e.currentCity.longitude !== 0
    );
    if (memberHaveCurrentCity.length > 5) {
      navigation.navigate("MapGame");
      return;
    }
    if (memberHaveCurrentCity.length < 5) {
      alert(
        "Trop peu de membres ont une ville de résidence, il en faut plus de 5 ! Complète tes membres ou rajoutes-en !"
      );
      navigation.navigate("TabNavigator", { screen: "Arbre" });
      return;
    }
  };

  const VerifyBeforeGoRelationGame = () => {
    const fatherIDs = members.reduce((acc, member) => {
      if (member.father !== null && !acc.includes(member.father)) {
        acc.push(member.father);
      }
      return acc;
    }, []);

    if (fatherIDs.length > 5) {
      navigation.navigate("RelationGame");
      return;
    }
    if (fatherIDs.length < 5) {
      alert(
        "Trop peu de membres ont des parents, il en faut plus de 5 ! Complète tes membres ou rajoutes-en !"
      );
      navigation.navigate("TabNavigator", { screen: "Arbre" });
      return;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connais-tu ta famille ?</Text>
      <Image
        source={require("../assets/logo.png")}
        style={styles.backgroundImage}
      />
      <TouchableOpacity
        onPress={verifyBeforeGoGameMap}
        style={styles.gamebutton}
      >
        <Text style={styles.text}>Il habite où celui là ?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={VerifyBeforeGoRelationGame}
        style={styles.gamebutton}
      >
        <Text style={styles.text}>Je suis ton père</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.gamebutton}>
        <Text style={styles.text}>Kifékoi dans la vie ?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.gamebutton}>
        <Text style={styles.text}>T'as quel âge ?</Text>
      </TouchableOpacity>
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
  },
  title: {
    fontSize: 30,
    fontFamily: "Quicksand",
    textAlign: "center",
    margin: 20,
    marginBottom: 100,
    color: "white",
    position: "absolute",
    top: 150,
  },

  gamebutton: {
    borderRadius: 10,
    padding: 10,
    margin: 10,
    width: 300,
    alignItems: "center",
    backgroundColor: "#7C4DFF",
    opacity: 0.9,
  },
  text: {
    fontSize: 20,
    fontFamily: "Quicksand",
    textAlign: "center",
    color: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "#363B44",
    alignItems: "center",
    justifyContent: "center",
  },
});
