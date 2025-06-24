import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const FavoritesScreen = ({ route }) => {
  const { favorites, toys } = route.params;
  const favoriteToys = toys.filter((toy) => favorites.includes(toy.id));

  const getToyImage = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('bear')) {
      return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c';
    } else if (lowerName.includes('car')) {
      return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c';
    } else {
      return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Toys</Text>
      {favoriteToys.length === 0 ? (
        <Text style={styles.emptyText}>No favorite toys yet!</Text>
      ) : (
        <FlatList
          data={favoriteToys}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.toyItem}>
              <Image
                source={{ uri: getToyImage(item.name) }}
                style={styles.toyImage}
              />
              <Text style={styles.toyText}>{item.name}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  toyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
  },
  toyImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  toyText: { fontSize: 18, color: '#333' },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 20 },
});

export default FavoritesScreen;
