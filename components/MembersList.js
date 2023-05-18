import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import MemberProfile from "../components/MemberProfile";
import ImageUploader from "../components/ImageUploader";
import { Avatar } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

const MembersList = ({ navigation }) => {
  const members = useSelector((state) => state.members.value);

  const membersList = members.map((member, i) => {
    const styles = StyleSheet.create({
      container: {
        backgroundColor: "blue",
      },
      member: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
      },
      avatar: {
        backgroundColor: "green",
      },
    });
    return (
      <View key={i} style={styles.container}>
        <View style={styles.member}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("MemberProfile", { member: member });
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
            <Text>{member.firstName}</Text>
            <Text>{member.lastName}</Text>
            <Text>{member.nickName}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  });
  return <>{membersList}</>;
};

export default MembersList;
