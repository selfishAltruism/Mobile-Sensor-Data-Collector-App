const INTERVER = 1000;

import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";

import { BleManager } from "react-native-ble-plx";
import WifiManager from "react-native-wifi-reborn";

import AsyncStorage from "@react-native-async-storage/async-storage";

const bleManager = new BleManager();

const Scan = () => {
  const [isScanning, setIsScanning] = useState(false); // 스캔 중 상태
  const [scanInterval, setScanInterval] = useState(null); // 스캔 간격 관리
  const [error, setError] = useState(false);

  // Bluetooth 장치 검색 함수
  const scanBluetoouth = () => {
    // 블루투스가 이미 스캔 중일 경우, 이전 스캔을 종료
    bleManager.stopDeviceScan();

    const devices = [];

    // Bluetooth 장치 검색 시작
    bleManager.startDeviceScan([], null, (error, device) => {
      if (error) {
        console.log("블루투스 검색 중 오류 발생: ", error);
        setError(true);
        return;
      }

      // 유효한 장치가 발견되면 devices 배열에 추가
      if (device && !devices.some((d) => d.id === device.id)) {
        devices.push({ id: device.id, name: device.name, rssi: device.rssi });
      }
    });

    setTimeout(async () => {
      bleManager.stopDeviceScan();
      console.log("블루투스 스캔 종료");

      try {
        // AsyncStorage에 블루투스 정보 저장
        await AsyncStorage.setItem(
          Date.now() + "-bluetooth",
          JSON.stringify(devices)
        );
        console.log("블루투스 정보 저장됨");
      } catch (error) {
        console.error("AsyncStorage에 저장 실패:", error);
      }
    }, INTERVER);
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

  // 1초마다 scanBluetoouth 호출하는 함수
  const startScanning = () => {
    setError(false);

    const interval = setInterval(async () => {
      await scanBluetoouth();
      await scanWifi();
    }, INTERVER);

    setScanInterval(interval);
    setIsScanning(true);
  };

  // 스캔을 중지하는 함수
  const stopScanning = () => {
    clearInterval(scanInterval); // interval 정지
    bleManager.stopDeviceScan(); // 스캔 종료
    setIsScanning(false);
  };

  useEffect(() => {
    if (error) {
      stopScanning();
    }
  }, [error]);

  const styles = StyleSheet.create({
    button: {
      padding: 10,
      backgroundColor: isScanning ? "red" : "blue",
      borderRadius: 5,
      marginTop: 10,
    },
    buttonText: {
      color: "white",
      fontWeight: "bold",
    },
    error: {
      color: "red",
      fontWeight: "bold",
    },
  });

  return (
    <>
      {error ? (
        <Text style={styles.error}>
          에러 발생하였습니다. 다시 실행해 주세요.
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
          <Text style={styles.buttonText}>{isScanning ? "STOP" : "SCAN"}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Scan;
