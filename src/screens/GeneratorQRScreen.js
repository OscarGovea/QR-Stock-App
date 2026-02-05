import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, KeyboardAvoidingView, Platform, Dimensions 
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function GeneratorQRScreen() {
  const [form, setForm] = useState({ nombre: '', sku: '', cat: '', stock: '', precio: '' });
  const [qrValue, setQrValue] = useState('');

  const handleGenerate = () => {
    if (!form.nombre || !form.sku) {
      alert("Por favor, ingresa al menos el Nombre y SKU");
      return;
    }
    const dataString = `PROD: ${form.nombre}\nSKU: ${form.sku}\nCAT: ${form.cat}\nSTOCK: ${form.stock}\nPRECIO: $${form.precio}`;
    setQrValue(dataString);
  };

  const renderInput = (key, placeholder, icon, keyboard = 'default') => (
    <View style={styles.inputWrapper}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.03)']}
        style={styles.glassInputContainer}
      >
        <Text style={styles.inputIcon}>{icon}</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.3)"
          value={form[key]}
          onChangeText={(val) => setForm({ ...form, [key]: val })}
          keyboardType={keyboard}
        />
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      {/* Fondo decorativo similar al mockup */}
      <View style={styles.glowSpot} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Text style={styles.headerTitle}>Nuevo Item</Text>
          <Text style={styles.headerSub}>Completa los datos para generar el código</Text>

          {renderInput('nombre', 'Nombre del Producto', '🏷️')}
          {renderInput('sku', 'SKU / Referencia', '🆔')}
          
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              {renderInput('cat', 'Categoría', '📁')}
            </View>
            <View style={{ flex: 0.6 }}>
              {renderInput('stock', 'Stock', '📦', 'numeric')}
            </View>
          </View>
          
          {renderInput('precio', 'Precio Unitario', '💵', 'numeric')}

          <TouchableOpacity onPress={handleGenerate} activeOpacity={0.8}>
            <LinearGradient
              colors={['#05634eff', '#035729ff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.mainBtn}
            >
              <Text style={styles.mainBtnText}>GENERAR INVENTARIO</Text>
            </LinearGradient>
          </TouchableOpacity>

          {qrValue ? (
            <View style={styles.qrSection}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.05)']}
                style={styles.qrGlassCard}
              >
                <View style={styles.qrInnerFrame}>
                  <QRCode 
                    value={qrValue} 
                    size={width * 0.45} 
                    color="#00d2ff" 
                    backgroundColor="transparent" 
                  />
                </View>
                <Text style={styles.qrSkuText}>{form.sku}</Text>
              </LinearGradient>
            </View>
          ) : null}
          
          <View style={{ height: 60 }} />
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#071212', paddingTop: 130 },
  scrollContent: { padding: 25 },
  glowSpot: { position: 'absolute', top: -100, left: -100, width: 300, height: 300, borderRadius: 150, backgroundColor: '#00d2ff', opacity: 0.1 },
  
  headerTitle: { color: '#FFF', fontSize: 28, fontWeight: '800', marginBottom: 5 },
  headerSub: { color: 'rgba(255, 255, 255, 0.4)', fontSize: 14, marginBottom: 30 },

  inputWrapper: { marginBottom: 15 },
  glassInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 60,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  inputIcon: { fontSize: 18, marginRight: 12 },
  input: { flex: 1, color: '#FFF', fontSize: 16 },
  row: { flexDirection: 'row' },

  mainBtn: { height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: '#00d2ff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  mainBtnText: { color: '#FFF', fontWeight: '900', letterSpacing: 1 },

  qrSection: { marginTop: 40, alignItems: 'center' },
  qrGlassCard: {
    padding: 25,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'rgba(0, 210, 255, 0.3)',
    alignItems: 'center',
  },
  qrInnerFrame: { padding: 15, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 20 },
  qrSkuText: { color: '#00d2ff', fontWeight: 'bold', marginTop: 15, fontSize: 12, letterSpacing: 2 }
});