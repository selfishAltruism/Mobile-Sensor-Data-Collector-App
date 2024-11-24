const INTERVER = 2000;

import React, { useState } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { BleManager } from "react-native-ble-plx";
import AsyncStorage from "@react-native-async-storage/async-storage";

const bleManager = new BleManager();

const Scan = () => {
  const [isScanning, setIsScanning] = useState(false); // 스캔 중 상태
  const [scanInterval, setScanInterval] = useState(null); // 스캔 간격 관리

  // Bluetooth 장치 검색 함수
  const scanDevices = () => {
    // 디바이스가 이미 스캔 중일 경우, 이전 스캔을 종료
    bleManager.stopDeviceScan();

    const devices = [];

    // Bluetooth 장치 검색 시작
    bleManager.startDeviceScan([], null, (error, device) => {
      if (error) {
        console.log("디바이스 검색 중 오류 발생: ", error);
        return;
      }

      // 유효한 장치가 발견되면 devices 배열에 추가
      if (device && !devices.some((d) => d.id === device.id)) {
        devices.push({ id: device.id, name: device.name, rssi: device.rssi });
      }
    });

    setTimeout(async () => {
      bleManager.stopDeviceScan();
      console.log("디바이스 스캔 종료");

      try {
        // AsyncStorage에 디바이스 정보 저장
        await AsyncStorage.setItem(
          Date.now() + "-bluetooth",
          JSON.stringify(devices)
        );
        console.log("디바이스 정보 저장됨");
      } catch (error) {
        console.error("AsyncStorage에 저장 실패:", error);
      }
    }, INTERVER);
  };

  // 1초마다 scanDevices 호출하는 함수
  const startScanning = () => {
    // 1초마다 scanDevices 호출
    const interval = setInterval(() => {
      scanDevices();
    }, INTERVER + 100);
    setScanInterval(interval);
    setIsScanning(true);
  };

  // 스캔을 중지하는 함수
  const stopScanning = () => {
    clearInterval(scanInterval); // interval 정지
    bleManager.stopDeviceScan(); // 스캔 종료
    setIsScanning(false);
  };

  const styles = StyleSheet.create({
    button: {
      padding: 10,
      backgroundColor: isScanning ? "red" : "blue",
      borderRadius: 5,
    },
    buttonText: {
      color: "white",
      fontWeight: "bold",
    },
  });

  return (
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
        <Text style={styles.buttonText}>{isScanning ? "Stop" : "Scan"}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Scan;
