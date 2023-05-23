import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { useSelector } from "react-redux";

export default function GameScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const members = useSelector((state) => state.members.value);

  const verifyBeforeGoGameMap = () => {
    const memberHaveCurrentCity = members.some(
      // check if CurrentCity doesn't exist or is an empty string for any member
      (member) => !member.currentCity || member.currentCity === ""
    );
    // console.log("memberHaveCurrentCity", memberHaveCurrentCity);
    // console.log("members", members);
    if (memberHaveCurrentCity) {
      alert(
        "Vos membres n'ont pas de ville de résidence, vous ne pouvez pas jouer ohlalala"
      );
    } else {
      navigation.navigate("MapGame");
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
        onPress={() => navigation.navigate("RelationGame")}
        style={styles.gamebutton}
      >
        <Text style={styles.text}>Qui sont ses parents ?</Text>
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
