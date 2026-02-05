import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, FlatList, 
  Share, Platform, Alert, Dimensions 
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function ReadQRScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const saved = await AsyncStorage.getItem('@scan_history');
    if (saved) setHistory(JSON.parse(saved));
  };

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned) return;
    setScanned(true);
    
    const newEntry = { 
      id: Date.now().toString(), 
      content: data, 
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };

    const newHistory = [newEntry, ...history];
    setHistory(newHistory);
    await AsyncStorage.setItem('@scan_history', JSON.stringify(newHistory));
  };

  const deleteItem = (id) => {
    Alert.alert(
      "Eliminar", 
      "¿Borrar este registro permanentemente?", 
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Borrar", 
          style: "destructive", 
          onPress: async () => {
            const filtered = history.filter(item => item.id !== id);
            setHistory(filtered);
            await AsyncStorage.setItem('@scan_history', JSON.stringify(filtered));
          } 
        }
      ]
    );
  };

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text style={{color: '#FFF', marginBottom: 20}}>Acceso a cámara requerido</Text>
        <TouchableOpacity style={styles.btnAction} onPress={requestPermission}>
          <Text style={styles.btnActionText}>PERMITIR</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Círculo decorativo de fondo para efecto Glass */}
      <View style={styles.bgGlow} />

      {/* Visor de Cámara con Bordes Ajustados */}
      <View style={styles.scannerWrapper}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
        <View style={styles.scanFrame}>
          {/* Esquinas pegadas al borde 0 con radio coincidente */}
          <View style={[styles.corner, { top: 0, left: 0, borderTopWidth: 6, borderLeftWidth: 6, borderTopLeftRadius: 38 }]} />
          <View style={[styles.corner, { top: 0, right: 0, borderTopWidth: 6, borderRightWidth: 6, borderTopRightRadius: 38 }]} />
          <View style={[styles.corner, { bottom: 0, left: 0, borderBottomWidth: 6, borderLeftWidth: 6, borderBottomLeftRadius: 38 }]} />
          <View style={[styles.corner, { bottom: 0, right: 0, borderBottomWidth: 6, borderRightWidth: 6, borderBottomRightRadius: 38 }]} />
          
          {!scanned && <View style={styles.scanLine} />}
        </View>
      </View>

      {scanned && (
        <TouchableOpacity style={styles.rescanContainer} onPress={() => setScanned(false)}>
          <LinearGradient
            colors={['#05634eff', '#035729ff']}
            style={styles.rescanBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.rescanText}>NUEVO ESCANEO</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      <Text style={styles.sectionTitle}>HISTORIAL DE INVENTARIO</Text>

      <FlatList
        data={history}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.glassCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.dateText}>{item.date}</Text>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => Share.share({ message: item.content })} style={styles.iconBtn}>
                  <Text style={{fontSize: 16}}>📤</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.iconBtn}>
                  <Text style={{fontSize: 16}}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.contentBox}>
              <Text style={styles.itemText}>{item.content}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#071212', paddingTop: 130 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#071212' },
  bgGlow: { position: 'absolute', top: 250, right: -100, width: 300, height: 300, borderRadius: 150, backgroundColor: '#00d2ff', opacity: 0.05 },

  // Visor Estilo Apple Glass
  scannerWrapper: { 
    height: 240, 
    margin: 20, 
    borderRadius: 45, 
    overflow: 'hidden', 
    borderWidth: 1.5, 
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: '#000',
    position: 'relative',
    elevation: 10
  },
  scanFrame: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  corner: { position: 'absolute', width: 60, height: 60, borderColor: '#27b467ff' },
  scanLine: {width: '100%', height: 2, backgroundColor: '#035729ff', opacity: 0.5, marginTop: '25%', shadowColor: '#00d2ff', shadowRadius: 10, shadowOpacity: 1 },

  // Botón Flotante
  rescanContainer: { position: 'absolute', top: 225, alignSelf: 'center', zIndex: 99 },
  rescanBtn: { paddingHorizontal: 25, paddingVertical: 12, borderRadius: 25, shadowColor: '#035729ff', shadowOpacity: 0.4, shadowRadius: 10 },
  rescanText: { color: '#FFF', fontWeight: '900', fontSize: 12, letterSpacing: 1 },

  // Título Sección
  sectionTitle: { color: 'rgba(255, 255, 255, 0.3)', fontSize: 11, fontWeight: '800', marginLeft: 30, marginTop: 35, marginBottom: 15, letterSpacing: 2 },

  // Tarjeta Glassmorphism
  glassCard: { 
    backgroundColor: 'rgba(255, 255, 255, 0.04)', 
    borderRadius: 28, 
    padding: 20, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  dateText: { color: '#0b9b4cff', fontWeight: '800', fontSize: 10 },
  actions: { flexDirection: 'row' },
  iconBtn: { marginLeft: 15, backgroundColor: 'rgba(255,255,255,0.05)', padding: 8, borderRadius: 12 },
  
  contentBox: { backgroundColor: 'rgba(0,0,0,0.2)', padding: 15, borderRadius: 18 },
  itemText: { 
    color: '#E0E0E0', 
    fontSize: 14, 
    lineHeight: 22, 
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' 
  },

  btnAction: { backgroundColor: '#035729ff', padding: 15, borderRadius: 20 },
  btnActionText: { fontWeight: 'bold', color: '#000' }
});