import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import { Avatar } from "@react-native-material/core";

export default function RelationGameScreen({ navigation }) {
  // Reducers
  const user = useSelector((state) => state.user.value);
  const members = useSelector((state) => state.members.value);

  // State
  const [randomMember, setRandomMember] = useState(null);
  const [memberHaveParents, setMemberHaveParents] = useState(null);

  // filter members to get only the ones who have father or mother
  const verifyMembers = () => {
    const verifyMemberParent = members.filter(
      (member) => member.father || member.mother
    );
    setMemberHaveParents(verifyMemberParent);
  };

  //apply verifyMembers when members change
  useEffect(() => {
    verifyMembers();
  }, [members]);

  //create a random member from memberHavePArents at the beginning of the game and only when the user click on "Jouer"
  // ------------------------------------------------------------
  const handlePlay = () => {
    if (memberHaveParents.length > 0) {
      const firstRandomMember =
        memberHaveParents[Math.floor(Math.random() * memberHaveParents.length)];
      setRandomMember(firstRandomMember);
      return;
    }
    if (memberHaveParents.length === 0) {
      alert(
        "Aucun membre n'a de parents dans votre arbre, veuillez en ajouter"
      );
      navigation.navigate("TabNavigator", { screen: "Arbre" });
      return;
    }
  };

  return (
    <View style={styles.container}>
      <Text>Relation Game Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});
