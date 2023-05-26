import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Gender } from "../modules/common";
import { useTree } from "../hooks/useTree";
import { maleColor, femaleColor } from "../modules/deco";

// Tree component
//======================================================
export function NodeMember({ graphDef, node, onClicked }) {
  const user = useSelector((state) => state.user.value);
  const members = useSelector((state) => state.members.value);
  const { partnerOf, fatherOf, buildReps } = useTree();

  const member = node.member;
  const partner = partnerOf(member, true);
  const partnerName = partner ? "♥ " + partner.firstName + " ♥" : "";

  const backgroundColor =
    node.member.gender == Gender.male ? maleColor : femaleColor;
  const photo_uri =
    node.member.photo === "" ||
    node.member.photo === undefined ||
    node.member.photo === null
      ? "https://res.cloudinary.com/dnmjxxju4/image/upload/v1684509736/y0pek1wd2xukoudfy0jl.jpg"
      : node.member.photo;

  // Image size: 80% of min of with and height
  const imageSize =
    graphDef.boxWidth > graphDef.boxHeight
      ? graphDef.boxHeight * 0.5
      : graphDef.boxWidth * 0.5;

  const handleLongPress = () => {
    console.log("============== ID : ", member._id);
    const partner = partnerOf(member, true);
    console.log("Partner : ", partner ? partner.firstName : "None");
    const father = fatherOf(member);
    console.log("Father : ", father ? father.firstName : "None");
  };

  const sameBloodStyle = member.sameBlood
    ? { borderWidth: 4, borderColor: "#EEEE00" }
    : { borderWidth: 4, borderColor: "#666666" };

  return (
    <View
      style={[
        styles.container,
        {
          position: "absolute",
          top: node.y,
          left: node.x,
          width: graphDef.boxWidth,
          height: graphDef.boxHeight,
          backgroundColor: backgroundColor,
          borderBottomWidth: 10,
          borderRightWidth: 10,
          borderRadius: 150,
          justifyContent: "flex-start",
        },
      ]}
    >
      <TouchableOpacity
        //        onPress={() => onClicked(node.member)}
        onPress={() => {
          console.log("Click on ", node.member.firstName);
          onClicked(node.member);
        }}
        onLongPress={handleLongPress}
      >
        <Image
          style={[
            styles.image,
            {
              width: imageSize,
              height: imageSize,
            },
            sameBloodStyle,
          ]}
          source={{ uri: photo_uri }}
        />
      </TouchableOpacity>
      <Text style={styles.name}>
        {node.member.firstName} {node.member.lastName}
      </Text>
      <Text style={styles.nickName}>{node.member.nickName}</Text>
      <Text style={styles.nickName}>{partnerName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 5,
  },
  canvas: {
    flex: 1,
    width: 1500,
    height: 1800,
  },
  name: {
    fontSize: 15,
    fontWeight: 600,
  },
  nickName: {
    fontSize: 12,
    fontWeight: 400,
  },
  image: {
    backgroundColor: "gray",
    resizeMode: "cover",
    borderRadius: 100,
    margin: 5,
  },
});
