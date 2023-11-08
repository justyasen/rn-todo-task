import React, { useId, useState } from 'react';
import { Button, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import HapticFeedback from 'react-native-haptic-feedback';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ToDoItem } from '../interfaces/ToDoItem';



const ToDoList: React.FC = () => {
  let textInputRef: TextInput | null = null;

  const [todoItems, setTodoItems] = useState<ToDoItem[]>([]);

  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');

  const [editingItemId, setEditingItemId] = useState<string | null>(null);


  const handleTitleChange = (text: string) => {
    setNewItemTitle(text);
  };

  const handleDescriptionChange = (text: string) => {
    setNewItemDescription(text);
  };

  const addItem = (title: string, description: string) => {
    if (title && description) {
      const uniqueItemId = title.slice(0, 2) + description.slice(0, 2) + Math.random();
      const newItem = {
        id: uniqueItemId,
        title,
        description,
      };
  
      setTodoItems([...todoItems, newItem]);

      HapticFeedback.trigger('notificationSuccess');
      
      // Clear the input fields
      setNewItemTitle('');
      setNewItemDescription('');
    }
    Keyboard.dismiss(); //improve the UI experience
  };

  const editItem = (itemId: string) => {
    setEditingItemId(itemId);
    const itemToEdit = todoItems.find((item) => item.id === itemId);
    if (itemToEdit) {
      // Set the input fields with the current item's values
      setNewItemTitle(itemToEdit.title);
      setNewItemDescription(itemToEdit.description);
    }
  };

  const saveItemChanges = (itemId: string, newTitle: string, newDescription: string) => {
    // Create a copy of the todoItems array
    const updatedItems = [...todoItems];
  
    // Find the item with the matching ID
    const itemIndex = updatedItems.findIndex((item) => item.id === itemId);
    // Update the item's title and description
    updatedItems[itemIndex].title = newTitle;
    updatedItems[itemIndex].description = newDescription;
    // Update the state
    setTodoItems(updatedItems);
    // Clear the editing state
    setNewItemTitle('');
    setNewItemDescription('');
    setEditingItemId(null);
    Keyboard.dismiss();
  };
  

  const deleteItem = (itemId: string) => {
    const updatedItems = todoItems.filter((item) => item.id !== itemId);
    setTodoItems(updatedItems);
    HapticFeedback.trigger('notificationSuccess');
  };

  const renderItem = ({item, drag}: {item: ToDoItem, drag: any}) => {
    return (
      <TouchableOpacity style={styles.todoItem} onLongPress={drag}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <Text>{item.description}</Text>
        {/* Edit button */}
        <TouchableOpacity onPress={() => {editItem(item.id); textInputRef?.focus();}}> 
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
        {/* Delete button */}
        <TouchableOpacity onPress={() => deleteItem(item.id)}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    )
  };
  
  return (
    <SafeAreaView>
      <Text style={styles.header}>
        To Do List
      </Text>

      <TextInput
        ref={(ref) => (textInputRef = ref)}
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
      <Button 
        title={editingItemId === null ? "Add Item" : "Save changes"} 
        onPress={editingItemId === null ? () => addItem(newItemTitle, newItemDescription) : () => saveItemChanges(editingItemId, newItemTitle, newItemDescription)} 
      />
      
      {/* FlatList with all the ToDo items */}
      {todoItems.length === 0 ? (
        <Text style={styles.header}>
          Your to do list is empty - add something!
        </Text>
      ) : (
      <DraggableFlatList
        keyboardShouldPersistTaps={'handled'} //to make sure items can be deleted even with keyboard open
        data={todoItems}
        onDragEnd={({ data }) => {setTodoItems(data)}}
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