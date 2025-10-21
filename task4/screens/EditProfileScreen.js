import React, { useContext, useState } from "react";
import { View, TextInput, Image, TouchableOpacity, StyleSheet, Text, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { UserContext } from "../context/UserContext";

export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useContext(UserContext);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.contactNo || "");

  const [profilePic, setProfilePic] = useState(user.profilePic);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      alert("Name and Email cannot be empty");
      return;
    }
   updateProfile({ name, email, profilePic, contactNo: phone });

    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
       
        <TouchableOpacity onPress={pickImage}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>{name ? name[0] : "U"}</Text>
            </View>
          )}
        </TouchableOpacity>

      
        <TextInput
          value={name}
          placeholder="Full Name"
          placeholderTextColor="#999"
          style={styles.input}
          onChangeText={setName}
        />
        <TextInput
          value={email}
          placeholder="Email"
          placeholderTextColor="#999"
          style={styles.input}
          keyboardType="email-address"
          onChangeText={setEmail}
        />
        <TextInput
          value={phone}
          placeholder="Phone Number"
          placeholderTextColor="#999"
          style={styles.input}
          keyboardType="phone-pad"
          onChangeText={setPhone}
        />

        
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#ffffffff",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingVertical: 50,
    paddingHorizontal: 25,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#bebebeff", 
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 30,
    borderWidth: 3,
    borderColor: "#bbb",
  },
  placeholder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 3,
    borderColor: "#bbb",
  },
  placeholderText: {
    fontSize: 50,
    color: "#999",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fafafa",
  },
  button: {
    marginTop: 25,
    width: "80%",
    paddingVertical: 14,
    backgroundColor: "#222",
    borderRadius: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
