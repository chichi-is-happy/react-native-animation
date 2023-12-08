import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import imageList from '../../const/imageList';

import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const First = () => {
  const [prevImage, setPrevImage] = useState(imageList[0]);
  const [image, setImage] = useState(imageList[0]);
  const [oList, setOList] = useState([]);
  const [xList, setXList] = useState([]);
  const [count, setCount] = useState(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  const animatedDefault = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    zIndex: -1,
  }));

  const handleClickO = targetImage => {
    translateX.value = 0;
    setOList(oList => [...oList, targetImage]);
    setPrevImage(image);
    setCount(count => count + 1);
    setImage(imageList[count]);
    translateX.value = withTiming(-500, { duration: 300 });
    rotate.value = withTiming(-360, { duration: 500 });

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
    translateX.value = withTiming(500, { duration: 300 });
    rotate.value = withTiming(360, { duration: 500 });
    console.log('count 확인 ::::', count);
    console.log('xList 확인 ::::', xList);
    console.log('imageList 확인 ::::', imageList);
    console.log('image 확인:::', image);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.itemBox}>
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.image} resizeMode="contain" />
          <Animated.View style={[animatedDefault]}>
            <Image source={prevImage} style={styles.image} resizeMode="contain" />
          </Animated.View>
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
    position: 'relative',

    width: 150,
    height: 150,
  },
  image: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 20,
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
