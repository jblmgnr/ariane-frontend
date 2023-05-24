import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Avatar } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { removeMember } from "../reducers/members";
import * as Font from "expo-font";
import { useFonts } from "expo-font";
import React, { useEffect } from "react";

const { getFetchAPI } = require("../modules/util");

const FETCH_API = getFetchAPI();

const MembersList = ({ navigation }) => {
  const members = useSelector((state) => state.members.value);
  const dispatch = useDispatch();
  // load font family Quicksand Bold useFont expo-font
  // ------------------------------------------------------------
  const [loaded] = useFonts({
    QuicksandBold: require("../assets/fonts/Quicksand-Bold.ttf"),
  });

  if (!loaded) {
    return null;
  }
  const membersList = members.map((member, i) => {
    const styles = StyleSheet.create({
      member: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 10,
        margin: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#7C4DFF",
        flexWrap: "wrap",
        opacity: 0.6,
      },
      avatar: {
        marginRight: 10,
      },
      text: {
        fontFamily: "Quicksand",
      },
      subtitle: {
        fontFamily: "QuicksandBold",
      },
      deleteContainer: {
        marginLeft: "auto",
      },
    });

    const handleDelete = async (member) => {
      const response = await fetch(FETCH_API + `/members/${member._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      console.log("DDDDDDDDDDDDDDDDDDDDDDDDD", data);
      if (!data.result) {
        console.log("IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
        return;
      }

      console.log("Before to dispath to reducer !!!!");
      console.log("member : ", member);

      console.log("removeMemeber function : ", removeMember);
      dispatch(removeMember(member));

      // // This will update the redux store after successful deletion.
      // dispatch(deleteMember(id));
    };

    return (
      <View key={i} style={styles.container}>
        <TouchableOpacity
          style={styles.member}
          onPress={() => {
            navigation.navigate("MemberProfile", { member });
          }}
        >
          {member.photo ? (
            <Avatar
              style={styles.avatar}
              image={{ uri: member.photo }}
              size={30}
              color="black"
            />
          ) : (
            <Avatar
              style={styles.avatar}
              icon={(props) => <Icon name="account" {...props} />}
              color="black"
              size={30}
            />
          )}
          <Text style={styles.subtitle}>- Prénom :</Text>
          <Text style={styles.text}> {member.firstName} - </Text>

          <Text style={styles.subtitle}>Nom : </Text>
          <Text style={styles.text}> {member.lastName} - </Text>

          {member.nickName && (
            <>
              <Text style={styles.subtitle}>Surnom :</Text>
              <Text style={styles.text}> {member.nickName}</Text>
            </>
          )}
          <View style={styles.deleteContainer}>
            <TouchableOpacity
              onPress={() => {
                console.log("memeber to delete : ", member);
                handleDelete(member);
              }}
              style={styles.deleteButton}
            >
              <Icon name="delete" size={30} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  });

  return <>{membersList}</>;
};

export default MembersList;
