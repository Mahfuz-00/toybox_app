import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const App = () => {
  const [toys, setToys] = useState([]);
  const [toyName, setToyName] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchToys();
  }, []);

  const fetchToys = async () => {
    try {
      const response = await axios.get('192.168.1.100');
      setToys(response.data);
    } catch (error) {
      console.error('Error fetching toys:', error);
    }
  };

  const addToy = async () => {
    if (toyName.trim() === '') return;
    try {
      if (editId) {
        await axios.put(`http://192.168.1.100:3000/toys/${editId}`, { name: toyName });
        setEditId(null);
      } else {
        await axios.post('http://192.168.1.100:3000/toys', { name: toyName });
      }
      setToyName('');
      fetchToys();
    } catch (error) {
      console.error('Error adding/updating toy:', error);
    }
  };

  const editToy = (id, name) => {
    setEditId(id);
    setToyName(name);
  };

  const deleteToy = async (id) => {
    try {
      await axios.delete(`http://your-computer-ip:3000/toys/${id}`);
      fetchToys();
    } catch (error) {
      console.error('Error deleting toy:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Toy Box</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter toy name"
        value={toyName}
        onChangeText={setToyName}
      />
      <Button title={editId ? 'Update Toy' : 'Add Toy'} onPress={addToy} />
      <FlatList
        data={toys}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.toyItem}>
            <Text>{item.name}</Text>
            <View style={styles.buttons}>
              <Button title="Edit" onPress={() => editToy(item.id, item.name)} />
              <Button title="Delete" onPress={() => deleteToy(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  toyItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1 },
  buttons: { flexDirection: 'row', gap: 10 },
});

export default App;