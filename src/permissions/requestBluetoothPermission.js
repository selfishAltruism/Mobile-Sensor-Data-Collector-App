import { PermissionsAndroid } from "react-native";

const requestBluetoothPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "위치 권한 요청",
        message: "Bluetooth 값 측정",
      }
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Bluetooth 권한이 허용되었습니다.");
    } else {
      console.log("Bluetooth 권한이 거부되었습니다.");
      Alert.alert(
        "권한 거부",
        "Bluetooth 장치를 사용하려면 위치 권한이 필요합니다."
      );
    }
  } catch (err) {
    console.warn(err);
  }
};

export default requestBluetoothPermission;
