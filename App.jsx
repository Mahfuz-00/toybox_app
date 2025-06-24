import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import FavoritesScreen from './src/screens/FavoritesScreen';

const Stack = createStackNavigator();
const API_URL = 'http://10.0.2.2:3000'; // Use 192.168.0.138:3000 if 10.0.2.2 fails

const ToyListScreen = ({ navigation }) => {
  const [toys, setToys] = useState([]);
  const [toyName, setToyName] = useState('');
  const [editId, setEditId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchToys();
    loadFavorites();
  }, []);

  const fetchToys = async () => {
    try {
      const response = await axios.get(`${API_URL}/toys`);
      setToys(response.data);
      console.log('Fetched toys:', response.data);
    } catch (error) {
      console.error('Error fetching toys:', error.message, error.config);
      Alert.alert('Error', 'Failed to fetch toys');
    }
  };

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = async (id) => {
    let updatedFavorites;
    if (favorites.includes(id)) {
      updatedFavorites = favorites.filter((favId) => favId !== id);
    } else {
      updatedFavorites = [...favorites, id];
    }
    setFavorites(updatedFavorites);
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      console.log('Favorites updated:', updatedFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const addToy = async () => {
    if (toyName.trim() === '') {
      Alert.alert('Error', 'Please enter a toy name');
      return;
    }
    try {
      if (editId) {
        await axios.put(`${API_URL}/toys/${editId}`, { name: toyName });
        console.log('Updated toy:', editId, toyName);
        setEditId(null);
      } else {
        await axios.post(`${API_URL}/toys`, { name: toyName });
        console.log('Added toy:', toyName);
      }
      setToyName('');
      setModalVisible(false);
      fetchToys();
    } catch (error) {
      console.error('Error adding/updating toy:', error.message, error.config);
      Alert.alert('Error', 'Failed to add/update toy');
    }
  };

  const editToy = (id, name) => {
    setEditId(id);
    setToyName(name);
    setModalVisible(true);
  };

  const deleteToy = async (id) => {
    try {
      await axios.delete(`${API_URL}/toys/${id}`);
      console.log('Deleted toy:', id);
      setFavorites(favorites.filter((favId) => favId !== id));
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites.filter((favId) => favId !== id)));
      fetchToys();
    } catch (error) {
      console.error('Error deleting toy:', error.message, error.config);
      Alert.alert('Error', 'Failed to delete toy');
    }
  };

  const getToyImage = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('bear')) {
      return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c';
    } else if (lowerName.includes('car')) {
      return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c';
    } else {
      return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'; // Default toy image
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Toy Box</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add New Toy</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.favButton}
        onPress={() => navigation.navigate('Favorites', { favorites, toys })}
      >
        <Text style={styles.addButtonText}>View Favorites</Text>
      </TouchableOpacity>
      <FlatList
        data={toys}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.toyItem}>
            <Image
              source={{ uri: getToyImage(item.name) }}
              style={styles.toyImage}
            />
            <Text style={styles.toyText}>{item.name}</Text>
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => editToy(item.id, item.name)}
              >
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => deleteToy(item.id)}
              >
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  favorites.includes(item.id) && styles.favButtonActive,
                ]}
                onPress={() => toggleFavorite(item.id)}
              >
                <Text style={styles.actionButtonText}>
                  {favorites.includes(item.id) ? 'Unfavorite' : 'Favorite'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              {editId ? 'Edit Toy' : 'Add Toy'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter toy name"
              value={toyName}
              onChangeText={setToyName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={addToy}
              >
                <Text style={styles.modalButtonText}>
                  {editId ? 'Update' : 'Add'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setToyName('');
                  setEditId(null);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ToyList">
        <Stack.Screen name="ToyList" component={ToyListScreen} options={{ title: 'My Toy Box' }} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favorite Toys' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  addButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  favButton: {
    backgroundColor: '#03dac6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
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
  toyText: { fontSize: 18, flex: 1, color: '#333' },
  buttons: { flexDirection: 'row', gap: 10 },
  actionButton: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
  },
  favButtonActive: { backgroundColor: '#ff4081' },
  actionButtonText: { color: '#fff', fontSize: 14 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    width: '100%',
    borderRadius: 5,
    marginBottom: 15,
  },
  modalButtons: { flexDirection: 'row', gap: 10 },
  modalButton: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: { color: '#fff', fontSize: 16 },
});

export default App;