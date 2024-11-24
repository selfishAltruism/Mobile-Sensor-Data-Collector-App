import React, { useState } from "react";
import { Button, Text, View } from "react-native";
import { BleManager } from "react-native-ble-plx";

const bleManager = new BleManager();

const BluetoothDevices = () => {
  const [devices, setDevices] = useState([]);

  // Bluetooth 장치 검색 함수
  const scanDevices = () => {
    // 디바이스가 이미 스캔 중일 경우, 이전 스캔을 종료
    bleManager.stopDeviceScan();

    // Bluetooth 장치 검색 시작
    bleManager.startDeviceScan([], null, (error, device) => {
      if (error) {
        console.log("디바이스 검색 중 오류 발생: ", error);
        return;
      }

      // 유효한 장치가 발견되면 devices 배열에 추가
      if (device && !devices.some((d) => d.id === device.id)) {
        setDevices((prevDevices) => [
          ...prevDevices,
          { id: device.id, name: device.name, rssi: device.rssi },
        ]);
      }
    });

    // 5초 후 스캔 종료
    setTimeout(() => {
      bleManager.stopDeviceScan();
    }, 1000); // 5초 동안 스캔
  };

  return (
    <View>
      <Button title="디바이스 검색 시작" onPress={scanDevices} />

      <Text>현재 확인 가능한 Bluetooth 디바이스:</Text>
      {devices.length === 0 ? (
        <Text>디바이스를 찾을 수 없습니다.</Text>
      ) : (
        devices.map((device, index) => (
          <View key={index}>
            <Text>{`ID: ${device.id}, Name: ${
              device.name || "이름 없음"
            }`}</Text>
            <Text>{`RSSI: ${device.rssi} dBm`}</Text>
          </View>
        ))
      )}
    </View>
  );
};

export default BluetoothDevices;
