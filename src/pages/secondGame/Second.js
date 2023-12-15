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
import { AnimatedView } from 'react-native-reanimated/lib/typescript/reanimated2/component/View';

const Second = () => {
  const [prevImage, setPrevImage] = useState(imageList[0]);
  const [image, setImage] = useState(imageList[0]);
  const [oImage, setOImage] = useState([]);
  const buttonX = useSharedValue(0);
  const buttonY = useSharedValue(0);
  const bottomButtonX = useSharedValue(0);
  const bottomButtonY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const pressed = useSharedValue(false);
  const hover = useSharedValue(false);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const mouseX = useSharedValue(0);
  const mouseY = useSharedValue(0);
  const originalX = useSharedValue(0);
  const originalY = useSharedValue(0);
  const layout = useSharedValue(0);
  const imageIndex = useSharedValue(0);
  // const imageListShared = useSharedValue(imageList);
  const [imageListArray, setImageList] = useState(imageList);

  // 애플리케이션 창의 너비
  const windowWidth = Dimensions.get('window').width; // 393
  // 애플리케이션 창의 높이
  const windowHeight = Dimensions.get('window').height; // 852
  console.log('windowWidth:::', windowWidth);
  console.log('windowHeight:::', windowHeight);

  // useEffect(() => {
  //   const id = requestAnimationFrame(() => {
  //     setImageList(prev => [...prev]);
  //   });
  //
  //   return () => cancelAnimationFrame(id);
  // }, [imageIndex.value]);

  // useEffect(() => {
  //   setImage(imageList[imageIndex.value]);
  // }, [imageIndex]);

  const index = useDerivedValue(() => imageIndex.value);

  useEffect(() => {
    console.log('derived', index.value);
    setImage(imageList[index.value]);
  }, [index.value]);

  useEffect(() => {
    console.log('확인:::', imageList);
    // console.log('확인하기1', imageListArray); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    console.log('확인하기', imageListArray[imageIndex.value]);
  }, [imageIndex.value]);

  // O 버튼이 있는 최소 X범위 <= offsetX <= O버튼 최대 X범위 &&
  // O 버튼이 있는 최소 Y범위 <= offsetY <= O버튼 최대 Y범위 이면
  // O 버튼의 크기 1.2배 커지고 backgroundColor 색상 변경됨
  // 해당 (커서가 버튼 안에 있는) 상태에서 onFinalize 되면
  // offsetX와 offsetY가 0으로 초기화 되지 않고 사라짐 (혹은 사라지는 애니메이션)
  // 해당 (커서가 버튼 안에 있지 않은) 상태에서 onFinalize 되면// offsetX와 offsetY가 0으로 초기화

  //  {"height": 100, "width": 100, "x": 146, "y": 201}
  // O 버튼 레이아웃 계산 함수 : 버튼의 세로, 가로, 부모로부터 x거리, 부모로부터 y거리
  const onButtonLayout = event => {
    layout.value = event.nativeEvent.layout;
    console.log('top button ::', event.nativeEvent.layout);
    // 이미지의 X, Y 절대위치 저장
    buttonX.value = event.nativeEvent.layout.x;
    buttonY.value = event.nativeEvent.layout.y;

    //  screen.width , screen.height
    // RN 메소드 사용 - 디멘션 사용 -> 기기 화면 전체의 높이, 넓이를 가져옴
  };

  const onBottomButtonLayout = event => {
    layout.value = event.nativeEvent.layout;
    console.log('bottom button:::', event.nativeEvent.layout);
    // 이미지의 X, Y 절대위치 저장
    bottomButtonX.value = event.nativeEvent.layout.x;
    bottomButtonY.value = event.nativeEvent.layout.y;

    //  screen.width , screen.height
    // RN 메소드 사용 - 디멘션 사용 -> 기기 화면 전체의 높이, 넓이를 가져옴
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
      // console.log('absoluteX:::', absoluteX);
      // console.log('layout.value.width:::', layout.value.width);
      // console.log('offsetY.value:::', offsetY.value);
      // console.log('buttonX.value:::', buttonX.value); // 146
      // console.log(' buttonY.value:::', buttonY.value); // 213
      // console.log('absoluteY:::', absoluteY);
      // console.log('합산:::', buttonX.value + layout.value.width); // 246
      // console.log('buttonY.value:::', buttonY.value + layout.value.height); // 313

      if (
        // 146 <= x <= 246
        // 213 <= y <= 313
        buttonX.value <= absoluteX &&
        buttonX.value + layout.value.width >= absoluteX &&
        buttonY.value <= absoluteY &&
        buttonY.value + layout.value.height >= absoluteY
        // buttonX.value >= absoluteX + layout.value.width &&
        // buttonY.value >= absoluteY.value + layout.value.height
      ) {
        hover.value = true;
        console.log('일치');
      } else {
        hover.value = false;
      }
    })
    .onFinalize(() => {
      // offsetX.value = withSpring(0);
      // offsetY.value = withSpring(0);
      pressed.value = false;
      // O 자리에 놓았으면

      if (hover.value === true) {
        console.log('O 자리에 놓음');
        hover.value = false;
        imageIndex.value = imageIndex.value + 1;
        // imageListShared.value = imageListShared.value[imageIndex.value];
        console.log('imageIndex:::', imageIndex.value);
        // imageIndex.value = (imageIndex.value + 1) % imageList.length;
        offsetX.value = withSpring(0);
        offsetY.value = withSpring(0);
        // setImage(imageList[imageIndex.value]);
        const newImage = imageList[imageIndex.value];
        runOnJS(setImage)(newImage);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: pressed.value ? '#FFE04B' : '#B58DF1',
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value },
      { scale: withTiming(pressed.value ? 1.5 : 1) },
    ],
  }));

  const animatedButton = useAnimatedStyle(() => ({
    backgroundColor: hover.value ? '#f81f43' : 'transparent',
    transform: [
      { translateX: buttonX.value },
      { translateY: buttonY.value },
      { scale: withTiming(hover.value ? 1.5 : 1) },
    ],
  }));

  const bottomAnimatedButton = useAnimatedStyle(() => ({
    backgroundColor: hover.value ? '#f81f43' : 'transparent',
    width: 100,
    height: 100,
    transform: [
      { translateX: bottomButtonX.value },
      { translateY: bottomButtonY.value },
      { scale: withTiming(hover.value ? 1.5 : 1) },
    ],
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/*<View style={{ width: 100, height: 100 }}>*/}
        {/*<Animated.View style={([animatedButton], { width: 100 })} onLayout={onButtonLayout}>*/}
        <Animated.View
          style={([animatedButton], { width: 100, height: 100 })}
          onLayout={onButtonLayout}
        >
          {/*<View style={{ width: 100, height: 100 }}>*/}
          <TouchableOpacity style={styles.button} title="O">
            <Text style={styles.buttonText}>O</Text>
          </TouchableOpacity>
          {/*</View>*/}
        </Animated.View>
        {/*</View>*/}

        <View style={styles.itemBox}>
          <View style={styles.imageContainer}>
            <GestureDetector gesture={pan}>
              <Animated.View style={[animatedStyle]}>
                <Image
                  source={image}
                  // source={imageListArray[imageIndex.value]}
                  style={styles.image}
                  resizeMode="contain"
                />
                {/*<Image source={image} style={styles.image} resizeMode="contain" />*/}
              </Animated.View>
            </GestureDetector>
          </View>
        </View>

        <Animated.View
          onLayout={onBottomButtonLayout}
          style={([bottomAnimatedButton], { width: 100, height: 100 })}
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
  imageContainer: {
    // position: 'relative',
    width: 150,
    height: 150,
  },
  image: {
    // position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 20,
    // borderWidth: 1,
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
    color: '#FFD1DC',
  },
  buttonText: {
    fontSize: 40,
    fontWeight: '100',
    color: '#C8C8C8FF',
  },
});

export default Second;
