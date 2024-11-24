import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Button,
  View,
  TouchableOpacity,
} from "react-native";

import requestBluetoothPermission from "./src/permissions/requestBluetoothPermission";
import Scan from "./src/utils/Scan";
import ResultModal from "./src/entities/ResultModal";

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    requestBluetoothPermission();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <Scan />
        <ResultModal visible={modalVisible} onClose={closeModal} />
      </View>
      <TouchableOpacity style={styles.button} onPress={openModal}>
        <Text style={styles.buttonText}>LOG</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  button: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
    backgroundColor: "#555555",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default App;
