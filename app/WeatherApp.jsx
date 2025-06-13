import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [icon, setIcon] = useState(null);

  const API_KEY = '53cbf6b7bd02a2df9591c91dca9a2b85';

  const getWeatherByCity = async (cityName) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      setWeatherData(data);
      updateBackground(data.weather[0].description);
    } catch (error) {
      console.error(error);
    }
  };

  const getWeatherByLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      setWeatherData(data);
      updateBackground(data.weather[0].description);
    } catch (error) {
      console.error(error);
    }
  };

  const updateBackground = (condition) => {
    if (condition.includes('clear sky')) {
      setIcon({
        uri: 'https://www.clipartmax.com/png/middle/66-662992_weather-clear-sky-weather-symbol.png',
      });
      setBackgroundImage(require('../Images/clearSky.jpg'));
    } else if (
      ['haze', 'fog', 'smog', 'mist', 'smoke'].some((val) =>
        condition.includes(val)
      )
    ) {
      setIcon(require('../Images/haze.png'));
      setBackgroundImage(require('../Images/haze.jpg'));
    } else if (condition.includes('cloudy') || condition.includes('cloud')) {
      setIcon(require('../Images/cloudy.png'));
      setBackgroundImage(require('../Images/cloudy.jpg'));
    }else if (condition.includes('rainy') || condition.includes('rain')) {
      setIcon(require('../Images/Rain1.jpg'));
      setBackgroundImage(require('../Images/rain.jpg'));
    }
     else {
      setIcon(null);
      setBackgroundImage(null);
    }
  };

  useEffect(() => {
    getWeatherByLocation();
  }, []);

  const handleSearch = ({ nativeEvent }) => {
    if (nativeEvent.key === 'Enter' || Platform.OS === 'android') {
      getWeatherByCity(city);
      setCity('');
      Keyboard.dismiss();
    }
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.container}
      resizeMode="cover"
    >
      <TextInput
        placeholder="Enter city"
        value={city}
        onChangeText={setCity}
        onSubmitEditing={handleSearch}
        style={styles.input}
      />

      {icon && <Image source={icon} style={styles.image} />}

      {weatherData && (
        <View style={styles.dataBox}>
          <Text style={styles.text}>🏠 City: {weatherData.name}</Text>
          <Text style={styles.text}>
            🌡️ Temperature: {weatherData.main.temp}°C
          </Text>
          <Text style={styles.text}>💧 Humidity: {weatherData.main.humidity}</Text>
          <Text style={styles.text}>🌤️ Condition: {weatherData.weather[0].description}</Text>
          <Text style={styles.text}>💨 Wind Speed: {weatherData.wind.speed} Kph</Text>
        </View>
      )}
      {weatherData?.main?.temp > 35 &&
  weatherData?.weather?.[0]?.description &&
  !weatherData.weather[0].description.includes('rain') && (
    <Text style={styles.comments}>
      •Too hot? Even the sun is asking for AC!☀️🧊{'\n'}
      •Hydrate or evaporate, your choice.💧😅{'\n'}
      •Stay indoors during peak sun hours🕑☂️{'\n'}
      •Drink plenty of water
    </Text>
)}

{weatherData?.main?.temp < 15 &&
  weatherData?.weather?.[0]?.description &&
  !weatherData.weather[0].description.includes('rain') && (
    <Text style={styles.comments}>
      •"It’s so cold, even my thoughts are frozen!"{'\n'}
      •"Drink warm soups and herbal teas to stay cozy." ☕{'\n'}
      •"Eat foods rich in Vitamin C to boost immunity." 🍊🥦
    </Text>
)}

{weatherData?.main?.temp > 20 &&
  weatherData?.main?.temp < 30 &&
  weatherData?.weather?.[0]?.description &&
  !weatherData.weather[0].description.includes('rain') && (
    <Text style={styles.comments}>
      •"Weather’s so normal, it’s suspicious." 😎🕵️{'\n'}
      •"Nature just pressed the 'Chill' button." 🧘‍♂️🌿{'\n'}
      •"Perfect day for a walk or light jog!" 🏃‍♂️👟
    </Text>
)}

{weatherData?.weather?.[0]?.description?.includes('rain') && (
  <Text style={styles.comments}>
    •"Umbrella: the real MVP today." ☔🏆{'\n'}
    •"Rain rain go away… or at least bring pakoras!" 🍟☔{'\n'}
    •"Avoid street food today – rain and hygiene don’t mix well!" 🚫🍔
  </Text>
)}


     
      

    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    padding: 20,
    backgroundColor: 'rgb(103, 183, 236)',
  },
  input: {
    width: '90%',
    height: 50,
    borderWidth: 2,
    borderColor: 'rgb(209, 228, 227)',
    borderRadius: 25,
    backgroundColor: 'rgb(217, 233, 232)',
    fontSize: 18,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 35,
    marginBottom: 20,
  },
  dataBox: {
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
    padding: 20,
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginVertical: 10,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  comments:{
    fontSize: 18,
    marginTop:5,
    color:'white',
    fontStyle: 'italic',
    textAlign: 'center',

  }
});

export default WeatherApp;
