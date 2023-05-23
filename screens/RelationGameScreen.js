import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
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
  const [responseChoice, setResponseChoice] = useState(null);
  const [parentName, setParentName] = useState(null);

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
    stockParentName();
  }, [members]);

  //create a random member from memberHavePArents at the beginning of the game and only when the user click on "Jouer"
  // ------------------------------------------------------------
  const handlePlay = () => {
    if (memberHaveParents.length >= 5) {
      const firstRandomMember =
        memberHaveParents[Math.floor(Math.random() * memberHaveParents.length)];
      setRandomMember(firstRandomMember);
      return;
    }
    if (memberHaveParents.length < 5) {
      alert(
        "Aucun membre n'a de parents dans votre arbre, veuillez en ajouter"
      );
      navigation.navigate("TabNavigator", { screen: "Arbre" });
      return;
    }
  };
  // stock father first name and mother first name in an array in state
  // ------------------------------------------------------------
  const stockParentName = () => {
    const response = [];
    for (let i = 0; i < memberHaveParents.length; i++) {
      if (memberHaveParents[i].father) {
        const fatherName = members.filter(
          (f) => f.id === memberHaveParents[i].father.id
        );
        response.push(fatherName[0].firstName);
      }
      if (memberHaveParents[i].mother) {
        const motherName = members.filter(
          (m) => m.id === memberHaveParents[i].mother.id
        );
        response.push(motherName[0].firstName);
      }
    }
    setParentName(response);
  };
  //choose randomly 3 name from parentName and the father or mother name of randomMember in an array and stock it in a state
  // ------------------------------------------------------------
  const responseQuiz = () => {
    const possibleResponse = [];
    const randomParentName = parentName[Math.floor(Math.random() * 3)];
    response.push(randomParentName);
    const randomMemberParentName = randomMember.father.firstName;
    response.push(randomMemberParentName);
    setResponseChoice(possibleResponse);
  };
  responseQuiz();

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
