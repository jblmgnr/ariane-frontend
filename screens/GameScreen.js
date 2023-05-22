import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";

export default function GameScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connais-tu ta famille ?</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("MapGame")}
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
  title: {
    fontSize: 30,
    fontFamily: "Quicksand",
    textAlign: "center",
    margin: 20,
    marginBottom: 100,
  },

  gamebutton: {
    borderRadius: 10,
    padding: 10,
    margin: 10,
    width: 300,
    alignItems: "center",
    borderColor: "#7C4DFF",
    borderWidth: 2,
  },
  text: {
    fontSize: 20,
    fontFamily: "Quicksand",
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
});
