import React, { useEffect, useState } from 'react';
import { Button, FlatList, Keyboard, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ToDoItem } from '../interfaces/ToDoItem';
import HapticFeedback from 'react-native-haptic-feedback'; 
import DraggableFlatList from 'react-native-draggable-flatlist';



const ToDoList: React.FC = () => {
  //This is a dummy array, would be replaced with dynamic in a real project.
  const [todoItems, setTodoItems] = useState<ToDoItem[]>([]);

  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');

  const [editingItemId, setEditingItemId] = useState<number | null>(null);


  const handleTitleChange = (text: string) => {
    setNewItemTitle(text);
  };

  const handleDescriptionChange = (text: string) => {
    setNewItemDescription(text);
  };

  const addItem = (title: string, description: string) => {
    if (title && description) {
      const newItem = {
        id: Math.random(),
        title,
        description,
        checked: false,
      };
  
      setTodoItems([...todoItems, newItem]);

      HapticFeedback.trigger('notificationSuccess');
      
      // Clear the input fields
      setNewItemTitle('');
      setNewItemDescription('');
    }
    Keyboard.dismiss(); //improve the UI experience
  };

  const editItem = (itemId: number) => {
    setEditingItemId(itemId);
    const itemToEdit = todoItems.find((item) => item.id === itemId);
    if (itemToEdit) {
      // Set the input fields with the current item's values
      setNewItemTitle(itemToEdit.title);
      setNewItemDescription(itemToEdit.description);
    }
  };

  const saveItemChanges = (itemId: number, newTitle: string, newDescription: string) => {
    // Create a copy of the todoItems array
    const updatedItems = [...todoItems];
  
    // Find the item with the matching ID
    const itemIndex = updatedItems.findIndex((item) => item.id === itemId);
  
    // Update the item's title and description
    updatedItems[itemIndex].title = newTitle;
    updatedItems[itemIndex].description = newDescription;
  
    // Clear the editing state
    setNewItemTitle('');
    setNewItemDescription('');
    setEditingItemId(null);
  
    // Update the state
    setTodoItems(updatedItems);
    
    Keyboard.dismiss();
  };
  

  const deleteItem = (itemId: number) => {
    const updatedItems = todoItems.filter((item) => item.id !== itemId);
    setTodoItems(updatedItems);
    HapticFeedback.trigger('notificationSuccess');
  };

  const renderItem = ({item, drag}: {item: ToDoItem, drag: any}) => (
    <TouchableOpacity style={styles.todoItem} onLongPress={drag}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <Text>{item.description}</Text>
      {/* Edit button */}
      <TouchableOpacity onPress={() => editItem(item.id)}> 
        <Text style={styles.editButton}>Edit</Text>
      </TouchableOpacity>
      {/* Delete button */}
      <TouchableOpacity onPress={() => deleteItem(item.id)}>
        <Text style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView>
      <Text style={styles.header}>
        To Do List
      </Text>

      <TextInput
        style={styles.textInputField}
        placeholder="Title"
        value={newItemTitle}
        onChangeText={handleTitleChange}
      />
      <TextInput
        style={styles.textInputField}
        placeholder="Description"
        value={newItemDescription}
        onChangeText={handleDescriptionChange}
      />
      <Button title={editingItemId === null ? "Add Item" : "Save changes"} onPress={editingItemId === null ? () => addItem(newItemTitle, newItemDescription) : () => saveItemChanges(editingItemId, newItemTitle, newItemDescription)} />
      
      {/* FlatList with all the ToDo items */}
      {todoItems.length === 0 ? (
        <Text style={styles.header}>
          Your to do list is empty - add something!
        </Text>
      ) : (
      <DraggableFlatList
        keyboardShouldPersistTaps={'handled'} //to make sure items can be deleted even with keyboard open
        data={todoItems}
        onDragEnd={({ data }) => setTodoItems(data)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    padding: 10
  },
  todoItem: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  textInputField: {
    height: 50,
    marginBottom: 10,
    borderWidth: 1,
    margin: 10
  },
  deleteButton: {
    color: 'red',
    borderWidth: 1,
    alignSelf: 'center',
    padding: 5
  },
  editButton: {
    color: 'blue',
    borderWidth: 1,
    alignSelf: 'center',
    padding: 5,
    marginBottom: 5
  },
  editForm: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
});

export default ToDoList;