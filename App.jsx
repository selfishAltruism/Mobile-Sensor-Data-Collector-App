import React, { useEffect } from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";

import requestBluetoothPermission from "./src/permissions/requestBluetoothPermission";

const App = () => {
  useEffect(() => {
    requestBluetoothPermission();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Hello, React Native!</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default App;
