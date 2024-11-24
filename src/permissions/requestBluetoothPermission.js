import { PermissionsAndroid, Platform, Alert } from "react-native";

const requestBluetoothPermission = async () => {
  if (Platform.OS === "android") {
    // Bluetooth 관련 권한 요청
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
    );
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
    );

    // 위치 권한 요청
    const locationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    const coarseLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
    );

    // 권한이 모두 승인되었는지 확인
    if (
      bluetoothConnectPermission === PermissionsAndroid.RESULTS.GRANTED &&
      bluetoothScanPermission === PermissionsAndroid.RESULTS.GRANTED &&
      locationPermission === PermissionsAndroid.RESULTS.GRANTED &&
      coarseLocationPermission === PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log("Bluetooth와 위치 권한이 승인되었습니다.");
    } else {
      Alert.alert("권한 거부", "Bluetooth 또는 위치 권한이 거부되었습니다.");
    }
  }
};

export default requestBluetoothPermission;
