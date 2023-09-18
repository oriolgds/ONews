/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect, useRef} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Animated,
  Appearance,
} from 'react-native';

const NewsLog = async (): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const url = 'https://www.rtve.es/api/noticias';
    const options = {
      method: 'GET',
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      console.log(result);
      resolve(result);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

let headerAnim: {height: any; opacity: any};
function Header({title = '', description = ''}): JSX.Element {
  return (
    <ImageBackground source={require('./assets/icons/header.png')}>
      <Animated.View
        style={{
          ...headerS.header,
          height: headerAnim.height,
          opacity: headerAnim.opacity,
        }}>
        <Text style={headerS.headerTitle}>{title}</Text>
        <Text style={headerS.headerDescription}>{description}</Text>
      </Animated.View>
    </ImageBackground>
  );
}

function App(): JSX.Element {
  let [news, setNews] = useState({
    status: 'loading',
    page: {
      items: [
        {
          anteTitle: null,
          title: null,
          image: null,
          id: null,
        },
      ],
    },
  });
  const colorScheme = Appearance.getColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#212121' : '#fff',
  };
  useEffect(() => {
    (async () => {
      setNews(JSON.parse(await NewsLog()));
    })();
  }, []);
  let keyExtractor = 1;
  headerAnim = {
    height: useRef(new Animated.Value(200)).current,
    opacity: useRef(new Animated.Value(1)).current,
  };
  function flatListOnScroll(e: {nativeEvent: {contentOffset: {y: number}}}) {
    if (e.nativeEvent.contentOffset.y > 30) {
      // Hiding header
      Animated.timing(headerAnim.height, {
        toValue: 50,
        duration: 100,
        useNativeDriver: false,
      }).start();
      Animated.timing(headerAnim.opacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }).start();
    } else {
      // Showing header
      Animated.timing(headerAnim.height, {
        toValue: 200,
        duration: 100,
        useNativeDriver: false,
      }).start();
      Animated.timing(headerAnim.opacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }
  }

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <FlatList
        initialNumToRender={3}
        data={news.page.items}
        key={keyExtractor}
        ListHeaderComponent={
          <Header
            title="ONews"
            description="La actualidad en tus manos rapidamente"
          />
        }
        onScroll={flatListOnScroll}
        renderItem={item => {
          console.log(keyExtractor);
          keyExtractor++;
          return (
            <View style={newS.card}>
              {item.item.anteTitle != null ? (
                <Text style={newS.anteTitle}>{item.item.anteTitle}</Text>
              ) : null}
              {item.item.image != null ? (
                <Image
                  source={{
                    uri: item.item.image,
                  }}
                  style={newS.image}
                />
              ) : null}
              <Text style={newS.title}>{item.item.title}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const newS = StyleSheet.create({
  card: {
    backgroundColor: '#e2e2e2',
    margin: 10,
    padding: 10,
    borderRadius: 20,
  },
  anteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    fontSize: 17,
    textAlign: 'justify',
  },
  image: {
    height: 160,
    borderRadius: 8,
    marginBottom: 5,
  },
});
const headerS = StyleSheet.create({
  header: {
    flex: 1,
    height: 220,
    width: '100%',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 40,
    backgroundColor: '#e2e2e2aa',
    flex: 0,
    width: 160,
    alignSelf: 'center',
    borderRadius: 20,
    color: '#212121',
    marginVertical: 8,
    paddingVertical: 5,
  },
  headerDescription: {
    fontSize: 20,
    backgroundColor: '#e2e2e2aa',
    color: '#333',
    width: 300,
    alignSelf: 'center',
    textAlign: 'center',
    borderRadius: 20,
    paddingVertical: 10,
  },
});

export default App;
