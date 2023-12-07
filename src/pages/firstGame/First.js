import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Button,
  useColorScheme,
  View,
  TouchableOpacity,
  Image,
  Easing,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import image1 from '../../images/1.jpeg';
import image2 from '../../images/2.jpeg';
import image3 from '../../images/3.jpeg';
import image4 from '../../images/4.jpeg';
import image5 from '../../images/5.jpeg';
import image6 from '../../images/6.jpeg';
import image7 from '../../images/7.jpeg';
import image8 from '../../images/8.jpeg';
import image9 from '../../images/9.jpeg';
import image10 from '../../images/10.jpeg';
import image11 from '../../images/11.jpeg';
import image12 from '../../images/12.jpeg';
import image13 from '../../images/13.jpeg';
import image14 from '../../images/14.jpeg';

import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { Svg, Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const First = () => {
  const imageList = [
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7,
    image8,
    image9,
    image10,
    image11,
    image12,
    image13,
    image14,
  ];
  const [prevImage, setPrevImage] = useState(imageList[0]);
  const [image, setImage] = useState(imageList[0]);
  const [oList, setOList] = useState([]);
  const [xList, setXList] = useState([]);
  const [count, setCount] = useState(1);
  const handleClickO = targetImage => {
    translateX.value = 0;
    setOList(oList => [...oList, targetImage]);
    setPrevImage(image);
    setCount(count => count + 1);
    setImage(imageList[count]);
    // translateX.value = withSequence(withTiming(-300, { duration: 1000 }), withTiming(0));
    translateX.value = withTiming(-300, { duration: 1000 });

    console.log('count 확인 ::::', count);
    console.log('oList 확인 ::::', oList);
    console.log('imageList 확인 ::::', imageList);
    console.log('image 확인:::', image);
  };

  const handleClickX = targetImage => {
    translateX.value = 0;
    setXList(oList => [...oList, targetImage]);
    setPrevImage(image);
    setCount(count => count + 1);
    setImage(imageList[count]);
    // translateX.value = withSequence(withTiming(300, { duration: 1000 }), withTiming(0));
    translateX.value = withTiming(300, { duration: 1000 });

    console.log('count 확인 ::::', count);
    console.log('xList 확인 ::::', xList);
    console.log('imageList 확인 ::::', imageList);
    console.log('image 확인:::', image);
  };

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(300);

  const animatedDefault = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  const duration = 2000;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.itemBox}>
        <View style={styles.imageContainer}>
          <Animated.View style={[animatedDefault]}>
            <Image source={prevImage} style={styles.image} resizeMode="contain" />
          </Animated.View>
          <Image source={image} style={styles.image} resizeMode="contain" />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} title="O" onPress={() => handleClickO(image)}>
          <Text style={styles.buttonText}>O</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          title="X"
          onPress={() => {
            handleClickX(image);
          }}
        >
          <Text style={styles.buttonText}>X</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFD1DC',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flex: 1,
  },
  itemBox: {
    // borderWidth: 1,
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
    position: 'relative',
    alignSelf: 'stretch',
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 10,
    // borderWidth: 1,
  },

  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '80%',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: 'white',
    // borderWidth: 1,
    color: '#FFD1DC',
    marginTop: 40,
  },
  buttonText: {
    fontSize: 40,
    fontWeight: '100',
    color: '#C8C8C8FF',
  },
});

export default First;
