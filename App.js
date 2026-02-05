import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './src/screens/HomeScreen';
import GeneratorQRScreen from './src/screens/GeneratorQRScreen';
import ReadQRScreen from './src/screens/ReadQRScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{ 
          headerTransparent: true, 
          headerTintColor: '#d1dcebff', 
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
          headerLeftContainerStyle: { paddingLeft: 10, paddingTop: Platform.OS === 'ios' ? 28 : 0 },
          
          headerTitleStyle: { 
            fontWeight: '900', 
            fontSize: 18,
            letterSpacing: 1,
            marginTop: Platform.OS === 'ios' ? 20 : 0
          },

          headerBackground: () => (
            <View style={styles.customHeaderDrop} />
          ),
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            title: 'Inicio', 
          }} 
        />
        <Stack.Screen 
          name="Generar" 
          component={GeneratorQRScreen} 
          options={{ 
            title: 'REGISTRAR',
            headerBackTitle: '', 
          }} 
        />
        <Stack.Screen 
          name="Escanear" 
          component={ReadQRScreen} 
          options={{ 
            title: 'LECTOR',
            headerBackTitle: '', 
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  customHeaderDrop: {
    backgroundColor:'rgba(0, 0, 0, 0.5)',
    height: Platform.OS === 'ios' ? 130 : 100, 
    borderBottomLeftRadius: 40, 
    borderBottomRightRadius: 40,
    shadowColor: 'rgba(3, 63, 48, 1)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 15,
  }
});