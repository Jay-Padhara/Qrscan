import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Image,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';

export default function App() {
  const [isActive, setActive] = useState(false);
  const [image, setImage] = useState();
  const [code, setCode] = useState();

  const camera = useRef(null);
  const device = useCameraDevice('back');
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      console.log(`Scanned ${codes.length} codes!`);
      console.log(codes[0]);
      setCode(codes[0].value);
    },
  });

  useEffect(() => {
    async function handleCam() {
      const permission = await Camera.requestCameraPermission();
      const status = Camera.getCameraPermissionStatus();
      console.log('Camera permission status : ' + status);

      if (status === 'denied') await Linking.openSettings();
    }

    handleCam();
  }, []);

  const handleImg = async () => {
    if (camera.current !== null) {
      const photo = await camera.current.takePhoto({});
      console.log(photo);
      setImage(photo.path);
      setActive(false);
      console.log(photo.path);
    }
  };

  const handleUrl = async () => {
    try {
      await Linking.openURL(code);
      console.log('Opening url...');
      setCode('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
      }}>
      <View
        style={{justifyContent: 'center', alignItems: 'center', margin: 20}}>
        <View>
          <Image
            style={{width: 300, height: 300}}
            source={{
              uri: `file://'${image}`,
            }}
          />
        </View>
      </View>

      <Text style={{fontSize: 20, color: 'white', margin: 10}}>
        Open camera
      </Text>

      <TouchableOpacity
        style={{backgroundColor: 'white', padding: 10, borderRadius: 10}}
        onPress={() => setActive(true)}>
        <Text style={{fontSize: 17, color: 'black'}}>Vision camera</Text>
      </TouchableOpacity>

      {isActive ? (
        <>
          <Camera
            ref={camera}
            device={device}
            isActive={isActive}
            style={StyleSheet.absoluteFill}
            codeScanner={codeScanner}
            photo
          />

          {code ? (
            <View style={{position: 'absolute', top: 50}}>
              <TouchableOpacity
                style={{
                  backgroundColor: 'black',
                  padding: 15,
                  borderRadius: 30,
                  margin: 20,
                }}
                onPress={handleUrl}>
                <Text style={{fontSize: 17, color: 'white'}}>{code}</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <View
            style={{position: 'absolute', alignItems: 'center', bottom: 50}}>
            <TouchableOpacity
              style={{
                backgroundColor: 'grey',
                width: 80,
                height: 80,
                borderRadius: 50,
                borderWidth: 5,
                borderColor: 'white',
              }}
              onPress={handleImg}
            />
          </View>
        </>
      ) : null}
    </SafeAreaView>
  );
}
