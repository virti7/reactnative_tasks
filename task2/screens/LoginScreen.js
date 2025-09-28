import React, { useState, useContext } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Dimensions, Alert } from "react-native";
import { UserContext } from "../context/UserContext";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

export default function LoginScreen({ navigation }) {
  const { login } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);

  const handleLogin = () => {
    if (!email.trim()) return Alert.alert("Error", "Enter Email");
    if (!password.trim()) return Alert.alert("Error", "Enter Password");

    const isLoggedIn = login(email, password);
    if (isLoggedIn) navigation.replace("HomeTabs");
    else Alert.alert("Error", "Invalid Email or Password");
  };

  return (
    <LinearGradient colors={["#f8fafc", "#e2e8f0"]} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.formTitle}>Welcome sign in to continue!</Text>

      
        <TextInput
          placeholder="Email address"
          placeholderTextColor="#64748b"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

      
        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#64748b"
            secureTextEntry={secureText}
            style={[styles.input, { flex: 1 }]}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setSecureText(!secureText)}>
            <Ionicons name={secureText ? "eye-off" : "eye"} size={24} color="#64748b" />
          </TouchableOpacity>
        </View>

        
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Sign In</Text>
        </TouchableOpacity>

      
        <TouchableOpacity style={styles.signupLink} onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.signupLinkText}>
            Don't have an account? <Text style={styles.signupLinkBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", 
    alignItems: "center", paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    justifyContent: "center",
  },
  formTitle: {
    fontSize: 21,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1e293b",
    backgroundColor: "#f8fafc",
    marginBottom: 20,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: "#1e293b",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  signupLink: { alignItems: "center" },
  signupLinkText: { fontSize: 14, color: "#64748b" },
  signupLinkBold: { color: "#3b82f6", fontWeight: "600" },
});
