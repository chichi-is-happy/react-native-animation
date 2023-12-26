import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  PanResponder,
  StatusBar,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import imageList from '../../const/imageList';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  runOnJS,
  useAnimatedReaction,
  useAnimatedProps,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { AnimatedImage } from 'react-native-reanimated/lib/typescript/reanimated2/component/Image';

const First = () => {
  const [images, setImageList] = useState(imageList);
  const offsetX = useSharedValue(0);
  // const scale = useSharedValue(0);
  // const rotate = useSharedValue(0);

  const rotate = useDerivedValue(() => {
    return Math.abs(offsetX.value);
  });

  const scale = useDerivedValue(() => {
    return Math.min(Math.abs(offsetX.value) / 200, 1);
  });
  const handleChoice = direction => {
    offsetX.value = 0;
    offsetX.value = withTiming(direction * 500, { duration: 300 });
    // rotate.value = Math.abs(offsetX.value);

    console.log('이전 스케일 확인 :::', scale.value);
    console.log('이전 rotate 확인 :::', rotate.value);
    console.log('이전 스케일 확인 :::', scale.value);
    console.log('offsetX.value 확인 :::', offsetX.value);
    handleMoveImages(images);
    // scale.value = Math.min(Math.abs(offsetX.value) / 200, 1);
    console.log('이후 스케일 확인 :::', scale.value);
    console.log('이후 rotate 확인 :::', rotate.value);
  };

  const handleMoveImages = images => {
    const newImageList = [...images];
    const movedImages = newImageList.splice(0, 1);
    newImageList.push(...movedImages);
    console.log('images. 배열 확인 ', newImageList);
    runOnJS(setImageList)(newImageList); // 이미지 리스트 상태 업데이트
  };

  // 음수인지, 양수인지 확인 후 좌/우로 이동시킴
  const direction = Math.sign(offsetX);

  const pan = Gesture.Pan()
    .onBegin(() => {
      console.log('시작');
      console.log('시작 당시 images:::', images);
      offsetX.value = 0;
      // scale.value = 0;
    })
    .onChange(event => {
      offsetX.value = event.translationX;
      // 1. 뒤의 이미지가 나타나기 : offsetX.value 절댓값이 늘어나면 scale.value 값도 함께 늘어남
      // if (Math.abs(offsetX.value) >= 0) {
      //   scale.value = Math.min(Math.abs(offsetX.value) / 200, 1); // 최대 스케일을 1로 설정
      //   // 2. 움직일 때 rotate는 offSetX.value에 비례해서 변경됨
      //   rotate.value = Math.abs(offsetX.value);
      // }
    })

    // 3. 다음 이미지를 현재 이미지로 사용할 수 있어야 함
    //
    .onEnd(() => {
      // 스와이프 완료
      if (Math.abs(offsetX.value) >= 80) {
        offsetX.value = withTiming(direction * 500, { duration: 300 });
        // offsetX.value = withTiming(0, { duration: 0 });
        // offsetX.value = 0;
        runOnJS(handleMoveImages)(images);
        // rotate.value = 0;
        offsetX.value = 0;
      } else {
        offsetX.value = withSpring(0, { duration: 300 });
        // rotate.value = 0;
      }
    });

  // const rotate = Animated.multiply(swipe.x, titlSign).interpolate({
  //   inputRange: [-100, 0, 100],
  //   outputRange: ['8deg', '0deg', '-8deg'],
  // });

  // const rotate = interpolate(offsetX.value, [-100, 0, 100], ['8deg', '0deg', '-8deg']);

  const frontImageStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offsetX.value }, { rotate: `${rotate.value}deg` }],
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const backImageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  }));

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <StatusBar hidden={true} />

      <GestureHandlerRootView>
        {/*앞의 이미지*/}
        <GestureDetector gesture={pan}>
          <Animated.View style={[frontImageStyle]}>
            <View style={styles.imageContainer}>
              <Image source={images[0]} style={styles.image} />
            </View>
          </Animated.View>
        </GestureDetector>

        {/*뒤의 이미지 */}
        <Animated.View style={[backImageStyle]}>
          <View style={styles.imageContainer}>
            <Image source={images[1]} style={styles.image} />
          </View>
        </Animated.View>

        {/* 버튼 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} title="O" onPress={() => handleChoice(-1)}>
            <Text style={styles.buttonText}>O</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            title="X"
            onPress={() => {
              handleChoice(1);
            }}
          >
            <Text style={styles.buttonText}>X</Text>
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: 'absolute',
  },
  image: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderRadius: 20,
  },
  buttonContainer: {
    top: 200,
    alignContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: 200,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
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

export default First;
