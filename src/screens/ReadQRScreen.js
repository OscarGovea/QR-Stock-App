import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Share, 
  Platform, 
  Alert, 
  Dimensions, 
  Animated, 
  Easing,
  TextInput 
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system/legacy'; 
import * as Sharing from 'expo-sharing';

const { width } = Dimensions.get('window');

export default function ReadQRScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (!scanned && permission?.granted) {
      startAnimation();
    } else {
      translateY.stopAnimation();
    }
  }, [scanned, permission]);

  const startAnimation = () => {
    translateY.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: 210,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

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
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };

    const newHistory = [newEntry, ...history];
    setHistory(newHistory);
    await AsyncStorage.setItem('@scan_history', JSON.stringify(newHistory));
  };

  // FUNCIÓN DE EXPORTACIÓN CSV CORREGIDA
  const exportToCSV = async () => {
    if (history.length === 0) {
      Alert.alert("Atención", "No hay datos para exportar");
      return;
    }

    try {
      const header = "ID,Fecha,Hora,Contenido\n";
      const rows = history.map(item => 
        `${item.id},${item.date},${item.time},"${String(item.content).replace(/"/g, '""')}"`
      ).join("\n");
      
      const csvContent = header + rows;
      const fileName = `Inventario_${Date.now()}.csv`;
      const fileUri = FileSystem.cacheDirectory + fileName;
      
      await FileSystem.writeAsStringAsync(fileUri, csvContent, { 
        encoding: 'utf8' 
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Exportar Inventario',
          UTI: 'public.comma-separated-values-text'
        });
      } else {
        Alert.alert("Error", "Compartir no está disponible");
      }
    } catch (error) {
      console.error("Error al exportar:", error);
      Alert.alert("Error", "No se pudo generar el archivo. Intenta reiniciar la app.");
    }
  };

  const deleteItem = (id) => {
    Alert.alert("Eliminar", "¿Borrar este registro del historial?", [
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
    ]);
  };

  const filteredHistory = history.filter(item => 
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text style={{color: '#FFF', marginBottom: 20, textAlign: 'center'}}>Se necesita permiso de cámara para escanear</Text>
        <TouchableOpacity style={styles.btnPermitir} onPress={requestPermission}>
          <Text style={styles.btnPermitirText}>OTORGAR PERMISO</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.bgGlow} />

      <View style={styles.scannerWrapper}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
        <View style={styles.scanFrame}>
          <View style={[styles.corner, { top: 0, left: 0, borderTopWidth: 6, borderLeftWidth: 6, borderTopLeftRadius: 38 }]} />
          <View style={[styles.corner, { top: 0, right: 0, borderTopWidth: 6, borderRightWidth: 6, borderTopRightRadius: 38 }]} />
          <View style={[styles.corner, { bottom: 0, left: 0, borderBottomWidth: 6, borderLeftWidth: 6, borderBottomLeftRadius: 38 }]} />
          <View style={[styles.corner, { bottom: 0, right: 0, borderBottomWidth: 6, borderRightWidth: 6, borderBottomRightRadius: 38 }]} />
          
          {!scanned && (
            <Animated.View style={[styles.scanLineContainer, { transform: [{ translateY: translateY }] }]}>
              <LinearGradient colors={['transparent', '#05f105ff', 'transparent']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.neonLine} />
              <View style={styles.whiteCore} />
            </Animated.View>
          )}
        </View>
      </View>

      {scanned && (
        <TouchableOpacity style={styles.rescanContainer} onPress={() => setScanned(false)}>
          <LinearGradient colors={['#05634eff', '#035729ff']} style={styles.rescanBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.rescanText}>NUEVO ESCANEO</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      <View style={styles.actionRow}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.03)']}
          style={styles.searchBar}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar en historial..."
            placeholderTextColor="rgba(255, 255, 255, 0.3)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </LinearGradient>

        <TouchableOpacity onPress={exportToCSV}>
          <LinearGradient colors={['#05634eff', '#035729ff']} style={styles.exportBtn}>
            <Text style={styles.exportIcon}>📄</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>HISTORIAL RECIENTE</Text>

      <FlatList
        data={filteredHistory}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay registros guardados</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.glassCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.dateText}>{item.date} • {item.time}</Text>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => Share.share({ message: item.content })} style={styles.iconBtn}>
                  <Text style={{fontSize: 14}}>📤</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.iconBtn}>
                  <Text style={{fontSize: 14}}>🗑️</Text>
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#071212', padding: 20 },
  bgGlow: { position: 'absolute', top: 250, right: -100, width: 300, height: 300, borderRadius: 150, backgroundColor: '#0b9b4cff', opacity: 0.05 },

  scannerWrapper: { height: 240, marginHorizontal: 25, borderRadius: 45, overflow: 'hidden', borderWidth: 1.5, borderColor: 'rgba(255, 255, 255, 0.1)', backgroundColor: '#000' },
  scanFrame: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  corner: { position: 'absolute', width: 60, height: 60, borderColor: '#27b467ff' },
  
  scanLineContainer: { width: '100%', height: 20, alignItems: 'center', justifyContent: 'center' },
  neonLine: { width: '100%', height: 8, borderRadius: 2, shadowColor: '#00ff6aff', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 30, elevation: 20 },
  whiteCore: { position: 'absolute', width: '100%', height: 1.5, backgroundColor: '#00ff6aff', opacity: 0.8 },

  actionRow: { flexDirection: 'row', paddingHorizontal: 25, marginTop: 25, gap: 12 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', height: 55, borderRadius: 20, paddingHorizontal: 15, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.12)' },
  searchIcon: { marginRight: 10, fontSize: 16 },
  searchInput: { flex: 1, color: '#FFF', fontSize: 14 },
  
  exportBtn: { width: 55, height: 55, borderRadius: 20, justifyContent: 'center', alignItems: 'center', shadowColor: '#00ff6aff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  exportIcon: { fontSize: 20 },

  rescanContainer: { position: 'absolute', top: 225, alignSelf: 'center', zIndex: 99 },
  rescanBtn: { paddingHorizontal: 25, paddingVertical: 12, borderRadius: 25 },
  rescanText: { color: '#FFF', fontWeight: '900', fontSize: 12 },

  sectionTitle: { color: 'rgba(255, 255, 255, 0.3)', fontSize: 11, fontWeight: '800', marginLeft: 30, marginTop: 25, marginBottom: 15, letterSpacing: 2 },
  emptyText: { color: 'rgba(255, 255, 255, 0.2)', textAlign: 'center', marginTop: 20 },

  glassCard: { backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: 28, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.12)' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  dateText: { color: '#0b9b4cff', fontWeight: '800', fontSize: 10 },
  actions: { flexDirection: 'row' },
  iconBtn: { marginLeft: 10, backgroundColor: 'rgba(255,255,255,0.05)', padding: 8, borderRadius: 12 },
  contentBox: { backgroundColor: 'rgba(0,0,0,0.2)', padding: 15, borderRadius: 18 },
  itemText: { color: '#E0E0E0', fontSize: 13, lineHeight: 18, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  btnPermitir: { backgroundColor: '#05634eff', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 20 },
  btnPermitirText: { fontWeight: 'bold', color: '#FFF' }
});