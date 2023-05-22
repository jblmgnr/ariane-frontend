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
import MapView from "react-native-maps";
import { Avatar } from "@react-native-material/core";

import { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function MapGameScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const members = useSelector((state) => state.members.value);

  //usestate
  // ------------------------------------------------------------
  const [tempCoordinates, setTempCoordinates] = useState(null); //coordinates when user press on the map
  const [memberCoordinates, setMemberCoordinates] = useState([]); //coordinates of members with a currentCity
  const [randomMember, setRandomMember] = useState({}); //random member from memberCoordinates at the beginning of the game
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [showMarker, setShowMarker] = useState(false);
  const [showMarkerResult, setShowMarkerResult] = useState([]); //show randomMember marker on the map
  const [result, setResult] = useState(false); //result of the question
  const [count, setCount] = useState({
    goodAnswer: 0,
    badAnswer: 0,
  }); //count number of good answers
  const [modalResult, setModalResult] = useState(false); //show modal result when game is over

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        console.log("status granted");
      }
    })();
  }, []);

  // filter reducers members to get only members with a currentCity
  // ------------------------------------------------------------

  const verifyMembers = () => {
    const memberHaveCurrentCity = members.filter(
      (e) =>
        e.tree === user.tree &&
        e.currentCity !== null &&
        e.currentCity.latitude !== 0 &&
        e.currentCity.longitude !== 0
    );
    memberHaveCurrentCity === []
      ? alert("Aucun membre n'a de ville")
      : setMemberCoordinates(memberHaveCurrentCity);
  };

  //apply verifyMembers when members change
  // ------------------------------------------------------------
  useEffect(() => {
    verifyMembers();
    if (memberCoordinates === []) {
      alert("Aucun membre n'a de ville");
      return;
    }
  }, [members]);

  //create a random member from memberCoordinates at the beginning of the game and only when the user click on "Jouer"
  // ------------------------------------------------------------
  const handlePlay = () => {
    if (memberCoordinates.length > 0) {
      const firstRandomMember =
        memberCoordinates[Math.floor(Math.random() * memberCoordinates.length)];
      setRandomMember(firstRandomMember);
      setShowMarkerResult([firstRandomMember]);
      setIsModalVisible(false);
      return;
    }
    if (memberCoordinates.length === 0) {
      alert(
        "Aucun membre n'a une ville actuelle renseignée, au minimum 5 membres doivent avoi rune ville de renseignée pour jouer. Cliquer sur 'ok' pour être redirigé vers la page d'acceuil."
      );
      navigation.navigate("TabNavigator", { screen: "Arbre" });
      return;
    }
  };

  // console.log("member in reducers", members);
  // console.log("memberCoordinates : ", memberCoordinates);
  // console.log("randomMember : ", randomMember._id);

  //handlePress when user press on the map
  const handlePress = async (e) => {
    const { coordinate } = e.nativeEvent;
    setTempCoordinates(coordinate);
  };

  //compare tempCoordinates and randomMember with a margin of 100km and set result to true or false and showMarker to true when click on "valider ma réponse"
  // ------------------------------------------------------------
  const compareCoordinates = () => {
    if (tempCoordinates === null) {
      alert("Veuillez indiquer une réponse");
      return;
    }
    if (
      tempCoordinates.latitude < randomMember.currentCity.latitude + 1 &&
      tempCoordinates.latitude > randomMember.currentCity.latitude - 1 &&
      tempCoordinates.longitude < randomMember.currentCity.longitude + 1 &&
      tempCoordinates.longitude > randomMember.currentCity.longitude - 1
    ) {
      setShowMarker(true); // show marker on the map
      setResult(true);
      setCount({ ...count, goodAnswer: count.goodAnswer + 1 });
    } else {
      setShowMarker(true); // show marker on the map
      setResult(false);
      setCount({ ...count, badAnswer: count.badAnswer + 1 });
    }
    if (count.goodAnswer + count.badAnswer === 5) {
      setModalResult(true);
      return;
    }
    // Filter memberCoordinates without showMArkerResult and reset randomMember
    const resetRandomMember = memberCoordinates.filter(
      (member) => !showMarkerResult.includes(member)
    );
    setMemberCoordinates(resetRandomMember);

    const newRandomMember =
      resetRandomMember[Math.floor(Math.random() * resetRandomMember.length)];
    setRandomMember(newRandomMember);
    setShowMarkerResult([newRandomMember, ...showMarkerResult]);
  };

  const markerResult = showMarkerResult.slice(1).map((e, i) => {
    return (
      <Marker
        key={i}
        coordinate={{
          latitude: e.currentCity.latitude,
          longitude: e.currentCity.longitude,
        }}
        title={`${e.firstName} ${e.lastName} habite ici`}
      >
        <Avatar image={{ uri: e.photo }} size={40} />
      </Marker>
    );
  });

  // console.log("memberCoordinates length: ", memberCoordinates.length);

  //reset memberCoordinates, showMarkerResult, showMarker, count and modalResult to reset game
  const resetGame = () => {
    handlePlay();
    verifyMembers();
    handlePlay();
    setShowMarker(false);
    setCount({ goodAnswer: 0, badAnswer: 0 });
    setModalResult(false);
  };

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

      <Modal visible={modalResult} transparent={true}>
        <View style={styles.modal}>
          <Text style={styles.textmodal}>
            Vous avez {(count.goodAnswer * 100) / 5} % de bonnes réponses !
          </Text>
          <TouchableOpacity onPress={resetGame} style={styles.buttonmodal}>
            <Text style={styles.textButton}>Rejouer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Inviter")}
            style={styles.buttonmodal}
          >
            <Text style={styles.textButton}>Revenir à l'arbre</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {!isModalVisible && (
        <View style={styles.question}>
          <TouchableOpacity
            onPress={() => navigation.navigate("TabNavigator")}
            style={styles.buttonback}
          >
            <MaterialIcons name="arrow-back" size={30} color="#7C4DFF" />
          </TouchableOpacity>
          <Avatar image={{ uri: randomMember.photo }} size={25} />
          <Text style={styles.questiontext}>
            {" "}
            Où habite {randomMember.firstName} {randomMember.lastName} ?
          </Text>
          <Text style={styles.questiontext}>
            {" "}
            {count.goodAnswer + count.badAnswer + 1 > 5
              ? 5
              : count.goodAnswer + count.badAnswer + 1}{" "}
            / 5
          </Text>
          {showMarker && result === true ? (
            <MaterialIcons name="check-circle" size={25} color="green" />
          ) : (
            showMarker && <MaterialIcons name="cancel" size={25} color="red" />
          )}
        </View>
      )}
      {!isModalVisible && !modalResult && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => compareCoordinates()}
        >
          <Text style={styles.textButton}>
            {count.goodAnswer + count.badAnswer === 5
              ? "Voir le résultat"
              : "Valider ma réponse"}
          </Text>
        </TouchableOpacity>
      )}
      <MapView
        onPress={(e) => handlePress(e)}
        mapType="terrain"
        initialRegion={{
          latitude: 48.856614,
          longitude: 2.3522219,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
        style={styles.map}
      >
        {tempCoordinates && (
          <Marker coordinate={tempCoordinates} title="Ta réponse" />
        )}
        {showMarker && markerResult}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonback: {
    padding: 5,
    margin: 10,
    borderColor: "#7C4DFF",
    borderWidth: 1,
    borderRadius: 5,
  },
  questiontext: {
    fontFamily: "Quicksand",
    fontSize: 18,
    textAlign: "center",
  },
  question: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: Platform.OS === "ios" ? 50 : 40,
    zIndex: 1,
    flexWrap: "wrap",
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    margin: 50,
    padding: 20,
    marginTop: 100,
  },
  textmodal: {
    color: "black",
    fontFamily: "Quicksand",
    fontSize: 18,
    textAlign: "center",
  },
  buttonmodal: {
    backgroundColor: "#7C4DFF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  map: {
    flex: 1,
    zIndex: 0,
  },
  button: {
    backgroundColor: "#7C4DFF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    position: "absolute",
    top: "90%",
    left: "25%",
    padding: 10,
  },
  textButton: {
    color: "white",
    fontFamily: "Quicksand",
    fontSize: 20,
    textAlign: "center",
  },
});
