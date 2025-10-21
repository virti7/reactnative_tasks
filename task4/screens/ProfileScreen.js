import React, { useContext } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from "react-native";
import { UserContext } from "../context/UserContext";

const { width } = Dimensions.get("window");

export default function ProfileScreen({ navigation }) {
  const { user } = useContext(UserContext);

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noDataText}>No user data</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileCard}>
        {/* Profile Picture */}
        {user.profilePic ? (
          <Image source={{ uri: user.profilePic }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>{user.name ? user.name[0] : "U"}</Text>
          </View>
        )}

        {/* User Info */}
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.info}>{user.email}</Text>
        {user.phone ? <Text style={styles.info}>{user.phone}</Text> : null}

        {/* Edit Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={styles.buttonText}>Edit Profile</Text>
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
  },
  noDataText: {
    fontSize: 18,
    color: "#999",
  },
  profileCard: {
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingVertical: 50,
    paddingHorizontal: 25,
    alignItems: "center",
    borderWidth: 1.5,       // subtle border
    borderColor: "#ddd",    // refreshing soft border color
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 30,
    borderWidth: 3,
    borderColor: "#bbb",    // outline around profile pic
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
  name: {
    fontSize: 22,
    fontWeight: "600",
    color: "#222",
    marginBottom: 12,
    textAlign: "center",
  },
  info: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
    textAlign: "center",
    width: "100%",
  },
  button: {
    marginTop: 30,
    width: "60%",
    paddingVertical: 14,
    backgroundColor: "#333",
    borderRadius: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
