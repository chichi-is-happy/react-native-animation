import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  PanResponder,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import imageList from '../../const/imageList';
import { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

const Test = () => {
  const [image, setImage] = useState(imageList[0]);
  const [nextImage, setNextImage] = useState(imageList[1]);
  const pan = useRef(new Animated.ValueXY()).current;
  const nextImageScale = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      // 주어진 터치 이벤트에 반응
      onStartShouldSetPanResponder: () => true,
      // 터치 이벤트가 발생할 때 실행
      // onPanResponderMove의 dy를 제거, 터치 이동 중 y값이 변하지 않도록 설정
      onPanResponderMove: Animated.event([null, { dx: pan.x }], {
        // listener: (_, gestureState) => {
        //   nextImageScale.setValue(Math.abs(gestureState.dx) >= 100 ? 1.0 : 0.5);
        // },
        listener: (_, gestureState) => {
          Animated.timing(nextImageScale, {
            // toValue: 2.0,
            toValue: Math.abs(gestureState.dx) >= 100 ? 1.0 : 0.5,
            duration: 300,
            easing: Easing.elastic(1),
            useNativeDriver: false,
          }).start();
        },
        useNativeDriver: false,
      }),
      // 터치 이벤트가 진행 중일 때 실행
      onPanResponderRelease: (e, { vx, dx }) => {
        // dx가 100 이상일 경우 (넘어가면)
        // 1. 해당 이미지가 아예 바깥으로 넘어가는 애니메이션
        // 2. 다음 이미지가 가운데에서 생성되는 애니메이션 (크기 커짐)

        // 해당 이미지가 아예 바깥으로 넘어가는 애니메이션
        if (Math.abs(dx) >= 100) {
          Animated.timing(pan, {
            toValue: { x: dx > 0 ? 400 : -400, y: 0 },
            duration: 300, // 300ms 동안 움직임
            useNativeDriver: false,
          }).start();

          // scale 수치를 withTiming 으로 조절,
          Animated.timing(nextImageScale, {
            toValue: 2.0,
            duration: 300,
            easing: Easing.elastic(1),
            useNativeDriver: false,
          }).start();

          // 다음 이미지가 가운데에서 생성되는 애니메이션 (크기 커짐)

          // Animated.decay(pan, {
          //   velocity: { x: vx, y: 0 },
          //   deceleration: 0.995,
          //   useNativeDriver: false,
          // }).start();
          // dx가 100 이하일 경우 (범위 넘어가지 않으면)
          // 1. 해당 이미지가 원래 자리로 되돌아옴 (회전 각 rotate 가 제자리로 돌아감)
          // 적용할 값(pan: 초기 위치)에서 목표 위치까지 스프링 애니메이션
          // friction : 스프링 마찰력
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false,
          }).start();

          Animated.timing(nextImageScale, {
            toValue: 0.5,
            duration: 300,
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, position: 'relative' }}>
      {/*앞의 이미지*/}
      <Animated.View
        {...panResponder.panHandlers}
        style={[pan.getLayout(), { zIndex: 999, alignItems: 'center', justifyContent: 'center' }]}
      >
        <Image source={image} style={{ width: 30, height: 30 }} />
      </Animated.View>
      {/*뒤의 이미지 */}
      <Animated.View
        {...panResponder.panHandlers}
        style={{ position: 'absolute', transform: [{ scale: nextImageScale }] }}
      >
        <Image source={nextImage} style={{ width: 30, height: 30 }} />
      </Animated.View>
    </View>
  );
};

const styled = StyleSheet.create({});
export default Test;
