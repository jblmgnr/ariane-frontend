import { View, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

const MembersList = ({ navigation }) => {
  const members = useSelector((state) => state.members.value);

  const membersList = members.map((member, i) => {
    return (
      <View key={i}>
        <TouchableOpacity
          onPress={() => navigation.navigate("MemberProfile", { member })}
        >
          <Text>{member.firstName}</Text>
          <Text>{member.lastName}</Text>
        </TouchableOpacity>
      </View>
    );
  });
  return <View>{membersList}</View>;
};

export default MembersList;
