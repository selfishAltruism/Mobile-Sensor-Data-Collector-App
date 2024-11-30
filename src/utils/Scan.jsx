import React, { useState, useEffect, useRef } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";

import { BleManager } from "react-native-ble-plx";
import WifiManager from "react-native-wifi-reborn";
import {
  magnetometer,
  setUpdateIntervalForType,
  gyroscope,
  accelerometer, // 가속도계 추가
  SensorTypes,
} from "react-native-sensors";

import AsyncStorage from "@react-native-async-storage/async-storage";
import RNFS from "react-native-fs";

const INTERVER = 1000;
const bleManager = new BleManager();

const Scan = () => {
  const [isScanning, setIsScanning] = useState(false); // 스캔 중 상태
  const [scanInterval, setScanInterval] = useState(null); // 스캔 간격 관리
  const [error, setError] = useState(false);

  const magSubscription = useRef(null);
  const gyroSubscription = useRef(null);
  const accelSubscription = useRef(null); // 가속도계 구독 추가

  const devices = useRef([]);

  // Bluetooth 장치 검색 함수
  const scanBluetoouth = () => {
    AsyncStorage.setItem(
      Date.now() + "-bluetooth",
      JSON.stringify(devices.current)
    ).then(() => {
      console.log("블루투스 스캔 완료");
    });

    //console.log(devices.current);
    devices.current = [];
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
    }
  };

  const startScanning = () => {
    setError(false);

    bleManager.startDeviceScan([], null, (error, device) => {
      if (error) {
        console.log("블루투스 검색 중 오류 발생: ", error);
        setError(true);
        return;
      }

      if (device && !devices.current.some((d) => d.id === device.id)) {
        devices.current.push({
          id: device.id,
          name: device.name,
          rssi: device.rssi,
        });
      }
    });

    const interval = setInterval(async () => {
      scanBluetoouth();
      await scanWifi();
    }, INTERVER);

    setScanInterval(interval);
    setIsScanning(true);
  };

  const stopScanning = () => {
    console.log("[종료]");

    clearInterval(scanInterval);
    bleManager.stopDeviceScan();
    setIsScanning(false);

    if (gyroSubscription.current) gyroSubscription.current.unsubscribe();
    if (magSubscription.current) magSubscription.current.unsubscribe();
    if (accelSubscription.current) accelSubscription.current.unsubscribe(); // 가속도계 구독 해제
  };

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

  useEffect(() => {
    if (isScanning) {
      if (magSubscription.current) magSubscription.current.unsubscribe();
      setUpdateIntervalForType(SensorTypes.magnetometer, INTERVER);
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
      setUpdateIntervalForType(SensorTypes.gyroscope, INTERVER);
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
  }, [isScanning]);

  useEffect(() => {
    if (isScanning) {
      if (accelSubscription.current) accelSubscription.current.unsubscribe(); // 기존 구독 해제
      setUpdateIntervalForType(SensorTypes.accelerometer, INTERVER);
      accelSubscription.current = accelerometer.subscribe(
        (data) => {
          AsyncStorage.setItem(
            Date.now() + "-accelerometer",
            JSON.stringify(data)
          );
          console.log("가속도계 측정 완료");
        },
        (error) => console.error("가속도계 오류: ", error)
      );
    } else {
      if (accelSubscription.current) accelSubscription.current.unsubscribe(); // 구독 해제
    }
  }, [isScanning]);

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
        <Text style={styles.error}>
          블루투스 에러가 발생하여, 재가동 되었습니다.
        </Text>
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
