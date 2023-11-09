import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ScrollView,
  CheckBox,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminStudents() {
  const [studentName, setStudentName] = useState('');
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseImagesInput, setExerciseImagesInput] = useState('');
  const [studentsAndExercises, setStudentsAndExercises] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);

  useEffect(() => {
    // Carregar os dados salvos no AsyncStorage
    const loadStudentsAndExercises = async () => {
      try {
        const data = await AsyncStorage.getItem('exercises');
        if (data) {
          const parsedData = JSON.parse(data);
          setStudentsAndExercises(parsedData);
        }
      } catch (error) {
        console.error('Erro ao carregar os dados do AsyncStorage', error);
      }
    };

    loadStudentsAndExercises();
  }, []);

  const saveStudentsAndExercises = async (data) => {
    try {
      await AsyncStorage.setItem('exercises', JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar os dados no AsyncStorage', error);
    }
  };

  const addStudentAndExercise = () => {
    if (studentName && exerciseName && exerciseImagesInput) {
      const exerciseImages = exerciseImagesInput.split(';').map((url) => url.trim());
      const studentAndExercise = {
        studentName,
        exerciseName,
        exerciseImages,
      };
      if (editIndex === -1) {
        setStudentsAndExercises([...studentsAndExercises, studentAndExercise]);
      } else {
        studentsAndExercises[editIndex] = studentAndExercise;
        setEditIndex(-1);
      }

      // Limpar os campos
      setStudentName('');
      setExerciseName('');
      setExerciseImagesInput('');
      setSelectedImages([]);
    }
    saveStudentsAndExercises(studentsAndExercises);
  };

  const editStudentAndExercise = (index) => {
    const { studentName, exerciseName, exerciseImages } = studentsAndExercises[index];
    setStudentName(studentName);
    setExerciseName(exerciseName);
    setExerciseImagesInput(exerciseImages.join(';'));
    setEditIndex(index);
  };

  const deleteStudentAndExercise = (index) => {
    const updatedData = [...studentsAndExercises];
    updatedData.splice(index, 1);
    setStudentsAndExercises(updatedData);
    setEditIndex(-1);
    saveStudentsAndExercises(updatedData);
  };

  return (

    <>
    <ScrollView style={{ padding: 20 }}>
      <Text>Gerenciamento de Alunos e Exercícios</Text>
      <TextInput
        placeholder="Nome do Aluno"
        value={studentName}
        onChangeText={(text) => setStudentName(text)}
      />
      <TextInput
        placeholder="Nome do Exercício"
        value={exerciseName}
        onChangeText={(text) => setExerciseName(text)}
      />
      <TextInput
        placeholder="Imagens do Exercício (URLs separadas por ponto e vírgula)"
        value={exerciseImagesInput}
        onChangeText={(text) => setExerciseImagesInput(text)}
      />
      <Button
        title={editIndex === -1 ? 'Adicionar Aluno e Exercício' : 'Editar Aluno e Exercício'}
        onPress={addStudentAndExercise}
      />

      {studentsAndExercises.map((item, index) => (
        <View key={index} style={{ marginTop: 10 }}>
          <Text>Aluno: {item.studentName}</Text>
          <Text>Exercício(s)/Sessão: {item.exerciseName}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {item.exerciseImages.map((image, imgIndex) => (
              <View key={imgIndex} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                <CheckBox
                  value={selectedImages.includes(image)}
                  onValueChange={() => {
                    if (selectedImages.includes(image)) {
                      setSelectedImages(selectedImages.filter((img) => img !== image));
                    } else {
                      setSelectedImages([...selectedImages, image]);
                    }
                  }}
                />
                <Image
                  source={{ uri: image }}
                  style={{ width: 100, height: 100, marginRight: 10 }}
                />
              </View>
            ))}
          </View>
          <Button title="Editar" style={{  AnimationEffect: 10 }} onPress={() => editStudentAndExercise(index)} />
          <Button title="Excluir" value={index} onPress={() => deleteStudentAndExercise(index)} />
        </View>
      ))}
    </ScrollView>
    </>
  );
}

