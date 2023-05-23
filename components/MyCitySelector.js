import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput } from "@react-native-material/core";
import { fontFamily } from "../modules/deco";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function MyCitySelector({
  label,
  defaultValue,
  setValueCallback,
}) {
  const [cityName, setCityName] = useState(defaultValue);
  const [city, setCity] = useState({});

  let c = 0;
  // Check city
  const checkCity = async () => {
    console.log("CHECK CITY");

    if (cityName.length === 0)
      // City is not mandatory
      return;

    if (cityName.length < 3) {
      alert("La ville doit contenir au moins 3 caracteres");
      return;
    }

    console.log(c++, "Test city : ", cityName);
    const response = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${cityName}&limit=1`
    );
    const data = await response.json();
    if (data.features && data.features.length === 0) {
      alert(`${label} inconnue, veuillez vérifier l'orthographe`);
      return;
    }

    console.log(
      c++,
      " L'API propose cette ville ",
      data.features[0].properties.city
    );

    const cityNameFound = data.features[0].properties.city;
    const newCity = {
      name: data.features[0].properties.city,
      latitude: data.features[0].geometry.coordinates[1],
      longitude: data.features[0].geometry.coordinates[0],
    };

    setCityName(cityNameFound);
    setCity(newCity);

    setValueCallback(newCity);
  };

  return (
    <View style={styles.container}>
      <TextInput
        label={label}
        variant="outlined"
        onChangeText={(value) => setCityName(value)}
        value={cityName}
        style={styles.input}
        editable={true}
      />
      <FontAwesome
        style={styles.genderIcon}
        name="check"
        size={35}
        onPress={() => {
          checkCity();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    width: "90%",
    fontFamily: fontFamily,
    marginBottom: 5,
    marginTop: 5,
  },
});
