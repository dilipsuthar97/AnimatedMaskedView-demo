import React from "react";
import { FlatList, Animated, View, Image, StyleSheet, StatusBar, Dimensions, Text } from "react-native";
const { width, height } = Dimensions.get('window');
import MaskedView from '@react-native-community/masked-view';
import Svg, { Rect } from 'react-native-svg';
import data from './data.json';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface HomeCarousel {
  key: string,
  name?: string,
  imageUrl?: string,
}

const DATA: Array<HomeCarousel> = data;
const SPACING = 10;
const ITEM_SIZE = width * 0.7;
const SPACER_ITEM_SIZE = (width - ITEM_SIZE) / 2;

const Backdrops = ({ scrollX }: { scrollX: Animated.Value }) => {
  return (
    <View style={{ position: 'absolute', width, height }}>
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.key}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 2) * ITEM_SIZE,
            (index - 1) * ITEM_SIZE,
          ];
          const translateX = scrollX.interpolate({
            inputRange,
            outputRange: [-width, 0],
          })

          return (
            <MaskedView
              style={{ position: 'absolute' }}
              maskElement={
                <AnimatedSvg
                  width={width}
                  height={height}
                  viewBox={`0 0 ${width} ${height}`}
                  style={{ transform: [{ translateX }] }}
                >
                  <Rect
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    fill={'red'}
                  />
                </AnimatedSvg>
              }
            >
              <Image source={{ uri: item.imageUrl }} style={{ width, height }} resizeMode={'cover'} />
            </MaskedView>
          )
        }}
      />
    </View>
  )
}

export default () => {
  const scrollX = React.useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.main.container}>
      <StatusBar hidden={false} barStyle={'dark-content'} />
      <Backdrops scrollX={scrollX} />
      <Animated.FlatList
        showsHorizontalScrollIndicator={false}
        data={DATA}
        keyExtractor={(item) => item.key}
        horizontal
        snapToInterval={ITEM_SIZE}
        decelerationRate={0}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        contentContainerStyle={{
          alignItems: 'center'
        }}
        renderItem={({ item, index }) => {
          if (!item.imageUrl) {
            return <View style={{ width: SPACER_ITEM_SIZE }} />
          }
          const inputRange = [
            (index - 2) * ITEM_SIZE,
            (index - 1) * ITEM_SIZE,
            (index) * ITEM_SIZE,
          ];
          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [100, 50, 100],
          });

          return (
            <View style={{ width: ITEM_SIZE }}>
              <Animated.View style={{
                marginHorizontal: SPACING,
                padding: SPACING * 2,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 28,
                backgroundColor: 'white',
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 10, },
                shadowOpacity: 0.4,
                shadowRadius: 10,
                height: height * 0.5,
                transform: [{ translateY }]
              }}>
                <Text style={{
                  color: 'black',
                  fontSize: 24,
                  fontWeight: 'bold'
                }}>{item.name}</Text>
              </Animated.View>
            </View>
          )
        }}
      />
    </View>
  )
}

const styles = {
  main: StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    }
  })
}