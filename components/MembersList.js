import { View, Text } from "react-native";
import { useSelector } from "react-redux";

const MembersList = ({}) => {
  const members = useSelector((state) => state.members.value);
  const membersList = members.map((member, i) => {
    return (
      <View key={i}>
        <Text>{member.firstName} lol</Text>
        <Text>{member.lastName}</Text>
      </View>
    );
  });
  return <View>{membersList}</View>;
};

export default MembersList;
