import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Button } from "@react-native-material/core";
import { fontFamily } from "../modules/deco";
import MembersList from "../components/MembersList";
import { useSelector } from "react-redux";

export default function InviteScreen({ navigation }) {
  // Reducers
  const user = useSelector((state) => state.user.value);
  const members = useSelector((state) => state.members.value);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollview}>
        <Text>Invite Screen</Text>
        <Button
          onPress={() => {
            navigation.navigate("CreateMember");
          }}
          title="Ajoute un membre"
          uppercase={false}
          style={styles.button}
          titleStyle={{ fontFamily: fontFamily }}
        />

        <Text>Current tree: {user.tree}</Text>
        <Text>Member count : {members.length}</Text>
        <MembersList navigation={navigation} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollview: {
    width: "100%",
    felx: 1,
  },

  container: {
    flex: 1,
    height: 1000,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    marginTop: 50,
  },
});
