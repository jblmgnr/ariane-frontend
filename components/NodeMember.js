import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Gender } from "../modules/common";

const maleColor = "cyan";
const femaleColor = "pink";

// Tree component
//======================================================
export function NodeMember({ graphDef, node, onClicked }) {
  const user = useSelector((state) => state.user.value);
  const members = useSelector((state) => state.members.value);

  console.log("XXXXXXXXXXXXXXXXX", onClicked);

  const backgroundColor =
    node.member.gender == Gender.male ? maleColor : femaleColor;
  const photo_uri =
    node.member.photo === "" || node.member.photo === undefined
      ? "https://res.cloudinary.com/dnmjxxju4/image/upload/v1684509736/y0pek1wd2xukoudfy0jl.jpg"
      : node.member.photo;

  // Image size: 80% of min of with and height
  const imageSize =
    graphDef.boxWidth > graphDef.boxHeight
      ? graphDef.boxHeight * 0.7
      : graphDef.boxWidth * 0.7;
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
          borderRadius: 10,
        },
      ]}
    >
      <TouchableOpacity
        //        onPress={() => onClicked(node.member)}
        onPress={() => {
          console.log("Click on ", node.member.firstName);
          onClicked(node.member);
        }}
      >
        <Image
          style={[
            styles.image,
            {
              width: imageSize,
              height: imageSize,
            },
          ]}
          source={{ uri: photo_uri }}
        />
      </TouchableOpacity>
      <Text style={styles.name}>
        {node.member.firstName} {node.member.lastName}
      </Text>
      <Text style={styles.nickName}>{node.member.nickName}</Text>
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
    // borderBottomLeftRadius: 100,
    resizeMode: "cover",
    borderRadius: 50,
  },
});
