import React, { useEffect } from "react";
import { SafeAreaView, Text, StyleSheet, Button } from "react-native";

import requestBluetoothPermission from "./src/permissions/requestBluetoothPermission";
import scanAndStoreDevices from "./src/utils/bluetoothScan";

const App = () => {
  useEffect(() => {
    requestBluetoothPermission();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Button
        title="Start"
        onPress={() => {
          scanAndStoreDevices;
        }}
      ></Button>
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
