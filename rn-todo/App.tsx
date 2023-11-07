import React from 'react';
import { SafeAreaView } from 'react-native';
import ToDoList from './components/ToDoList';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView >
        <ToDoList />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default App;