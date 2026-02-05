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
          headerTintColor: '#d1dcebff', // Tu color de texto
          headerTitleAlign: 'center',
          
          // --- AQUÍ ESTÁ EL TRUCO PARA IOS ---
          headerBackTitleVisible: false, // Oculta el texto
          headerLeftContainerStyle: { paddingLeft: 10 }, // Da espacio a la flecha
          
          headerTitleStyle: { 
            fontWeight: '900', 
            fontSize: 18,
            letterSpacing: 1,
            marginTop: Platform.OS === 'ios' ? 10 : 0 // Ajuste fino para la caída
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
            title: 'Inicio', // Título principal
          }} 
        />
        <Stack.Screen 
          name="Generar" 
          component={GeneratorQRScreen} 
          options={{ 
            title: 'REGISTRAR',
            // Refuerzo por si una pantalla específica se resiste:
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
    backgroundColor:'rgba(0, 0, 0, 0.5)', // Tu color petróleo
    height: Platform.OS === 'ios' ? 130 : 100, 
    borderBottomLeftRadius: 40, 
    borderBottomRightRadius: 40,
    shadowColor: 'rgba(3, 63, 48, 1)', // Tu sombra verde/petróleo
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 15,
  }
});