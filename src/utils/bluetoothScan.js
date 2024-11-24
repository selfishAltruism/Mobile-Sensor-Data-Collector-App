import { BleManager } from "react-native-ble-plx";
import AsyncStorage from "@react-native-async-storage/async-storage";

const bleManager = new BleManager();

// Bluetooth 장치 검색 함수
const scanAndStoreDevices = async () => {
  // 스캔을 시작하고 결과를 저장할 배열을 준비
  const scannedDevices = [];

  // Bluetooth 장치 검색 시작
  bleManager.startDeviceScan([], null, async (error, device) => {
    if (error) {
      console.log("디바이스 검색 중 오류 발생: ", error);
      return;
    }

    // 유효한 장치가 발견되면 scannedDevices 배열에 추가
    if (device && !scannedDevices.some((d) => d.id === device.id)) {
      scannedDevices.push(device);
    }
  });

  // 5초 후 스캔 종료하고, 결과를 AsyncStorage에 저장
  setTimeout(async () => {
    bleManager.stopDeviceScan();
    console.log("디바이스 스캔 종료");

    try {
      // AsyncStorage에 디바이스 정보 저장
      await AsyncStorage.setItem(
        "scannedDevices",
        JSON.stringify(scannedDevices)
      );
      console.log("디바이스 정보 저장됨");
    } catch (error) {
      console.error("AsyncStorage에 저장 실패:", error);
    }
  }, 5000); // 5초 동안 스캔
};

export default scanAndStoreDevices;
