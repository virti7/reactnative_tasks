import React, { useContext } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FavoritesContext } from '../context/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen() {
  const { favorites, removeFavorite } = useContext(FavoritesContext);

  if (!favorites.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No favorite events yet.</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image || 'https://via.placeholder.com/180x180.png?text=No+Image' }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.details}>{item.date}</Text>
        <Text style={styles.details}>{item.location}</Text>
      </View>
      <TouchableOpacity onPress={() => removeFavorite(item.id)} style={styles.heartButton}>
        <Ionicons name="heart" size={24} color="#FF4D4D" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  emptyText: { color: '#555', fontSize: 18 },
  card: { backgroundColor: '#fff', borderRadius: 14, marginVertical: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
  image: { width: '100%', height: 180 },
  info: { padding: 12 },
  title: { fontSize: 18, fontWeight: '600', color: '#222' },
  details: { fontSize: 14, color: '#666', marginTop: 2 },
  heartButton: { position: 'absolute', top: 12, right: 12 },
});
