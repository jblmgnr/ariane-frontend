import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Image,
  ScrollView,
  useWindowDimensions,
  SafeAreaView,
  Platform,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../reducers/user";
import { Button, TextInput, Avatar } from "@react-native-material/core";
import { useFonts } from "expo-font";
import { fontFamily } from "../modules/deco";

function MemberPRofile(props) {
  const {
    lastName,
    firstName,
    nickName,
    birthDate,
    phoneNumber,
    currentCity,
    birthCity,
    job,
    hobbies,
    story,
    photo,
    relationShip,
    gender,
    navigation,
  } = props;

  const onPress = () => {
    navigation.navigate("TabNavigator");
  };

  return (
    <View>
      <Avatar image={{ uri: "https://mui.com/static/images/avatar/1.jpg" }} />
      <Text>Member Profile</Text>
      <Text>First Name : {firstName}</Text>
      <Text>Last Name : {lastName}</Text>
      <Text>Nick Name : {nickName}</Text>
      <Text>Birth Date : {birthDate}</Text>
      <Text>Phone Number : {phoneNumber}</Text>
      <Text>Current City : {currentCity}</Text>
      <Text>Birth City : {birthCity}</Text>
      <Text>Job : {job}</Text>
      <Text>Hobbies : {hobbies}</Text>
      <Text>Story : {story}</Text>
      <Text>Photo : {photo}</Text>
      <Text>RelationShip : {relationShip}</Text>
      <button onPress={onPress}>Go to Home</button>
    </View>
  );
}

export default MemberPRofile;
