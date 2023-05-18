import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextInput } from "@react-native-material/core";
import { fontFamily } from "../modules/deco";
import { setMembers } from "../reducers/members";
import { Canvas, Circle, Group } from "@shopify/react-native-skia";
import { buildReps } from "../modules/tree";

const size = 306;
const r = size * 0.33;
// Tree component
//======================================================
function Tree() {
  const user = useSelector((state) => state.user.value);
  const members = useSelector((state) => state.members.value);

  buildReps(members);

  // useEffect(() => {
  //   // If no tree exists, create the first default tree
  //   console.log("Show tree with ", members.length, " members in DB");
  // }, []);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>Ici, mon arbre</Text> */}
      <ScrollView>
        <ScrollView horizontal={true}>
          <Canvas style={styles.canvas}>
            <Group blendMode="multiply">
              <Circle cx={r} cy={r} r={r} color="cyan" />
              <Circle cx={size - r} cy={r} r={r} color="magenta" />
              <Circle cx={size / 2} cy={size - r} r={r} color="yellow" />
            </Group>
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
