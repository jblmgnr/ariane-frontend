import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import { MyButton } from "./MyButton";
import { MyModal } from "./MyModal";

export default function MyPopup(props) {
  const [isModalVisible, setIsModalVisible] = useState(true);

  // useEffect(() => {
  //   const checkForSubscription = setTimeout(() => {
  //     setIsModalVisible(() => !isModalVisible);
  //   }, 1500);
  //   return () => clearTimeout(checkForSubscription);
  // }, []);

  const handleSignUp = () => {
    // sign up the user and close the modal
    setIsModalVisible(() => !isModalVisible);
    props.onClose("OK");
  };

  const handleDecline = (e) => {
    console.log("TTTTTTTTTTTTTTTTTTTTTTTT", e.target);
    // Did: Here it would be nice to send the button title instead of "Cancel" to the callback
    // function onClose()

    // console.log("Decline : ", e);
    // const util = require("util");
    // console.log(
    //   util.inspect(e, { showHidden: false, depth: null, colors: true })
    // );

    setIsModalVisible(() => !isModalVisible);
    props.onClose("Cancel");
  };

  const onButtonClicked = (title) => {
    props.onClose(title);
  };

  const buttons = props.buttons.map((name, index) => {
    return (
      <MyButton
        key={index}
        title={name}
        onPress={() => onButtonClicked(name)}
      />
    );
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Premium stuff here</Text>
      <View style={styles.separator} />
      <MyModal isVisible={isModalVisible}>
        <MyModal.Container>
          <View style={styles.modal}>
            <MyModal.Header title={props.title} />
            <MyModal.Body>
              <Text style={styles.text}>
                Want access? We just need your email address
              </Text>
              <TextInput
                style={styles.input}
                placeholder="email"
                keyboardType="email-address"
              />
            </MyModal.Body>
            <MyModal.Footer>
              <View style={styles.button}>
                {buttons}
                {/* <MyButton title="No thanks" onPress={(e) => handleDecline(e)} />
                <MyButton title="Sign me up!" onPress={handleSignUp} /> */}
              </View>
            </MyModal.Footer>
          </View>
        </MyModal.Container>
      </MyModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#888888",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  input: {
    paddingTop: 10,
    borderColor: "grey",
    borderBottomWidth: 2,
  },
  button: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
  },
  modal: {
    width: "100%",
    height: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
});
