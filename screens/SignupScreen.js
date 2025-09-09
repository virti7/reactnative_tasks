import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formOK, setFormOK] = useState(false);
  const [message, setMessage] = useState('')
  ; 

  useEffect(() => {
    const validEmail = email.includes('@') && email.includes('.');
    const validPassword = password.length >= 6;
    setFormOK(validEmail && validPassword);
    setMessage('');
  }, [email, password]);

  const handleSignup = async () => {
    if (!formOK) return;
    setLoading(true);
    setMessage('');

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email.trim().toLowerCase()));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setLoading(false);
        setMessage('Email already exists');
        return;
      }

      await addDoc(usersRef, { email: email.trim().toLowerCase(), password });
      setLoading(false);
      setMessage('Account created successfully!');

      // rerouting here check this
      navigation.replace('Home', { userEmail: email.trim().toLowerCase() });
      
    } catch (error) {
      setLoading(false);
      setMessage('Something went wrong, try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>New User?</Text>

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
            <Text style={{ color: '#3b82f6', fontWeight: '600' }}>
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>

        {message ? <Text style={styles.message}>{message}</Text> : null}

        <TouchableOpacity
          style={[styles.button, (!formOK || loading) && styles.buttonDisabled]}
          onPress={handleSignup}
          disabled={!formOK || loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.signup}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f7fa' },
  card: { width: '85%', padding: 30, borderRadius: 16, backgroundColor: 
    '#fff', elevation: 4 },
  title: { fontSize: 28, fontWeight: '700', color: '#222', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10,
     padding: 12, marginVertical: 8, backgroundColor: '#f9f9f9' },
  button: { backgroundColor: '#001230', padding: 14, 
    borderRadius: 10, alignItems: 'center', marginTop: 15 },
  buttonDisabled: { backgroundColor: '#a5b4fc' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 
    16 },
  linkText: { textAlign: 'center', marginTop: 20,
    fontSize: 14 },
  signup: { color: '#3b82f6', fontWeight:
    '600' },
  message: { textAlign: 'center', color: 'red', marginTop: 5, fontSize: 14 },
});
