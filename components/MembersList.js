import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Avatar } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { removeMember } from "../reducers/members";

const { getFetchAPI } = require("../modules/util");

const FETCH_API = getFetchAPI();

const MembersList = ({ navigation }) => {
  const members = useSelector((state) => state.members.value);
  const dispatch = useDispatch();

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
        borderColor: "#000",
        flexWrap: "wrap",
      },
      avatar: {
        marginRight: 10,
      },
      text: {
        marginRight: 10,
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
        <View>
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
            <Text style={styles.text}>Prénom : {member.firstName}</Text>
            <Text style={styles.text}>Nom : {member.lastName}</Text>
            <Text style={styles.text}>Surnom : {member.nickName}</Text>
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
