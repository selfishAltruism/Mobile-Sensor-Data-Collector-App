import React, { useState, useEffect, useRef } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";

import { BleManager } from "react-native-ble-plx";
import WifiManager from "react-native-wifi-reborn";
import {
  magnetometer,
  setUpdateIntervalForType,
  gyroscope,
  SensorTypes,
} from "react-native-sensors";

import AsyncStorage from "@react-native-async-storage/async-storage";
import RNFS from "react-native-fs";

const bleManager = new BleManager();

const Scan = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(false);

  const magSubscription = useRef(null);
  const gyroSubscription = useRef(null);

  const [cycleClear, setCycleClear] = useState(false);

  const scanBluetoouth = async () => {
    return new Promise((resolve, reject) => {
      const devices = [];

      bleManager.startDeviceScan([], null, (error, device) => {
        if (error) {
          console.log("블루투스 검색 중 오류 발생: ", error);
          reject(error);
          return;
        }

        if (device && !devices.some((d) => d.id === device.id)) {
          devices.push({ id: device.id, name: device.name, rssi: device.rssi });
        }
      });

      setTimeout(async () => {
        bleManager.stopDeviceScan();
        console.log("블루투스 스캔 종료");

        try {
          await AsyncStorage.setItem(
            Date.now() + "-bluetooth",
            JSON.stringify(devices)
          );
          console.log("블루투스 정보 저장됨");
          resolve();
        } catch (error) {
          console.error("AsyncStorage에 저장 실패:", error);
          reject(error);
        }
      }, 1000); // 5초 후 블루투스 스캔 종료
    });
  };

  const scanWifi = async () => {
    try {
      const networks = await WifiManager.reScanAndLoadWifiList();
      await AsyncStorage.setItem(
        Date.now() + "-wifi",
        JSON.stringify(networks)
      );
      console.log("Wi-Fi 스캔 완료");
    } catch (error) {
      console.error("Wi-Fi 스캔 중 오류:", error);
      throw error;
    }
  };

  const startScanning = () => {
    console.log("[시작]");
    setError(false);
    setIsScanning(true);

    // 블루투스와 Wi-Fi 스캔을 모두 끝낼 때까지 기다림
    Promise.all([scanBluetoouth(), scanWifi()])
      .then(() => {
        console.log("모든 스캔 완료");
        setCycleClear(true);
      })
      .catch((error) => {
        console.log("스캔 중 오류 발생: ", error);
        setError(true);
        setIsScanning(false);
      });
  };

  const stopScanning = () => {
    console.log("[종료]");
    setIsScanning(false);
    bleManager.stopDeviceScan();

    if (gyroSubscription.current) gyroSubscription.current.unsubscribe();
    if (magSubscription.current) magSubscription.current.unsubscribe();
  };

  useEffect(() => {
    if (isScanning && cycleClear) {
      setCycleClear(false);
      startScanning();
    }
  }, [cycleClear]);

  /* useEffect(() => {
    if (isScanning) {
      if (magSubscription.current) magSubscription.current.unsubscribe();
      setUpdateIntervalForType(SensorTypes.magnetometer, 1000);
      magSubscription.current = magnetometer.subscribe(
        (data) => {
          AsyncStorage.setItem(Date.now() + "-magnet", JSON.stringify(data));
          console.log("마그네토미터 측정 완료");
        },
        (error) => console.error("마그네토미터 오류: ", error)
      );
    } else {
      if (magSubscription.current) magSubscription.current.unsubscribe();
    }
  }, [isScanning]);

  useEffect(() => {
    if (isScanning) {
      if (gyroSubscription.current) gyroSubscription.current.unsubscribe();
      setUpdateIntervalForType(SensorTypes.gyroscope, 1000);
      gyroSubscription.current = gyroscope.subscribe(
        (data) => {
          AsyncStorage.setItem(Date.now() + "-gyroscope", JSON.stringify(data));
          console.log("자이로 측정 완료");
        },
        (error) => console.error("자이로 오류: ", error)
      );
    } else {
      if (gyroSubscription.current) gyroSubscription.current.unsubscribe();
    }
  }, [isScanning]); */

  const saveDataToFile = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const data = await AsyncStorage.multiGet(keys);

      // JSON으로 데이터를 파일로 저장
      const fileContent = data.map(([key, value]) => ({ key, value }));
      const path = `${
        RNFS.DownloadDirectoryPath
      }/scanned_data-${Date.now()}.json`;

      await RNFS.writeFile(path, JSON.stringify(fileContent, null, 2), "utf8");
      console.log(`데이터가 저장되었습니다: ${path}`);
    } catch (error) {
      console.error("데이터 저장 중 오류:", error);
    }
  };

  const styles = StyleSheet.create({
    button: {
      marginTop: 20,
      alignSelf: "center",
      padding: 10,
      backgroundColor: isScanning ? "red" : "blue",
      borderRadius: 5,
      width: 150,
      marginTop: 10,
    },
    buttonText: {
      color: "white",
      fontWeight: "bold",
      alignSelf: "center",
    },
    saveButton: {
      marginTop: 20,
      alignSelf: "center",
      padding: 10,
      backgroundColor: "green",
      borderRadius: 5,
      width: 150,
      marginTop: 10,
    },
  });

  return (
    <>
      {error ? (
        <Text style={styles.error}>블루투스 에러가 발생하였습니다.</Text>
      ) : null}
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (isScanning) {
              stopScanning();
            } else {
              startScanning();
            }
          }}
        >
          <Text style={styles.buttonText}>
            {isScanning ? "SCAN STOP" : "SCAN ON"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={saveDataToFile}>
          <Text style={styles.buttonText}>DATA SAVE</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Scan;
