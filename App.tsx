/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {Appearance} from 'react-native';
import {
  FlatList,
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
  let keyExtractor = 0;
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

        {news.page.items.map((item, index) => (
          <View style={newS.card} key={index}>
            {item.anteTitle != null ? (
              <Text style={newS.anteTitle}>{item.anteTitle}</Text>
            ) : null}
            {item.image != null ? (
              <Image
                source={{
                  uri: item.image,
                }}
                style={newS.image}
              />
            ) : null}
            <Text style={newS.title}>{item.title}</Text>
          </View>
        ))}
      </ScrollView>
      <FlatList
        data={news.page.items}
        key={keyExtractor}
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
