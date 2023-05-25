import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Platform,
  Image,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import { Avatar } from "@react-native-material/core";
import { useTree } from "../hooks/useTree";

export default function RelationGameScreen({ navigation }) {
  // Reducers
  const members = useSelector((state) => state.members.value);
  const { memberOfId } = useTree();

  //state
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [modalResult, setModalResult] = useState(false);
  const [randomMember, setRandomMember] = useState({});
  const [memberFather, setMemberFather] = useState([]);
  const [randomFather, setRandomFather] = useState([]);
  const [responsechoosen, setResponsechoosen] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [showresult, setShowresult] = useState(false);
  const [shuffledName, setShuffledName] = useState([]);
  const [score, setScore] = useState({
    good: 0,
    bad: 0,
  });

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

  // call generateRandomFatherIDs when randomMember change
  useEffect(() => {
    if (randomMember && randomMember.father) {
      const newRandomFatherIDs = generateRandomFatherIDs();
      setRandomFather([randomMember.father, ...newRandomFatherIDs]);
    }
  }, [randomMember]);

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

  const shuffledFatherName = () => {
    const shuffle = shuffleArray(fatherName);
    setShuffledName(shuffle);
  };

  //apply shuffledFatherName when randomFather change
  useEffect(() => {
    shuffledFatherName();
  }, [randomFather]);

  //display the names of 4 fathers and one of them should be randomMember's father
  const responseQuiz = shuffledName.map((name, i) => {
    const choose = () => {
      setResponsechoosen(name);
    };

    const styles = StyleSheet.create({
      buttonresponse: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#7C4DFF",
        alignItems: "center",
        justifyContent: "space-evenly",
        textAlign: "center",
        aspectRatio: 3,
        margin: 10,
        width: 150,
      },
      text: {
        fontSize: 16,
        textAlign: "center",
        fontFamily: "Quicksand",
      },
    });

    return (
      <View style={styles.questioncontainer} key={i}>
        <TouchableOpacity
          style={[
            styles.buttonresponse,
            { backgroundColor: responsechoosen === name ? "#7C4DFF" : "white" },
          ]}
          onPress={choose}
        >
          <Text key={i} style={styles.text}>
            {name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  });

  const handlePlay = () => {
    const firstRandomMember =
      memberFather[Math.floor(Math.random() * memberFather.length)];
    setRandomMember(firstRandomMember);
    const newRandomFatherIDs = generateRandomFatherIDs();
    setRandomFather([firstRandomMember.father, ...newRandomFatherIDs]);
    setIsModalVisible(false);
    return;
  };

  const handleResult = () => {
    setModalResult(true);
    return;
  };

  const ValidateChoice = () => {
    if (responsechoosen === memberOfId(randomMember.father).firstName) {
      setScore({ ...score, good: score.good + 1 });
      setIsCorrect(true);
    } else {
      setScore({ ...score, bad: score.bad + 1 });
      setIsCorrect(false);
    }

    setShowresult(true);
    //filter memberFather to get only members who hasn't been in randomMember
    const newMemberFather = memberFather.filter((e) => e !== randomMember);
    setMemberFather(newMemberFather);
  };

  const nextQuestion = () => {
    const firstRandomMember =
      memberFather[Math.floor(Math.random() * memberFather.length)];
    setRandomMember(firstRandomMember);
    const newRandomFatherIDs = generateRandomFatherIDs();
    setRandomFather([firstRandomMember.father, ...newRandomFatherIDs]);
    setResponsechoosen("");
    setShowresult(false);
  };

  const handlePlayAgain = () => {
    setScore({
      good: 0,
      bad: 0,
    });
    setMemberFather(members);
    setModalResult(false);
    setResponsechoosen("");
    setShowresult(false);
    setIsCorrect(false);
    setShuffledName([]);
    setIsModalVisible(true);
  };

  // console.log("randomMember father", randomMember.father);
  // console.log("randomFatherName", randomFather);
  // console.log("responsechoosen", responsechoosen);
  // console.log("isCorrect", isCorrect);

  console.log("score", score);
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
          <TouchableOpacity
            onPress={handlePlay}
            style={styles.buttonmodalfirst}
          >
            <Text style={styles.textButton}>Jouer</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={modalResult} transparent={true}>
        <View style={styles.modal}>
          <Text style={styles.textmodal}>
            Vous avez {(score.good * 100) / 5} % de bonnes réponses !
          </Text>
          <TouchableOpacity
            onPress={handlePlayAgain}
            style={styles.buttonmodal}
          >
            <Text style={styles.textButton}>Rejouer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Arbre")}
            style={styles.buttonmodal}
          >
            <Text style={styles.textButton}>Revenir à l'arbre</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Image
        source={require("../assets/logo.png")}
        style={styles.backgroundImage}
      />
      <Text style={styles.title}>Qui est mon père ?</Text>
      <Text style={[styles.text, { color: "white" }]}>
        {score.good + score.bad < 5 ? score.good + score.bad + 1 : 5} / 5
      </Text>
      <Avatar image={{ uri: randomMember.photo }} size={200} />
      <Text
        style={[
          styles.text,
          {
            backgroundColor: "white",
            padding: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#7C4DFF",
          },
        ]}
      >
        Je suis {randomMember.firstName}, mais qui est mon père ?
      </Text>
      <View style={styles.response}>{responseQuiz}</View>
      {isCorrect && showresult ? (
        <Text style={[styles.text, { color: "white" }]}>Bonne réponse !</Text>
      ) : (
        ""
      )}
      {!isCorrect && showresult ? (
        <Text style={[styles.text, { color: "white" }]}>
          Mauvaise réponse !
        </Text>
      ) : (
        ""
      )}
      <View style={styles.validatebuttoncontainer}>
        {score.good + score.bad < 5 ? (
          <>
            <TouchableOpacity
              onPress={ValidateChoice}
              style={styles.validatebutton}
            >
              <Text style={styles.textbutton}>Valider</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={nextQuestion}
              style={styles.validatebutton}
            >
              <Text style={styles.textbutton}>Suivant</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={handleResult} style={styles.resultbutton}>
            <Text style={styles.textbutton}>Résultat</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonmodalfirst: {
    backgroundColor: "#7C4DFF",
    borderColor: "white",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    alignItems: "center",
    aspectRatio: 10 / 7,
    justifyContent: "center",
    marginBottom: 20,
  },
  textbutton: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Quicksand",
    color: "white",
  },
  backgroundImage: {
    position: "absolute",
    flex: 1,
    resizeMode: "cover", // or 'stretch'
    zIndex: -1,
    transform: [{ scale: 1 }],
    height: "100%",
  },
  textmodal: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Quicksand",
  },
  resultbutton: {
    backgroundColor: "#7C4DFF",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    alignItems: "center",
    aspectRatio: 10 / 7,
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Quicksand",
  },
  validatebutton: {
    backgroundColor: "#7C4DFF",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "white",
    alignItems: "center",
    aspectRatio: 10 / 7,
  },
  validatebuttoncontainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginRight: 20,
    marginLeft: 20,
  },
  modal: {
    backgroundColor: "white",
    margin: 50,
    padding: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    borderColor: "#7C4DFF",
  },
  buttonmodal: {
    backgroundColor: "#7C4DFF",
    borderColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 10 / 2,
  },
  textButton: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Quicksand",
    color: "white",
  },

  title: {
    fontSize: 20,
    fontFamily: "Quicksand",
    marginTop: Platform.OS === "android" ? 30 : 0,
    color: "white",
  },

  container: {
    flex: 1,
    backgroundColor: "#363B44",
    alignItems: "center",
    justifyContent: "space-around",
  },
  questioncontainer: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  response: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
});
