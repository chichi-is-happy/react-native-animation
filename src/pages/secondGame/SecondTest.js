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
  // const topButtonLayout = useSharedValue({ width: 0, height: 0, pageX: 0, pageY: 0 });
  const bottomButtonLayout = useSharedValue({ width: 0, height: 0, pageX: 0, pageY: 0 });
  const upperButtonScale = useSharedValue(1);
  const lowerButtonScale = useSharedValue(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const opacity = useSharedValue(1);
  const [topButtonLayout, setTopButtonLayout] = useState({ pageX: 0, pageY: 0, width: 0, x: 0 });

  useEffect(() => {
    console.log('topButtonLayout:::', topButtonLayout);
  }, [topButtonLayout]);

  const increaseButtonSize = buttonScale => {
    buttonScale.value = 1.5;
    console.log('increaseButtonSize를 실행 ');
  };

  const resetButtonSize = buttonScale => {
    buttonScale.value = 1; // 원래 크기로 복구
  };

  const onButtonLayout = (event, buttonLayout) => {
    const layout = event.nativeEvent.layout;
    buttonLayout.value = layout;
  };

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: imageX.value }, { translateY: imageY.value }],
    alignItems: 'center',
    justifyContent: 'center',
    opacity: opacity.value,
  }));

  const topButtonStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: topButtonLayout.pageX && topButtonLayout.pageX },
      { translateY: topButtonLayout.pageY && topButtonLayout.pageY },
      { scale: upperButtonScale.value },
    ],
  }));

  const bottomButtonStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: bottomButtonLayout.value.pageX },
      { translateY: bottomButtonLayout.value.pageY },
      { scale: lowerButtonScale.value },
    ],
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

      if (
        // event.translationX >= topButtonLayout.value.pageX &&
        // event.translationX <= topButtonLayout.value.pageX + topButtonLayout.value.width &&
        // event.translationY >= topButtonLayout.value.y &&
        // event.translationY <= topButtonLayout.value.y + topButtonLayout.value.height
        event.translationX
        //
      ) {
        runOnJS(increaseButtonSize)(upperButtonScale);
        upperButtonScale.value = 2;
        console.log('버튼 범위 안');
      } else {
        upperButtonScale.value = 1;
        runOnJS(resetButtonSize)(upperButtonScale);
      }
    })
    .onFinalize(() => {
      console.log('종료');
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
    <Animated.View
      style={{
        flex: 1,
        // height: ß2200,ß
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        borderWidth: 1,
        //   justifyContent: 'space-between',
        //   alignItems: 'center',
        //   flexDirection: 'column',
      }}
    >
      {/*<StatusBar hidden={true} />*/}
      <View style={styles.buttonContainer}>
        <Animated.View
          ref={firstButtonRef}
          onLayout={() => {
            if (firstButtonRef) {
              // firstButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
              //   console.log(x, y, width, height, pageX, pageY);
              // });
              firstButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
                console.log(x, y, width, height, pageX, pageY);
                setTopButtonLayout({ pageX: pageX, pageY: pageY, width: width, height: height });
              });
            }
          }}
          style={[
            {
              // width: 100,
              // height: 100,
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
          style={[
            {
              // width: 100,
              // height: 100,
              borderWidth: 1,
              color: '#FFD1DC',
              fontSize: 40,
              fontWeight: '100',
            },
            bottomButtonStyle,
          ]}
          ref={secondButtonRef}
          onLayout={() => {
            if (secondButtonRef) {
              secondButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
                console.log(x, y, width, height, pageX, pageY);
              });
            }
          }}
        >
          <TouchableOpacity title="X" style={styles.button}>
            <Text style={styles.buttonText}>X</Text>
          </TouchableOpacity>
        </Animated.View>
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
    // width: '100%',
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
