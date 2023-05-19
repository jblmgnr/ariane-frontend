import { StyleSheet, View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextInput } from "@react-native-material/core";
import { fontFamily } from "../modules/deco";
import { setMembers } from "../reducers/members";
import { Canvas, Circle, Group, Text } from "@shopify/react-native-skia";
import { buildReps } from "../modules/tree";
import { Gender } from "../modules/common";

const size = 50;
const r = size * 0.33;
const maleColor = "cyan";
const femaleColor = "pink";

// Tree component
//======================================================
function Tree() {
  const user = useSelector((state) => state.user.value);
  const members = useSelector((state) => state.members.value);

  const graphDef = buildReps(members);
  console.log("Graph depth height : ", graphDef.height);

  const draw = graphDef.nodes.map((node, index) => {
    return (
      <Group blendMode="multiply">
        <Circle
          key={index}
          cx={node.x}
          cy={node.y}
          r={r}
          color={node.member.gender === Gender.male ? maleColor : femaleColor}
        />
      </Group>
    );
  });

  // useEffect(() => {
  //   // If no tree exists, create the first default tree
  //   console.log("Show tree with ", members.length, " members in DB");
  // }, []);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>Ici, mon arbre</Text> */}
      <ScrollView>
        <ScrollView horizontal={true}>
          <Canvas
            style={[
              styles.canvas,
              { height: graphDef.height, width: graphDef.width },
            ]}
          >
            {draw}
          </Canvas>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#edcdb8",
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
