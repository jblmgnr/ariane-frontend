import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import MyPopup from "../components/MyPopup";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTreeId } from "../reducers/user";
import { Button, TextInput } from "@react-native-material/core";
import { fontFamily } from "../modules/deco";
// import { readMembersFromDataBase } from "../modules/db";
import members, { setMembers } from "../reducers/members";
import Tree from "../components/Tree";
import ImageItem from "../components/ImageItem";
const { getFetchAPI } = require("../modules/util");
import MembersList from "../components/MembersList";
import { showObject } from "../modules/util";

const FETCH_API = getFetchAPI();

// Home Page Screen
//======================================================
export default function HomePageScreen({ navigation }) {
  const dispatch = useDispatch();

  const [popup, setPopup] = useState("");

  // Reducers
  const user = useSelector((state) => state.user.value);
  const members = useSelector((state) => state.members.value);

  useEffect(() => {
    (async () => {
      // If no tree exists, create the first default tree
      console.log("user in reduceer : ", user);
      if (!user.tree) {
        console.log("Create the default tree !!!!!");
        const response = await fetch(FETCH_API + "/trees", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Defaut by " + user.firstName,
            userId: user.id,
          }),
        });

        const data = await response.json();
        if (!data.result) {
          alert(data.error);
          return;
        }

        console.log("Result of POST query /tree ");
        showObject(data);
        console.log("Tree saved in DB with id ", data.tree._id);
        dispatch(setTreeId(data.tree._id));
      }

      // Here we are sure than the tree id has been set in user reducer.
      //----------------------------------------------------------------
      console.log("================ > get member list fro tree ", user.tree);
      // readMembersFromDataBase();
      // TODO: Did move the following block in the function
      // If a tree already exists load it ...
      fetch(FETCH_API + "/members/byTree/" + user.tree)
        .then((response) => response.json())
        .then((data) => {
          if (!data.result) {
            alert(data.error);
            return;
          }

          console.log("Find ", data.members.length, " members in DB");

          dispatch(setMembers(data.members));
        });
      // .catch((error) => {
      //   console.error("1 While connecting back-end on : " + FETCH_API, error);
      // });
    })();
  }, []);

  useEffect(() => {
    // // If no tree exists, create the first default tree
    // console.log("user in reduceer : ", user);
    // if (!user.tree) {
    //   console.log("Create the default tree !!!!!");
    //   fetch(FETCH_API + "/trees", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       name: "Defaut by " + user.firstName,
    //       userId: user.id,
    //     }),
    //   })
    //     .then((response) => response.json())
    //     .then((data) => {
    //       if (!data.result) {
    //         alert(data.error);
    //         return;
    //       }
    //       console.log("Result of POST query /tree ");
    //       showObject(data);
    //       console.log("Tree saved in DB with id ", data.tree._id);
    //       dispatch(setTreeId(data.tree._id));
    //     });
    //   // .catch((error) => {
    //   //   console.error("2 While connecting back-end on " + FETCH_API, error);
    //   // });
    // }
    // // readMembersFromDataBase();
    // // TODO: Did move the following block in the function
    // // If a tree already exists load it ...
    // fetch(FETCH_API + "/members/")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     if (!data.result) {
    //       alert(data.error);
    //       return;
    //     }
    //     console.log("Find ", data.members.length, " members in DB");
    //     dispatch(setMembers(data.members));
    //   });
    // // .catch((error) => {
    // //   console.error("1 While connecting back-end on : " + FETCH_API, error);
    // // });
  }, []);

  const closePopup = (buttonPressed) => {
    console.log("Close with action : ", buttonPressed);
    setPopup("");
  };

  const onPress = () => {
    setPopup(
      <MyPopup
        title="What do you want ?"
        buttons={["OK", "Cancel", "YES"]}
        onClose={closePopup}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text>HomePage Screen</Text>
      <Button
        onPress={() => {
          navigation.navigate("CreateMember");
        }}
        title="Ajoute un membre"
        uppercase={false}
        style={styles.button}
        titleStyle={{ fontFamily: fontFamily }}
      />

      <Text>Current tree: {user.tree}</Text>
      <Text>Member count : {members.length}</Text>
      <MembersList navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   height: 1000,
  //   backgroundColor: "#fff",
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  button: {
    marginTop: 50,
  },
});
