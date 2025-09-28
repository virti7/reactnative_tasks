import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserContext } from '../context/UserContext';

export default function HomeScreen() {
  const { user } = useContext(UserContext);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {user ? `Welcome, ${user.name}` : 'Welcome!'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#ffffff'
  },
  text:{
    color:'#000000',
    fontSize: 24,
    fontWeight: '600'
  }
});
