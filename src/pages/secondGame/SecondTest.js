import React, { useEffect, useRef, useState } from 'react';
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
  withSequence,
} from 'react-native-reanimated';

import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

import imageList from '../../const/imageList';

const SecondTest = () => {
  const [images, setImageList] = useState(imageList);
  const hoverO = useSharedValue(false);
  const imageX = useSharedValue(0);
  const imageY = useSharedValue(0);
  const scale = useSharedValue(0);
  const upperButtonScale = useSharedValue(1);
  const lowerButtonScale = useSharedValue(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const opacity = useSharedValue(1);
  const [topButtonLayout, setTopButtonLayout] = useState({
    pageX: 0,
    pageY: 0,
    width: 0,
    height: 0,
  });
  const [bottomButtonLayout, setBottomButtonLayout] = useState({
    pageX: 0,
    pageY: 0,
    width: 0,
    height: 0,
  });

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  console.log('screenWidth:::', screenWidth);
  console.log('screenHeight:::', screenHeight);

  useEffect(() => {
    console.log('topButtonLayout:::', topButtonLayout);
  }, [topButtonLayout]);
  useEffect(() => {
    console.log('bottomButtonLayout:::', bottomButtonLayout);
  }, [bottomButtonLayout]);

  const increaseButtonSize = buttonScale => {
    buttonScale.value = 1.5;
    console.log('increaseButtonSize를 실행 ');
  };

  const resetButtonSize = buttonScale => {
    buttonScale.value = 1; // 원래 크기로 복구
  };

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: imageX.value }, { translateY: imageY.value }],
    alignItems: 'center',
    justifyContent: 'center',
    opacity: opacity.value,
    zIndex: 999,
  }));

  const topButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: upperButtonScale.value }],
    zIndex: -999,
  }));

  const bottomButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: lowerButtonScale.value }],
    zIndex: -999,
  }));

  // 이미지 크기가 증가하는 애니메이션
  useEffect(() => {
    scale.value = withSpring(1);
  }, []);

  const pan = Gesture.Pan()
    .onBegin(() => {
      console.log('시작');
    })
    .onChange(event => {
      imageX.value = event.translationX;
      imageY.value = event.translationY;
      console.log('event.translationX :::', event.translationX);
      console.log('topButtonLayout.pageX :::', topButtonLayout.pageX);

      const imageCenterX = imageX.value + screenWidth / 2;
      const imageCenterY = imageY.value + screenHeight / 2;

      console.log('imageCenterX:::', imageCenterX);
      console.log('imageCenterY:::', imageCenterY);

      if (
        imageCenterX >= topButtonLayout.pageX &&
        imageCenterX <= topButtonLayout.pageX + topButtonLayout.width &&
        imageCenterY >= topButtonLayout.pageY &&
        imageCenterY <= topButtonLayout.pageY + topButtonLayout.height
      ) {
        runOnJS(increaseButtonSize)(upperButtonScale);
        upperButtonScale.value = withSpring(2, { duration: 300 });
        console.log('O 버튼 범위 안');
      } else if (
        imageCenterX >= bottomButtonLayout.pageX &&
        imageCenterX <= bottomButtonLayout.pageX + bottomButtonLayout.width &&
        imageCenterY >= bottomButtonLayout.pageY &&
        imageCenterY <= bottomButtonLayout.pageY + bottomButtonLayout.height
      ) {
        runOnJS(increaseButtonSize)(lowerButtonScale);
        lowerButtonScale.value = withSpring(2, { duration: 300 });
        console.log('X 버튼 범위 안');
      } else {
        // upperButtonScale.value = 1;
        upperButtonScale.value = withSpring(1, { duration: 300 });
        lowerButtonScale.value = withSpring(1, { duration: 300 });
        // runOnJS(resetButtonSize)(upperButtonScale);
      }
    })
    .onFinalize(() => {
      console.log('종료');
      upperButtonScale.value = withSpring(1, { duration: 300 });
      lowerButtonScale.value = withSpring(1, { duration: 300 });
      runOnJS(updateCurrentIndexAndScale)();
    });

  function updateCurrentIndexAndScale() {
    setCurrentImageIndex(prevIndex => {
      const nextIndex = (prevIndex + 1) % images.length;
      return nextIndex;
    });

    withSequence(
      withSpring()(
        (scale.value = withSpring(0, {}, () => {
          opacity.value = 0;
          imageX.value = 0;
          imageY.value = 0;
        })),
      ),
      (scale.value = withSpring(0, {}, () => {
        opacity.value = 0;
        scale.value = withSpring(1);
        opacity.value = withSpring(1);
      })),
    );
  }

  const firstButtonRef = useRef(null);
  const secondButtonRef = useRef(null);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        borderWidth: 1,
      }}
    >
      {/*<StatusBar hidden={true} />*/}
      {/*<View style={styles.buttonContainer}>*/}
      <Animated.View
        ref={firstButtonRef}
        onLayout={() => {
          if (firstButtonRef) {
            firstButtonRef.current.measure((x, y, width, height) => {
              console.log('위', width, height, x, y);
              setTopButtonLayout({ pageX: x, pageY: y, width: width, height: height });
            });
          }
        }}
        style={[
          {
            position: 'absolute',
            left: 160,
            top: 70,
            borderWidth: 1,
            color: '#FFD1DC',
            fontSize: 40,
            fontWeight: '100',
          },
          topButtonStyle,
        ]}
      >
        <TouchableOpacity title="O" style={styles.button}>
          <Text style={styles.buttonText}>O</Text>
        </TouchableOpacity>
      </Animated.View>

      <GestureHandlerRootView>
        <GestureDetector gesture={pan}>
          <Animated.View style={[imageStyle]}>
            <View style={styles.imageContainer}>
              <Image source={images[currentImageIndex]} style={styles.image} />
            </View>
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>

      <Animated.View
        ref={secondButtonRef}
        onLayout={() => {
          if (secondButtonRef) {
            secondButtonRef.current.measure((x, y, width, height) => {
              console.log('아래', width, height, x, y);
              setBottomButtonLayout({ pageX: x, pageY: y, width: width, height: height });
            });
          }
        }}
        style={[
          {
            position: 'absolute',
            left: 160,
            top: 500,
            borderWidth: 1,
            color: '#FFD1DC',
            fontSize: 40,
            fontWeight: '100',
          },
          bottomButtonStyle,
        ]}
      >
        <TouchableOpacity title="X" style={styles.button}>
          <Text style={styles.buttonText}>X</Text>
        </TouchableOpacity>
      </Animated.View>
      {/*</View>*/}
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    borderWidth: 1,
    borderColor: 'pink',
    zIndex: 999,
  },
  image: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 20,
    zIndex: 999,
  },
  buttonContainer: {
    // width: '100%',
    height: '80%',
    // justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: 'red',
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
