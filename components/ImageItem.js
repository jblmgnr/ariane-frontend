import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function ImageItem(props) {
  console.log("Image : ", props.image);

  return (
    <View style={styles.container}>
      <FontAwesome
        name="times"
        // onPress={() => dispatch(remove(data.name))}
        size={25}
        color="#ec6e5b"
      />

      <Image style={styles.image} source={{ uri: props.image }}></Image>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // // justifyContent: "flex-start",
    // // alignItems: "center",
    // backgroundColor: "blue",
    alignItems: "flex-end",
  },
  image: {
    width: 150,
    height: 150,
    backgroundColor: "gray",
    // borderBottomLeftRadius: 100,
    resizeMode: "cover",
  },
  //   title: {
  //     width: "80%",
  //     fontSize: 45,
  //     fontWeight: "600",
  //     color: "white",
  //     textAlign: "right",
  //   },
  //   textButton: {
  //     color: "#ffffff",
  //     height: 30,
  //     fontWeight: "600",
  //     fontSize: 24,
  //     textAlign: "right",
  //     // backgroundColor: "red",
  //     margin: 5,
  //   },

  //   button: {
  //     width: "100%",
  //     // backgroundColor: "blue",
  //     paddingRight: 30,
  //   },
});
