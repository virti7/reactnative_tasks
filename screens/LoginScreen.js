import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formOK, setFormOK] = useState(false);

  useEffect(() => {
    const isValidEmail = email.includes('@') && email.includes('.');
    const isValidPassword = password.length >= 6;
    setFormOK(isValidEmail && isValidPassword);
  }, [email, password]);

  const handleLogin = async () => {
    if (!formOK) return;
    setLoading(true);

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email.trim().toLowerCase()));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const user = snapshot.docs[0].data();
        if (user.password === password) {
          setLoading(false);
          navigation.replace('Home', { userEmail: email });
        } else {
          setLoading(false);
          Alert.alert('Login Failed', 'Incorrect password');
        }
      } else {
        setLoading(false);
        Alert.alert('Login Failed', 'Email not registered');
      }
    } catch (error) {
      setLoading(false);
      console.log('Firestore error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back!</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <View style={{ position: 'relative' }}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={{ position: 'absolute', right: 12, top: 22 }}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={{ color: '#3b82f6', fontWeight: '600' }}>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.button, (!formOK || loading) && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={!formOK || loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.linkText}>Don't have an account? <Text style={styles.signup}>Sign Up</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f7fa' },
  card: { width: '85%', padding: 30, borderRadius: 16, backgroundColor: '#fff', elevation: 4 },
  title: { fontSize: 28, fontWeight: '700', color: '#222', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 12, marginVertical: 8 },
  button: { backgroundColor: '#001230', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 15 },
  buttonDisabled: { backgroundColor: '#a5b4fc' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  linkText: { textAlign: 'center', marginTop: 20, fontSize: 14 },
  signup: { color: '#3b82f6', fontWeight: '600' },
});
