import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../reducers/user";
import MapView from "react-native-maps";

import { Marker } from "react-native-maps";
import * as Location from "expo-location";
const { getFetchAPI, showObject, showObjects } = require("../modules/util");

export default function GameScreen() {
  const FETCH_API = getFetchAPI();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const members = useSelector((state) => state.members.value);

  //usestate
  // ------------------------------------------------------------
  const [currentPosition, setCurrentPosition] = useState(null);
  const [tempCoordinates, setTempCoordinates] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        Location.watchPositionAsync({ distanceInterval: 1000 }, (location) => {
          setCurrentPosition(location.coords);
        });
      }
    })();
  }, []);

  const handleLongPress = (e) => {
    setTempCoordinates(e.nativeEvent.coordinate);
    console.log("coordonnées", tempCoordinates.longitude);
  };

  const verifyCoordinates = () => {
    fetch(FETCH_API + "/members/")
      .then((response) => response.json())
      .then((userMember) => {
        const member = userMember.members.filter((e) => e.tree === user.tree);
        console.log("member", member);
      });
  };
  verifyCoordinates();

  return (
    <View style={styles.container}>
      <Text>Game Screen</Text>

      <MapView
        onLongPress={(e) => handleLongPress(e)}
        mapType="terrain"
        initialRegion={{
          latitude: 48.856614,
          longitude: 2.3522219,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
        style={styles.map}
      ></MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: 150,
    borderBottomColor: "#ec6e5b",
    borderBottomWidth: 1,
    fontSize: 16,
  },
  button: {
    width: 150,
    alignItems: "center",
    marginTop: 20,
    paddingTop: 8,
    backgroundColor: "#ec6e5b",
    borderRadius: 10,
  },
  textButton: {
    color: "#ffffff",
    height: 24,
    fontWeight: "600",
    fontSize: 15,
  },
});
