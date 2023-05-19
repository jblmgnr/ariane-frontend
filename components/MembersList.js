import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { Avatar } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

const MembersList = ({ navigation }) => {
  const members = useSelector((state) => state.members.value);

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
      },
      avatar: {
        marginRight: 10,
      },
      text: {
        marginRight: 10,
      },
    });
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
          </TouchableOpacity>
        </View>
      </View>
    );
  });
  return <>{membersList}</>;
};

export default MembersList;
