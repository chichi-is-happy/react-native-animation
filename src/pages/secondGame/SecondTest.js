import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  runOnJS,
} from 'react-native-reanimated';

import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

import imageList from '../../const/imageList';

const SecondTest = () => {
  const [images, setImageList] = useState(imageList);
  const hoverO = useSharedValue(false);
  const imageX = useSharedValue(0);
  const imageY = useSharedValue(0);
  const topButtonX = useSharedValue(0);
  const topButtonY = useSharedValue(0);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: imageX.value }, { translateY: imageY.value }],
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const topButtonStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: topButtonX.value }, { translateY: topButtonY.value }],
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const onTopButtonLayout = event => {
    topButtonLayout.value = event.nativeEvent.layout;
    console.log('top button ::', event.nativeEvent.layout);
    topButtonX.value = event.nativeEvent.layout.x;
    topButtonY.value = event.nativeEvent.layout.y;
  };

  const pan = Gesture.Pan()
    .onBegin(() => {
      console.log('시작');
    })
    .onChange(event => {
      imageX.value = event.translationX;
      imageY.value = event.translationY;
    })
    .onFinalize(() => {
      console.log('종료');
    });

  return (
    <Animated.View
      style={{
        flex: 1,
        height: 2200,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <StatusBar hidden={true} />
      <View style={styles.buttonContainer}>
        <Animated.View style={[topButtonStyle]}>
          <TouchableOpacity style={styles.button} title="O">
            <Text style={styles.buttonText}>O</Text>
          </TouchableOpacity>
        </Animated.View>

        <GestureHandlerRootView>
          <GestureDetector gesture={pan}>
            <Animated.View style={[imageStyle]}>
              <View style={styles.imageContainer}>
                <Image source={images[0]} style={styles.image} />
              </View>
            </Animated.View>
          </GestureDetector>
        </GestureHandlerRootView>

        <TouchableOpacity style={styles.button} title="X">
          <Text style={styles.buttonText}>X</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    borderWidth: 1,
  },
  image: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 20,
  },
  buttonContainer: {
    height: '80%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    borderWidth: 1,
  },
  button: {
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    color: '#FFD1DC',
  },
  buttonText: {
    fontSize: 40,
    fontWeight: '100',
  },
});

export default SecondTest;
