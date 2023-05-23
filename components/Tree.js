import { StyleSheet, View, ScrollView, Text } from "react-native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { buildReps } from "../modules/tree";
import { NodeMember } from "../components/NodeMember";

const size = 100;
const r = size * 0.33;

// Tree component
//======================================================
function Tree({ navigation }) {
  console.log("navigation ", navigation);
  const user = useSelector((state) => state.user.value);
  const members = useSelector((state) => state.members.value);

  const graphDef = buildReps(members);
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
            {draw}
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#FFFFFF",
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
