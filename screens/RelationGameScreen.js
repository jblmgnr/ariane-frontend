import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import { Avatar } from "@react-native-material/core";
import { useTree } from "../hooks/useTree";

export default function RelationGameScreen({ navigation }) {
  // Reducers
  const user = useSelector((state) => state.user.value);
  const members = useSelector((state) => state.members.value);
  const { partnerOf, fatherOf, buildReps, memberOfId } = useTree();

  //state
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [randomMember, setRandomMember] = useState({});
  const [memberFather, setMemberFather] = useState([]);
  const [randomFather, setRandomFather] = useState([]);

  // filter reducers members to get only members with a currentCity
  // ------------------------------------------------------------

  const verifyMembers = () => {
    const memberHaveFather = members.filter(
      (e) => e.father !== "" && e.father !== null
    );
    setMemberFather(memberHaveFather);
  };

  //apply verifyMembers when members change
  // ------------------------------------------------------------
  useEffect(() => {
    verifyMembers();
  }, [members]);

  //calculate the number of father who are different from reducers members by Ids and extract their names
  const fatherIDs = members.reduce((acc, member) => {
    if (member.father !== null && !acc.includes(member.father)) {
      acc.push(member.father);
    }
    return acc;
  }, []);

  //randomly select 3 fatherIds from const fatherIDs, exclude the father of randomMember
  const generateRandomFatherIDs = () => {
    const newRandomFatherIDs = [];
    while (newRandomFatherIDs.length < 3) {
      const randomFatherId =
        fatherIDs[Math.floor(Math.random() * fatherIDs.length)];
      if (
        !newRandomFatherIDs.includes(randomFatherId) &&
        randomFatherId !== randomMember.father
      ) {
        newRandomFatherIDs.push(randomFatherId);
      }
    }
    return newRandomFatherIDs;
  };

  //extract name from fatherIDs
  const fatherName = randomFather.map((e) => {
    const member = memberOfId(e);
    return member.firstName;
  });

  //shuffle the array of fatherName
  const shuffleArray = (array) => {
    const newArray = [...array];

    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    return newArray;
  };

  const shuffledFatherName = shuffleArray(fatherName);

  const randomFatherName = fatherName.filter((e) => e !== randomMember.father);
  //display the names of 4 fathers and one of them should be randomMember's father
  const responseQuiz = shuffledFatherName.map((name, i) => {
    return <Text key={i}>{name}</Text>;
  });

  const handlePlay = () => {
    const firstRandomMember =
      memberFather[Math.floor(Math.random() * memberFather.length)];
    setRandomMember(firstRandomMember);
    const newRandomFatherIDs = generateRandomFatherIDs();
    setRandomFather(newRandomFatherIDs);
    // setShowMarkerResult([firstRandomMember]);
    setIsModalVisible(false);
    return;
  };

  const initialRandom = () => {
    const firstRandomMember =
      memberFather[Math.floor(Math.random() * memberFather.length)];
    setRandomMember(firstRandomMember);
  };

  const fatherID = () => {
    const newRandomFatherIDs = generateRandomFatherIDs();
    setRandomFather([randomMember.father, ...newRandomFatherIDs]);
  };
  console.log("randomMember father", randomMember.father);
  console.log("randomFatherName", randomFather);

  return (
    <View style={styles.container}>
      <Modal visible={isModalVisible} transparent={true}>
        <View style={styles.modal}>
          <Text style={styles.textmodal}>
            Il est temps de jouer ! 5 questions vous seront posées sur la ville
            d'un membre de votre arbre. Cliquez sur la carte pour indiquer votre
            réponse puis sur "valider ma réponse". A la fin des 5 questions,
            vous verrez votre score !
          </Text>
          <TouchableOpacity onPress={handlePlay} style={styles.buttonmodal}>
            <Text style={styles.textmodal}>Jouer</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {responseQuiz}
      <Text onPress={initialRandom}>valider la réponse</Text>
      <Text onPress={fatherID}>suivant</Text>
      <Text>
        REPONSE {randomMember.firstName} {randomMember.father}
      </Text>
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
