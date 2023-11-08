import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  AsyncStorage,
  StyleSheet,
  FlatList,
} from 'react-native';

const AdminManager = () => {
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseImage, setExerciseImage] = useState('');
  const [data, setData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    // Carregando dados do AsyncStorage
    AsyncStorage.getItem('exercises').then((jsonExercises) => {
      if (jsonExercises) {
        const exercises = JSON.parse(jsonExercises);
        setData(exercises);
      }
    });
  }, []);

  const saveExercise = () => {
    if (exerciseName && (exerciseImage || exerciseImage.includes(';'))) {
      const urls = exerciseImage.split(';').map((url) => url.trim());

      const newExercise = { Name: exerciseName, URLs: urls };
      if (editingIndex !== null) {
        // Editar exercÃ­cio existente
        const updatedData = [...data];
        updatedData[editingIndex] = newExercise;
        setData(updatedData);
        setEditingIndex(null);
      } else {
        // Adicionar novo exercÃ­cio
        setData([...data, newExercise]);
      }

      // Salvando dados no AsyncStorage
      AsyncStorage.setItem('exercises', JSON.stringify([...data, newExercise]));

      // Limpar os campos
      setExerciseName('');
      setExerciseImage('');
    }
  };

  const deleteExercise = (index) => {
    const updatedData = [...data];
    updatedData.splice(index, 1);
    setData(updatedData);

    // Salvando dados no AsyncStorage apÃ³s exclusÃ£o
    AsyncStorage.setItem('exercises', JSON.stringify(updatedData));
  };

  const editExercise = (index) => {
    const exercise = data[index];
    setExerciseName(exercise.Name);
    setExerciseImage(exercise.URLs.join(';'));
    setEditingIndex(index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciamento de ExercÃ­cios</Text>
      <TextInput
        placeholder="Nome do ExercÃ­cio"
        style={styles.input}
        value={exerciseName}
        onChangeText={(text) => setExerciseName(text)}
      />
      <TextInput
        placeholder="URL da(s) Imagem(ns)"
        style={styles.input}
        value={exerciseImage}
        onChangeText={(text) => setExerciseImage(text)}
      />
      <TouchableOpacity style={styles.addButton} onPress={saveExercise}>
        <Text style={styles.buttonText}>
          {editingIndex !== null ? 'Editar' : 'Adicionar'}
        </Text>
      </TouchableOpacity>
      <FlatList
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.listItem}>
            {item.URLs.map((url, urlIndex) => (
              <Image key={urlIndex} source={{ uri: url }} style={styles.image} />
            ))}
            <Text style={styles.exerciseName}>{item.Name}</Text>
            <TouchableOpacity onPress={() => deleteExercise(index)}>
              <Text style={styles.deleteText}>Excluir</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => editExercise(index)}>
              <Text style={styles.editText}>Editar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  addButton: {
    backgroundColor: '#007BFF',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  exerciseName: {
    flex: 1,
    fontSize: 18,
  },
  deleteText: {
    color: 'red',
    marginRight: 10,
  },
  editText: {
    color: 'blue',
  },
});

export default AdminManager;
