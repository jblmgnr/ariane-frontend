import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { useSelector } from "react-redux";
import { NodeMember } from "../components/NodeMember";
import { useTree } from "../hooks/useTree";

const size = 100;
const r = size * 0.33;

// Tree component
//======================================================
function Tree({ navigation }) {
  console.log("navigation ", navigation);
  const user = useSelector((state) => state.user.value);
  const members = useSelector((state) => state.members.value);
  const { buildReps } = useTree();

  const graphDef = buildReps();
  console.log("Graph depth height : ", graphDef.height);

  const showMemberProfile = (member) => {
    console.log("Member selected : ", member.firstName);
    navigation.navigate("MemberProfile", { member });
  };

  const draw = graphDef.nodes.map((node, index) => {
    return (
      <NodeMember
        key={index}
        graphDef={graphDef}
        onClicked={showMemberProfile}
        node={node}
      />
    );
  });

  return (
    <View style={styles.container}>
      <ScrollView>
        <ScrollView horizontal={true}>
          <View
            style={{
              width: graphDef.width,
              height: 2000, //graphDef.height,
              // backgroundColor: "grey",
            }}
          >
            <Image
              source={require("../assets/logo.png")}
              style={styles.backgroundImage}
            />
            {draw}
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // or 'stretch'
    zIndex: -1,
    opacity: 0.5,
  },

  container: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 80,
  },
  canvas: {
    flex: 1,
    width: 1500,
    height: 1800,
  },
});

export default Tree;
