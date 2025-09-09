import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formOK, setFormOK] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (email.length === 0) {
      setEmailError('');
    } else if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Enter a valid email (example@domain.com)');
    } else {
      setEmailError('');
    }

    if (password.length === 0) {
      setPasswordError('');
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }

    setFormOK(
      email.includes('@') && email.includes('.') && password.length >= 6
    );
  }, [email, password]);

  const handleLogin = () => {
    if (!formOK) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Home', { userEmail: email });
    }, 2500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>New User?</Text>
        <Text style={styles.subtitle}>Please Signup to continue</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

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
        {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

        <TouchableOpacity
          style={[styles.button, (!formOK || loading) && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={!formOK || loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.linkText}>
            Don't have an account? <Text style={styles.signup}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f7fa' },
  card: { width: '85%', padding: 30, borderRadius: 16, backgroundColor: '#fff', elevation: 4 },
  title: { fontSize: 28, fontWeight: '700', color: '#222', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#555', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 12, marginVertical: 8, backgroundColor: '#f9f9f9' },
  button: { backgroundColor: '#3b82f6', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 15 },
  buttonDisabled: { backgroundColor: '#a5b4fc' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  error: { color: 'red', fontSize: 12, marginBottom: 4 },
  linkText: { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#555' },
  signup: { color: '#3b82f6', fontWeight: '600' },
});
