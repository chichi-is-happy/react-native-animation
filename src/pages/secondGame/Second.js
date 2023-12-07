import React, { useState } from 'react';
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
} from 'react-native';
import FastImage from 'react-native-fast-image';
import image1 from '../../images/1.jpeg';
import image2 from '../../images/2.jpeg';
import image3 from '../../images/3.jpeg';
import image4 from '../../images/4.jpeg';
import image5 from '../../images/5.jpeg';
import Animated from 'react-native-reanimated';

const Second = () => {
  const imageList = [image1, image2, image3, image4, image5];
  const [image, setImage] = useState(imageList[0]);
  const [oList, setOList] = useState([]);
  const [xList, setXList] = useState([]);
  const [count, setCount] = useState(0);
  const handleClickO = targetImage => {
    setOList(oList => [...oList, targetImage]);
    setCount(count => count + 1);
    setImage(imageList[count]);
    console.log('count 확인 ::::', count);
    console.log('oList 확인 ::::', oList);
    console.log('imageList 확인 ::::', imageList);
  };

  const handleClickX = targetImage => {
    setXList(oList => [...oList, targetImage]);
    setCount(count => count + 1);
    setImage(imageList[count]);

    console.log('count 확인 ::::', count);
    console.log('xList 확인 ::::', xList);
    console.log('imageList 확인 ::::', imageList);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/*<Animated.View*/}
      {/*  style={{*/}
      {/*    width: 100,*/}
      {/*    height: 100,*/}
      {/*    backgroundColor: 'violet',*/}
      {/*  }}*/}
      {/*/>*/}
      <TouchableOpacity style={styles.button} onPress={() => handleClickO(image)}>
        <Text style={styles.buttonText}>알아</Text>
      </TouchableOpacity>
      <View style={styles.itemBox}>
        <View style={styles.question}>
          <Image source={image} style={styles.image} resizeMode="contain" />
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => handleClickX(image)}>
        <Text style={styles.buttonText}>몰라</Text>
      </TouchableOpacity>

      {/*<View style={styles.buttonContainer}>*/}
      {/*  <TouchableOpacity style={styles.button} title="O" onPress={() => handleClickO(image)}>*/}
      {/*    <Text style={styles.buttonText}>O</Text>*/}
      {/*  </TouchableOpacity>*/}
      {/*  <TouchableOpacity*/}
      {/*    style={styles.button}*/}
      {/*    title="X"*/}
      {/*    onPress={() => {*/}
      {/*      handleClickX(image);*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <Text style={styles.buttonText}>X</Text>*/}
      {/*  </TouchableOpacity>*/}
      {/*</View>*/}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFD1DC',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  itemBox: {
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
  question: {
    width: 100,
    height: 100,
    // backgroundColor: 'black',
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
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});

export default Second;
