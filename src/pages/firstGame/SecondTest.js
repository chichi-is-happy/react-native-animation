import React, { useState, useRef, useEffect } from 'react';
import {
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
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

const SecondTest = () => {
  const [image, setImage] = useState(imageList[0]);
  const [nextImage, setNextImage] = useState(imageList[1]);
  const offsetX = useSharedValue(0);
  const scale = useSharedValue(0);
  const imageIndex = useSharedValue(0);
  const nextImageIndex = useSharedValue(1);

  // const pan = Gesture.Pan()
  //   .onBegin(() => {
  //     console.log('시작');
  //   })
  //   .onChange(e => {
  //     console.log('진행중');
  //   })
  //   .onFinalize(() => {
  //     console.log('종료');
  //   });

  // const gestureHandler = useAnimatedGestureHandler({
  //   onStart: (_, ctx) => {
  //     ctx.startX = offsetX.value;
  //   },
  //   onActive: (event, ctx) => {
  //     offsetX.value = ctx.startX + event.translationX;
  //   },
  //   onEnd: _ => {
  //     offsetX.value = withTiming(0, { duration: 500, easing: Easing.bounce }); // 원래 위치로 복귀
  //   },
  // });

  const pan = Gesture.Pan()
    .onBegin(() => {
      console.log('시작');
      scale.value = 0;
    })
    .onChange(event => {
      offsetX.value = event.translationX;
      // 1. 뒤의 이미지가 나타나기 : offsetX.value 절댓값이 늘어나면 scale.value 값도 함께 늘어남
      if (Math.abs(offsetX.value) >= 0) {
        scale.value = Math.min(Math.abs(offsetX.value) / 200, 1); // 최대 스케일을 1로 설정
      }

      // 2. x가 100 이상일 경우 (넘어가면) 해당 이미지가 아예 바깥으로 넘어가는 애니메이션
      if (Math.abs(offsetX.value) >= 100) {
        offsetX.value = withTiming(-1000, { duration: 100 }, () => {
          // 애니메이션이 완료된 후에 이미지 인덱스를 교환하고 offsetX를 리셋합니다.
          let temp = imageIndex.value;
          imageIndex.value = nextImageIndex.value;
          nextImageIndex.value = temp + 1;
          offsetX.value = 0;
        });
        scale.value = 1;

        if (imageIndex.value < imageList.length - 2) {
          imageIndex.value += 1;
          nextImageIndex.value += 1;
        }
      }

      // 3. 다음 이미지를 현재 이미지로 사용할 수 있어야 함
      //
    })
    .onEnd(() => {
      // 뒤의 이미지와 앞의 이미지의 상태를 바꿔줍니다.
      let temp = imageIndex.value;
      imageIndex.value = nextImageIndex.value;
      nextImageIndex.value = temp + 1;
      console.log('imageIndex:::', imageIndex.value);
      console.log('nextImageIndex:::', nextImageIndex.value);
      offsetX.value = 0;
    });

  const backImagePan = Gesture.Pan();

  const frontImageStyle = useAnimatedStyle(() => ({
    display: 'flex',
    alignItems: 'center',
    width: 100,
    height: 100,
    transform: [{ translateX: offsetX.value }],
  }));

  const topAnimatedButton = useAnimatedStyle(() => ({
    transform: [{ translateX: offsetX.value }],
  }));

  const backImageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView>
        <View
          style={{ alignItems: 'center', justifyContent: 'center', flex: 1, position: 'relative' }}
        >
          {/*앞의 이미지*/}
          <GestureDetector gesture={pan}>
            <Animated.View style={[frontImageStyle]}>
              <Image source={imageList[imageIndex.value]} style={{ width: 100, height: 100 }} />
            </Animated.View>
          </GestureDetector>
          {/*뒤의 이미지 */}
          <GestureDetector gesture={backImagePan}>
            <Animated.View style={[backImageStyle]}>
              <Image source={imageList[nextImageIndex.value]} style={{ width: 100, height: 100 }} />
            </Animated.View>
          </GestureDetector>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default SecondTest;
