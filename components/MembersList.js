import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Avatar } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { removeMember } from "../reducers/members";
import * as Font from "expo-font";
import { useFonts } from "expo-font";
import React, { useEffect } from "react";
import { useTree } from "../hooks/useTree";

const { getFetchAPI } = require("../modules/util");

const FETCH_API = getFetchAPI();

const MembersList = ({ navigation }) => {
  const members = useSelector((state) => state.members.value);
  const dispatch = useDispatch();
  const { isRoot, partnerOf } = useTree();

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
        opacity: 0.8,
      },
      avatar: {
        marginRight: 10,
      },
      text: {
        flex: 1,
        flexDirection: "column",
      },
      names: {
        flex: 1,
        flexDirection: "row",
      },
      firstName: {
        fontFamily: "Quicksand",
        fontWeight: 400,
      },
      lastName: {
        fontFamily: "Quicksand",
        fontWeight: 900,
      },
      nickName: {
        fontFamily: "Quicksand",
      },
      subtitle: {
        fontFamily: "QuicksandBold",
      },
      deleteContainer: {
        marginLeft: "auto",
      },
    });

    const doDelete = async () => {
      const response = await fetch(FETCH_API + `/members/${member._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!data.result) {
        alert("Impossible to delete member");
        return;
      }

      dispatch(removeMember(member));
    };

    const handleDelete = async (member) => {
      Alert.alert(
        "Suppression d'un membre",
        `Confirmez vous la suppression de ${member.firstName} ${member.lastName} ?`,
        [
          { text: "Oui, avec plaisir", onPress: () => doDelete() },
          { text: "Non, surtout pas !", onPress: () => {} },
        ],
        { cancelable: false }
      );
    };

    const handleLongPress = () => {
      console.log("isRoot : ", isRoot(member));
      console.log(partnerOf(member, true));
    };

    return (
      <View key={i} style={styles.container}>
        <View>
          <TouchableOpacity
            style={styles.member}
            onPress={() => {
              navigation.navigate("MemberProfile", { member });
            }}
            onLongPress={handleLongPress}
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
            <View style={styles.text}>
              <View style={styles.names}>
                <Text style={styles.firstName}>{member.firstName} </Text>
                <Text style={styles.lastName}>{member.lastName}</Text>
              </View>
              {member.nickName && (
                <Text style={styles.nickName}>{member.nickName}</Text>
              )}
            </View>

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
      </View>
    );
  });

  return <>{membersList}</>;
};

export default MembersList;
