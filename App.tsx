/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {Component, useState, useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import * as translator from '@parvineyvazov/json-translator';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

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

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function Header({title = '', description = ''}): JSX.Element {
  return (
    <ImageBackground source={require('./assets/icons/header.png')}>
      <View style={headerS.header}>
        <Text style={headerS.headerTitle}>{title}</Text>
        <Text style={headerS.headerDescription}>{description}</Text>
      </View>
    </ImageBackground>
  );
}

function App(): JSX.Element {
  let [news, setNews] = useState({
    status: 'loading',
    data: [{title: '', description: ''}],
  });
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  useEffect(() => {
    (async () => {
      setNews(JSON.parse(await NewsLog()));
    })();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header
          title="ONews"
          description="La actualidad en tus manos rapidamente"
        />
        {news.data.map((item, index) => (
          <View style={newS.card} key={index}>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
const newS = StyleSheet.create({
  card: {
    height: 100,
    width: '100%',
  },
});
const headerS = StyleSheet.create({
  header: {
    flex: 1,
    height: 220,
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
