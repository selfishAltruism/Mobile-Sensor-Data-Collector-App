import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import WifiListScreen from "./src/entities/Test";

import requestBluetoothPermission from "./src/permissions/requestBluetoothPermission";

import Scan from "./src/utils/Scan";
import ResultModal from "./src/entities/ResultModal";

import AsyncStorage from "@react-native-async-storage/async-storage";

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

  const onPosition = () => {
    (async () => {
      await AsyncStorage.setItem(Date.now() + "-position", JSON.stringify([]));
    })();
  };

  return (
    <>
      <View style={styles.container}>
        <Scan />
        <TouchableOpacity
          style={styles.positionButton}
          onPress={() => {
            onPosition();
          }}
        >
          <Text style={styles.positionButtonText}>POSITION SAVE</Text>
        </TouchableOpacity>
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
  positionButton: {
    padding: 10,
    backgroundColor: "#ffd000",
    borderRadius: 5,
    marginTop: 10,
  },
  positionButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default App;
