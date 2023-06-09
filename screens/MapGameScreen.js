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
import { Avatar, Button } from "@react-native-material/core";

import { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function MapGameScreen({ navigation }) {
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
        e.currentCity !== "" &&
        e.currentCity.latitude !== 0 &&
        e.currentCity.longitude !== 0
    );
    setMemberCoordinates(memberHaveCurrentCity);
  };

  //apply verifyMembers when members change
  // ------------------------------------------------------------
  useEffect(() => {
    verifyMembers();
  }, [members]);

  //create a random member from memberCoordinates at the beginning of the game and only when the user click on "Jouer"
  // ------------------------------------------------------------
  const handlePlay = () => {
    const firstRandomMember =
      memberCoordinates[Math.floor(Math.random() * memberCoordinates.length)];
    setRandomMember(firstRandomMember);
    setShowMarkerResult([firstRandomMember]);
    setIsModalVisible(false);
    return;
  };

  //set coordinates when user press on the map

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
    if (showMarkerResult.length === 6) {
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

  const MarkerResult = () => {
    if (showMarkerResult.length === 1 || showMarkerResult === 0) {
      return showMarkerResult.map((e, i) => {
        // Appliquer une marge de décalage pour éviter les superpositions
        const offset = i * 0.1;
        const adjustedLatitude = e.currentCity.latitude + offset;
        const adjustedLongitude = e.currentCity.longitude + offset;
        return (
          <Marker
            key={i}
            coordinate={{
              latitude: adjustedLatitude,
              longitude: adjustedLongitude,
            }}
            title={`${e.firstName} ${e.lastName} habite ici`}
          >
            <Avatar image={{ uri: e.photo }} size={40} />
          </Marker>
        );
      });
    }
    if (showMarkerResult.length > 0) {
      return showMarkerResult.slice(1).map((e, i) => {
        // Appliquer une marge de décalage pour éviter les superpositions
        const offset = i * 0.01;
        const adjustedLatitude = e.currentCity.latitude + offset;
        const adjustedLongitude = e.currentCity.longitude + offset;
        return (
          <Marker
            key={i}
            coordinate={{
              latitude: adjustedLatitude,
              longitude: adjustedLongitude,
            }}
            title={`${e.firstName} ${e.lastName} habite ici`}
          >
            <Avatar image={{ uri: e.photo }} size={40} />
          </Marker>
        );
      });
    }
  };

  //reset memberCoordinates, showMarkerResult, showMarker, count and modalResult to reset game
  const resetGame = () => {
    verifyMembers();
    setShowMarkerResult([]);
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
            onPress={() => navigation.navigate("Arbre")}
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
            <Text style={styles.textreturn}>Retour</Text>
          </TouchableOpacity>
          {showMarkerResult.length < 6 ? (
            <>
              <Avatar image={{ uri: randomMember.photo }} size={25} />
              <Text style={styles.questiontext}>
                {" "}
                Où habite {randomMember.firstName} {randomMember.lastName} ?
              </Text>
            </>
          ) : (
            ""
          )}
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
        <View style={styles.validatebutton}>
          <Button
            title={
              showMarkerResult.length === 6
                ? "Voir le résultat"
                : "Valider ma réponse"
            }
            size="large"
            onPress={() => compareCoordinates()}
            titleStyle={{ fontFamily: "Quicksand", fontSize: 16 }}
          />
        </View>
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
        {showMarker && <MarkerResult />}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  textreturn: {
    fontFamily: "Quicksand",
    fontSize: 18,
    textAlign: "center",
    color: "#ffffff",
  },

  buttonback: {
    padding: 5,
    margin: 10,
    backgroundColor: "#7C4DFF",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
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
    padding: 5,
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
  validatebutton: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 1,
    bottom: "5%",
    left: 0,
    right: 0,
    padding: 10,
  },
  button: {
    backgroundColor: "#7C4DFF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  textButton: {
    color: "white",
    fontFamily: "Quicksand",
    fontSize: 20,
    textAlign: "center",
  },
});
