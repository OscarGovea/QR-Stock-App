import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Asegúrate de tener expo-linear-gradient instalado

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Círculos decorativos para el efecto Glass detrás */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <Text style={styles.logo}>QR<Text style={{color: '#059abbff'}}>STOCK</Text></Text>
      
      <TouchableOpacity 
        style={styles.glassCard} 
        onPress={() => navigation.navigate('Generar')}
      >
        <View style={[styles.iconCircle, {backgroundColor: 'rgba(0, 210, 255, 0.2)'}]}><Text style={styles.icon}>+</Text></View>
        <View>
          <Text style={styles.cardTitle}>Generar QR</Text>
          <Text style={styles.cardSub}>Registrar nuevo inventario</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.glassCard} 
        onPress={() => navigation.navigate('Escanear')}
      >
        <View style={[styles.iconCircle, {backgroundColor: 'rgba(0, 210, 255, 0.2)'}]}><Text style={styles.icon}>🔍</Text></View>
        <View>
          <Text style={styles.cardTitle}>Lector QR</Text>
          <Text style={styles.cardSub}>Escanear y consultar ítems</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#071212', justifyContent: 'center', alignItems: 'center' },
  circle1: { position: 'absolute', top: 100, right: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: '#00d2ff', opacity: 0.2 },
  circle2: { position: 'absolute', bottom: 100, left: -50, width: 250, height: 250, borderRadius: 125, backgroundColor: '#00ffa3', opacity: 0.1 },
  logo: { fontSize: 32, fontWeight: '900', color: '#FFF', marginBottom: 50, letterSpacing: 2 },
  glassCard: {
    width: width * 0.85,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255, 255, 255, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  icon: { fontSize: 20, color: '#f5f5f5ff', fontWeight: 'bold' },
  cardTitle: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  cardSub: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 13, marginTop: 2 }
});