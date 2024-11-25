import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  PermissionsAndroid,
  FlatList,
  StyleSheet,
} from "react-native";
import WifiManager from "react-native-wifi-reborn";

const WifiListScreen = () => {
  const [wifiList, setWifiList] = useState([]);

  console.log(wifiList);

  useEffect(() => {
    // Android 권한 요청
    const requestPermissions = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "위치 권한 요청",
            message: "Wi-Fi 네트워크 스캔을 위해 위치 권한이 필요합니다.",
            buttonNeutral: "나중에",
            buttonNegative: "취소",
            buttonPositive: "확인",
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("위치 권한 허용됨");
          scanWifiNetworks();
        } else {
          console.log("위치 권한 거부됨");
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestPermissions();
  }, []);

  // Wi-Fi 네트워크 스캔
  const scanWifiNetworks = async () => {
    try {
      const networks = await WifiManager.reScanAndLoadWifiList();
      setWifiList(networks);
    } catch (error) {
      console.error("Wi-Fi 스캔 중 오류:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wi-Fi 네트워크 목록</Text>
      {wifiList.length > 0 ? (
        <FlatList
          data={wifiList}
          keyExtractor={(item) => item.BSSID}
          renderItem={({ item }) => (
            <View style={styles.networkItem}>
              <Text style={styles.ssidText}>{item.SSID}</Text>
              <Text style={styles.signalText}>신호 강도: {item.level}</Text>
            </View>
          )}
        />
      ) : (
        <Text>Wi-Fi 네트워크를 검색 중입니다...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  networkItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  ssidText: {
    fontSize: 16,
  },
  signalText: {
    fontSize: 14,
    color: "#555",
  },
});

export default WifiListScreen;
