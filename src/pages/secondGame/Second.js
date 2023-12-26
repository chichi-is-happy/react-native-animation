import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
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

const Second = () => {
  const [prevImage, setPrevImage] = useState(imageList[0]);
  const [image, setImage] = useState(imageList[0]);
  const topButtonX = useSharedValue(0);
  const topButtonY = useSharedValue(0);
  const bottomButtonX = useSharedValue(0);
  const bottomButtonY = useSharedValue(0);
  const pressed = useSharedValue(false);
  const hoverO = useSharedValue(false);
  const hoverX = useSharedValue(false);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const topButtonLayout = useSharedValue(0);
  const bottomButtonLayout = useSharedValue(0);
  const imageIndex = useSharedValue(0);
  const [oList, setOList] = useState([]);
  const [xList, setXList] = useState([]);

  // 애플리케이션 창의 너비
  const windowWidth = Dimensions.get('window').width; // 393
  // 애플리케이션 창의 높이
  const windowHeight = Dimensions.get('window').height; // 852
  console.log('windowWidth:::', windowWidth);
  console.log('windowHeight:::', windowHeight);

  const onTopButtonLayout = event => {
    topButtonLayout.value = event.nativeEvent.layout;
    console.log('top button ::', event.nativeEvent.layout);
    topButtonX.value = event.nativeEvent.layout.x;
    topButtonY.value = event.nativeEvent.layout.y;
  };

  const onBottomButtonLayout = event => {
    bottomButtonLayout.value = event.nativeEvent.layout;
    console.log('bottom button:::', event.nativeEvent.layout);
    bottomButtonX.value = event.nativeEvent.layout.x;
    bottomButtonY.value = event.nativeEvent.layout.y;
  };

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
      console.log('이미지 옮기기 시작');
    })

    .onChange(event => {
      offsetX.value = event.translationX;
      offsetY.value = event.translationY;

      const absoluteX = event.absoluteX;
      const absoluteY = event.absoluteY;
      // console.log('absoluteX:::', absoluteX);
      // console.log('absoluteY:::', absoluteY);
      // console.log('layout.value.width:::', layout.value.width);
      // console.log('offsetY.value:::', offsetY.value);
      // console.log('buttonX.value:::', buttonX.value); // 146
      // console.log(' buttonY.value:::', buttonY.value); // 213
      // console.log('absoluteY:::', absoluteY);
      // console.log('합산:::', buttonX.value + layout.value.width); // 246
      // console.log('buttonY.value:::', buttonY.value + layout.value.height); // 313

      if (
        topButtonX.value <= absoluteX &&
        topButtonX.value + topButtonLayout.value.width >= absoluteX &&
        topButtonY.value <= absoluteY &&
        topButtonY.value + topButtonLayout.value.height >= absoluteY
        // buttonX.value >= absoluteX + layout.value.width &&
        // buttonY.value >= absoluteY.value + layout.value.height
      ) {
        hoverO.value = true;
        hoverX.value = false;
        console.log('O에 일치');
      } else if (
        bottomButtonX.value <= absoluteX &&
        bottomButtonX.value + bottomButtonLayout.value.width >= absoluteX &&
        bottomButtonY.value <= absoluteY &&
        bottomButtonY.value + bottomButtonLayout.value.height >= absoluteY
      ) {
        hoverX.value = true;
        hoverO.value = false;
        console.log('X에 일치');
      } else {
        hoverO.value = false;
        hoverX.value = false;
      }
    })
    .onFinalize(() => {
      pressed.value = false;

      if (hoverO.value === true) {
        console.log('O 자리에 놓음');
        hoverO.value = false;
        // runOnJS(setOList)(imageList[imageIndex.value]);
        runOnJS(setOList)(prevOList => [...prevOList, imageList[imageIndex.value]]);
        imageIndex.value = imageIndex.value + 1;
        // imageListShared.value = imageListShared.value[imageIndex.value];
        console.log('imageIndex:::', imageIndex.value);
        // imageIndex.value = (imageIndex.value + 1) % imageList.length;
        offsetX.value = withSpring(0);
        offsetY.value = withSpring(0);
        const newImage = imageList[imageIndex.value];
        runOnJS(setImage)(newImage);
        console.log('O 리스트 ::: ', oList);
      } else if (hoverX.value === true) {
        console.log('X 자리에 놓음');
        hoverX.value = false;
        runOnJS(setXList)(prevXList => [...prevXList, imageList[imageIndex.value]]);
        imageIndex.value = imageIndex.value + 1;
        console.log('imageIndex:::', imageIndex.value);
        offsetX.value = withSpring(0);
        offsetY.value = withSpring(0);
        const newImage = imageList[imageIndex.value];
        runOnJS(setImage)(newImage);
        console.log('X 리스트 ::: ', xList);
      } else {
        offsetX.value = withSpring(0);
        offsetY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    // backgroundColor: pressed.value ? '#FFE04B' : '#B58DF1',
    display: 'flex',
    alignItems: 'center',
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value },
      { scale: withTiming(pressed.value ? 1.5 : 1) },
    ],
  }));

  const topAnimatedButton = useAnimatedStyle(() => ({
    backgroundColor: hoverO.value ? '#f81f43' : 'transparent',
    transform: [
      { translateX: topButtonX.value },
      { translateY: topButtonY.value },
      { scale: withTiming(hoverO.value ? 1.5 : 1) },
    ],
  }));

  const bottomAnimatedButton = useAnimatedStyle(() => ({
    backgroundColor: hoverX.value ? '#f81f43' : 'transparent',
    transform: [
      { translateX: bottomButtonX.value },
      { translateY: bottomButtonY.value },
      { scale: withTiming(hoverX.value ? 1.5 : 1) },
    ],
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={([topAnimatedButton], { width: 100, height: 100 })}
          onLayout={onTopButtonLayout}
        >
          <TouchableOpacity style={styles.button} title="O">
            <Text style={styles.buttonText}>O</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.itemBox}>
          <GestureDetector gesture={pan}>
            <Animated.View style={[animatedStyle]}>
              <Image source={image} style={styles.image} resizeMode="contain" />
            </Animated.View>
          </GestureDetector>
        </View>

        <Animated.View
          style={([bottomAnimatedButton], { width: 100, height: 100 })}
          onLayout={onBottomButtonLayout}
        >
          <TouchableOpacity style={styles.button} title="X">
            <Text style={styles.buttonText}>X</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#FFD1DC',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    flex: 1,
  },
  itemBox: {
    borderWidth: 1,
    borderColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    height: 250,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
    borderRadius: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 20,
    zIndex: 9999,
  },

  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#c7c7c7',
    color: '#FFD1DC',
    zIndex: -1,
  },
  buttonText: {
    fontSize: 40,
    fontWeight: '100',
    color: '#C8C8C8FF',
  },
});

export default Second;
