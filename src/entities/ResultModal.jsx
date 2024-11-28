import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  Clipboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ResultModal = ({ visible, onClose }) => {
  const [storedData, setStoredData] = useState(null);

  useEffect(() => {
    // AsyncStorage에서 모든 데이터를 가져옴
    const fetchAllData = async () => {
      try {
        // 저장된 모든 키를 가져옴
        const keys = await AsyncStorage.getAllKeys();

        if (keys.length > 0) {
          // 모든 키에 대해 값들을 가져옴
          const allData = await AsyncStorage.multiGet(keys);
          // 가져온 데이터를 key와 value 객체 형태로 변환
          const formattedData = allData.map(([key, value]) => ({
            key,
            value: JSON.parse(value),
          }));
          setStoredData(formattedData);
        } else {
          setStoredData([]);
        }
      } catch (error) {
        console.error("AsyncStorage에서 모든 데이터 가져오기 실패:", error);
      }
    };

    if (visible) {
      fetchAllData();
    }
  }, [visible]);

  // 저장된 디바이스 초기화 함수
  const clearDevices = async () => {
    try {
      // 모든 데이터를 삭제
      await AsyncStorage.clear();
      setStoredData([]); // 화면에서 즉시 갱신
      console.log("저장된 데이터가 초기화되었습니다.");
    } catch (error) {
      console.error("데이터 초기화 실패:", error);
    }
  };

  // 초기화 확인 모달
  const confirmReset = () => {
    Alert.alert("DATA RESET", "", [
      {
        text: "NO",
        style: "cancel",
      },
      {
        text: "YES",
        onPress: clearDevices,
        style: "destructive",
      },
    ]);
  };

  // 데이터를 클립보드에 복사하는 함수
  const copyDataToClipboard = () => {
    const dataString = JSON.stringify(storedData); // 저장된 데이터 문자열로 변환
    Clipboard.setString(dataString); // 클립보드에 복사
    Alert.alert("복사됨", "저장된 데이터가 클립보드에 복사되었습니다.");
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            width: "80%",
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            저장된 모든 데이터
          </Text>
          <ScrollView style={{ maxHeight: 400 }}>
            {storedData && storedData.length > 0 ? (
              storedData.map((data, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  <Text>Key: {data.key}</Text>
                  <Text>Value: {JSON.stringify(data.value)}</Text>
                </View>
              ))
            ) : (
              <Text>저장된 데이터가 없습니다.</Text>
            )}
          </ScrollView>
          <TouchableOpacity
            onPress={onClose}
            style={{
              marginTop: 20,
              alignSelf: "center",
              padding: 10,
              backgroundColor: "#007bff",
              borderRadius: 5,
              width: 150,
            }}
          >
            <Text
              style={{
                color: "white",
                alignSelf: "center",
                fontWeight: "bold",
              }}
            >
              CLOSE
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={copyDataToClipboard} // 초기화 확인 모달 실행
            style={{
              marginTop: 10,
              alignSelf: "center",
              padding: 10,
              backgroundColor: "#363636",
              borderRadius: 5,
              width: 150,
            }}
          >
            <Text
              style={{
                color: "white",
                alignSelf: "center",
                fontWeight: "bold",
              }}
            >
              COPY
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={confirmReset} // 초기화 확인 모달 실행
            style={{
              marginTop: 10,
              alignSelf: "center",
              padding: 10,
              backgroundColor: "red",
              borderRadius: 5,
              width: 150,
            }}
          >
            <Text
              style={{
                color: "white",
                alignSelf: "center",
                fontWeight: "bold",
              }}
            >
              RESET
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ResultModal;
