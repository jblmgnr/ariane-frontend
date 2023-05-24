import { StyleSheet, View, ScrollView, Text } from "react-native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextInput } from "@react-native-material/core";
import { fontFamily } from "../modules/deco";
import { setMembers } from "../reducers/members";
import {
  Canvas,
  Circle,
  Group,
  Text as SkiaText,
  useFont,
  Glyphs,
} from "@shopify/react-native-skia";
import { buildReps } from "./tree";
import { Gender } from "../modules/common";
import { useImage } from "@shopify/react-native-skia";

const size = 100;
const r = size * 0.33;
const maleColor = "cyan";
const femaleColor = "pink";

// Tree component
//======================================================
function Tree() {
  const user = useSelector((state) => state.user.value);
  const members = useSelector((state) => state.members.value);
  const fontSize = 32;
  // const font = useFont(
  //   require("file:///android_asset/fonts/Alloy Ink.otf"),
  //   fontSize
  // );

  // if (font === null) {
  //   console.error("NO FONT !!!!!!!!!!!!!!!");
  //   return null;
  // }

  const graphDef = buildReps(members);
  console.log("Graph depth height : ", graphDef.height);
  // const image = useImage(
  //   require("https://res.cloudinary.com/dgrgdnyju/image/upload/v1684503074/oeq3lvgdxndctyqgbksd.jpg")
  // );
  const draw = graphDef.nodes.map((node, index) => {
    return (
      <Group key={index} blendMode="multiply">
        <Circle
          key={index}
          cx={node.x}
          cy={node.y}
          r={r}
          color={node.member.gender === Gender.male ? maleColor : femaleColor}
        />
        {/* <Image
          image={image}
          fit="contain"
          x={node.x}
          y={node.y}
          width={256}
          height={256}
        /> */}
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
