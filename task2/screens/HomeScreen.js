import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { FavoritesContext } from '../context/FavoritesContext';
import { UserContext } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { user } = useContext(UserContext);
  const { addFavorite, removeFavorite, isFavorite } = useContext(FavoritesContext);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('https://68ce624a6dc3f350777ed8ae.mockapi.io/api/events')
      .then(res => setEvents(res.data))
      .catch(() => setError('Failed to fetch events'))
      .finally(() => setLoading(false));
  }, []);

  const toggleFavorite = (event) => {
    isFavorite(event.id) ? removeFavorite(event.id) : addFavorite(event);
  };

  const renderItem = ({ item }) => {
    const imageUrl = item.poster?.startsWith('http') || item.image?.startsWith('http')
      ? (item.poster || item.image)
      : 'https://via.placeholder.com/180x180.png?text=No+Image';

    return (
      <View style={styles.card}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.details}>{item.date}</Text>
          <Text style={styles.details}>{item.location}</Text>
        </View>
        <TouchableOpacity onPress={() => toggleFavorite(item)} style={styles.heartButton}>
          <Ionicons name={isFavorite(item.id) ? 'heart' : 'heart-outline'} size={24} color="#FF4D4D" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>{user ? `Welcome, ${user.name}` : 'Welcome!'}</Text>

      {loading && <ActivityIndicator size="large" color="#1E90FF" style={{ marginTop: 20 }} />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {!loading && !error && (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 20 },
  welcomeText: { fontSize: 26, fontWeight: '700', color: '#222', textAlign: 'center', marginBottom: 15 },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20, fontSize: 16 },
  card: { backgroundColor: '#fff', borderRadius: 14, marginVertical: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
  image: { width: '100%', height: 200 },
  info: { padding: 12 },
  title: { fontSize: 20, fontWeight: '600', color: '#222' },
  details: { fontSize: 14, color: '#666', marginTop: 2 },
  heartButton: { position: 'absolute', top: 12, right: 12 },
});
