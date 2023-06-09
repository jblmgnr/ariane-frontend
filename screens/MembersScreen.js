import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import { Button } from "@react-native-material/core";
import MembersList from "../components/MembersList";
import { useSelector } from "react-redux";

export default function InviteScreen({ navigation }) {
  // Reducers
  const members = useSelector((state) => state.members.value);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollview}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.backgroundImage}
        />
        <Button
          onPress={() => {
            navigation.navigate("CreateMember", { create: true });
          }}
          title="Ajoute un membre"
          uppercase={false}
          style={styles.button}
          titleStyle={{ fontFamily: "Quicksand", fontSize: 16 }}
        />
        <Text
          style={{
            fontFamily: "Quicksand",
            color: "white",
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          Personnes présentes dans l'arbre : {members.length}
        </Text>
        <MembersList navigation={navigation} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollview: {
    width: "100%",
    flex: 1,
    marginTop: Platform.OS === "IOS" ? 30 : 50,
  },

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
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
  },
  backgroundImage: {
    position: "absolute",
    flex: 1,
    resizeMode: "cover",
    zIndex: -1,
    opacity: 0.5,
    transform: [{ scale: 1.5 }],
  },
});
