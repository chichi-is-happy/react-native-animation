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
  withSequence,
} from 'react-native-reanimated';

import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

import imageList from '../../const/imageList';

const SecondTest = () => {
  const [images, setImageList] = useState(imageList);
  const hoverO = useSharedValue(false);
  const imageX = useSharedValue(0);
  const imageY = useSharedValue(0);
  // const topButtonX = useSharedValue(0);
  // const topButtonY = useSharedValue(0);
  const scale = useSharedValue(0);
  const buttonLayout = useSharedValue({ x: 0, y: 0, width: 0, height: 0 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const opacity = useSharedValue(1);
  const onButtonLayout = event => {
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
    transform: [{ translateX: buttonLayout.value.x }, { translateY: buttonLayout.value.y }],
    alignItems: 'center',
    justifyContent: 'center',
  }));

  // const onTopButtonLayout = event => {
  //   topButtonLayout.value = event.nativeEvent.layout;
  //   console.log('top button ::', event.nativeEvent.layout);
  //   topButtonX.value = event.nativeEvent.layout.x;
  //   topButtonY.value = event.nativeEvent.layout.y;
  // };

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
        // imageX.value = 0;
        // imageY.value = 0;

        scale.value = withSpring(1);
        opacity.value = withSpring(1);
      })),
    );

    // imageX.value = 0;
    // imageY.value = 0;
  }

  // function updateCurrentIndexAndScale() {
  //   setCurrentImageIndex(prevIndex => {
  //     const nextIndex = (prevIndex + 1) % images.length;
  //     return nextIndex;
  //   });
  //
  //   scale.value = withSpring(0, {}, () => {
  //     opacity.value = 0;
  //     imageX.value = 0;
  //     imageY.value = 0;
  //   });
  //
  //   // imageX.value = 0;
  //   // imageY.value = 0;
  //   scale.value = withSpring(0, {}, () => {
  //     opacity.value = 0;
  //     // imageX.value = 0;
  //     // imageY.value = 0;
  //
  //     scale.value = withSpring(1);
  //     opacity.value = withSpring(1);
  //   });
  // }

  // function updateCurrentIndexAndScale() {
  //   setCurrentImageIndex(prevIndex => {
  //     const nextIndex = (prevIndex + 1) % images.length;
  //     return nextIndex;
  //   });
  //
  //   scale.value = withSpring(0, {}, () => {
  //     opacity.value = 0;
  //     imageX.value = 0;
  //     imageY.value = 0;
  //
  //     scale.value = withSpring(1);
  //     // opacity.value = withSpring(1);
  //   });
  // }

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
                <Image source={images[currentImageIndex]} style={styles.image} />
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
