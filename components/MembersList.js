import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import ImagePicker from "./ImagePicker";
import { Avatar } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { setMembers } from "../reducers/members";
import { useFonts } from "expo-font";

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
        fontFamily: "Quicksand",
      },
      subtitle: {
        fontFamily: "QuicksandBold",
      },
      deleteContainer: {
        marginLeft: "auto",
      },
    });

    const handleDelete = async (id) => {
      try {
        const response = await fetch(FETCH_API + `/members/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        // // This will update the redux store after successful deletion.
        // dispatch(deleteMember(id));
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      }
      dispatch(setMembers(members.filter((member) => member._id !== id)));
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
                  handleDelete(member._id);
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
