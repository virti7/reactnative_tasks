import React, { useState, useContext } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { UserContext } from "../context/UserContext";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function SignupScreen({ navigation }) {
  const { signup } = useContext(UserContext);

  const [Form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: null,
    contactNo: ""
  });

  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  const pickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) return alert("Kindly grant permission to gallery to pick an image");

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!res.canceled) {
      setForm({ ...Form, profilePic: res.assets[0].uri });
    }
  };

  const handleSignup = () => {
    if (!Form.name.trim()) return alert("Enter Name");
    if (!Form.email.trim()) return alert("Enter Email");
    if (Form.password.length < 6) return alert("Password should be at least 6 characters");
    if (Form.password !== Form.confirmPassword) return alert("Passwords do not match");
    if (Form.contactNo.length < 10) return alert("Enter a valid contact number");

    signup({
      name: Form.name,
      email: Form.email,
      password: Form.password,
      profilePic: Form.profilePic,
      contactNo: Form.contactNo,
    });

    Alert.alert("Success", "Account created successfully!", [
      { text: "OK", onPress: () => navigation.navigate("Login") }
    ]);

    setForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      profilePic: null,
      contactNo: ""
    });
  };

  return (
    <LinearGradient colors={["#f8fafc", "#e2e8f0"]} style={styles.container}>
      <View style={styles.logoContainer}></View>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Create Account</Text>

        {/* Profile Picture */}
        <View style={styles.profileSection}>
          {Form.profilePic ? (
            <Image source={{ uri: Form.profilePic }} style={styles.profileImage} />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Text style={styles.profilePlaceholderText}>📷</Text>
            </View>
          )}
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Text style={styles.imageButtonText}>
              {Form.profilePic ? "Change Photo" : "Add Photo"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#64748b"
          style={[styles.input, { marginBottom: 20 }]}
          value={Form.name}
          onChangeText={(text) => setForm({ ...Form, name: text })}
        />
        <TextInput
          placeholder="Email address"
          placeholderTextColor="#64748b"
          style={[styles.input, { marginBottom: 20 }]}
          value={Form.email}
          onChangeText={(text) => setForm({ ...Form, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Contact Number"
          placeholderTextColor="#64748b"
          style={[styles.input, { marginBottom: 20 }]}
          value={Form.contactNo}
          onChangeText={(text) => setForm({ ...Form, contactNo: text })}
          keyboardType="phone-pad"
        />

        {/* Password Input with inline eye */}
        <View style={[styles.inputWrapper, { marginBottom: 20 }]}>
          <TextInput
            placeholder="Password (min 6 characters)"
            placeholderTextColor="#64748b"
            secureTextEntry={showPassword}
            style={styles.input}
            value={Form.password}
            onChangeText={(text) => setForm({ ...Form, password: text })}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#64748b" />
          </TouchableOpacity>
        </View>

        <View style={[styles.inputWrapper, { marginBottom: 25 }]}>
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#64748b"
            secureTextEntry={showConfirmPassword}
            style={styles.input}
            value={Form.confirmPassword}
            onChangeText={(text) => setForm({ ...Form, confirmPassword: text })}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={22} color="#64748b" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginLinkText}>
            Already have account?<Text style={styles.loginLinkBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 50 },
  logoContainer: { alignItems: "center", marginBottom: 30 },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#c3c3c3ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    flex: 1,
  },
  formTitle: { fontSize: 20, fontWeight: "600", color: "#1e293b", marginBottom: 20, textAlign: "center" },
  profileSection: { alignItems: "center", marginBottom: 30 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 12, borderWidth: 3, borderColor: "#e2e8f0" },
  profilePlaceholder: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: "#f1f5f9",
    borderWidth: 2, borderColor: "#e2e8f0", borderStyle: "dashed",
    justifyContent: "center", alignItems: "center", marginBottom: 12,
  },
  profilePlaceholderText: { fontSize: 30, color: "#94a3b8" },
  imageButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "#f1f5f9", borderWidth: 1, borderColor: "#e2e8f0" },
  imageButtonText: { color: "#475569", fontSize: 14, fontWeight: "500" },
  inputWrapper: { position: "relative" },
  input: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: "#1e293b", backgroundColor: "#f8fafc" },
  eyeIcon: { position: "absolute", right: 12, top: 14 },
  signupButton: { backgroundColor: "#1e293b", borderRadius: 8, paddingVertical: 16, alignItems: "center", marginTop: 8, marginBottom: 20 },
  signupButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
  loginLink: { alignItems: "center", marginBottom: 20 },
  loginLinkText: { fontSize: 14, color: "#64748b" },
  loginLinkBold: { color: "#012446ff", fontWeight: "600" },
});