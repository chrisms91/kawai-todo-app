import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Dimensions,
  Platform,
  ScrollView
} from 'react-native';
import { AppLoading } from 'expo';
import Todo from './Todo';
import uuidv1 from 'uuid/v1';
// import console = require('console');

const { height, width } = Dimensions.get('window');

export default class App extends React.Component {
  state = {
    newToDo: '',
    loadedToDos: false,
    toDos: {}
  };

  componentDidMount = () => {
    this._loadToDos();
  };

  render() {
    const { newToDo, loadedToDos, toDos } = this.state;
    console.log(toDos);
    if (!loadedToDos) {
      return <AppLoading />;
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>Kawai To Do</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder={'New To Do'}
            placeholderTextColor={'#999'}
            value={newToDo}
            onChangeText={this._controlNewToDo}
            returnKeyType={'done'}
            autoCorrect={false}
            onSubmitEditing={this._addToDo}
          />
          {/* {...toDo} expands all the object properties as props */}
          <ScrollView contentContainerStyle={styles.todos}>
            {Object.values(toDos).map(toDo => (
              <Todo
                key={toDo.id}
                {...toDo}
                deleteToDo={this._deleteToDo}
                completeToDo={this._completeToDo}
                uncompleteToDo={this._uncompleteToDo}
                updateToDo={this._updateToDo}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }

  _controlNewToDo = text => {
    this.setState({
      newToDo: text
    });
  };

  _loadToDos = () => {
    this.setState({
      loadedToDos: true
    });
  };

  _addToDo = () => {
    const { newToDo } = this.state;
    if (newToDo !== '') {
      // using objects instead of array since it is more simple to modify list of todos.
      this.setState(prevState => {
        const ID = uuidv1();
        const newToDoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newToDo,
            createdAt: Date.now()
          }
        };
        const newState = {
          ...prevState,
          newToDo: '',
          toDos: {
            ...prevState.toDos,
            ...newToDoObject
          }
        };
        return { ...newState };
      });
    }
  };

  _deleteToDo = id => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      };
      return { ...newState };
    });
  };

  _uncompleteToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false
          }
        }
      };
      return { ...newState };
    });
  };

  _completeToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: true
          }
        }
      };
      return { ...newState };
    });
  };

  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            text: text
          }
        }
      };
      return { ...newState };
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f23657',
    alignItems: 'center'
  },
  title: {
    color: 'white',
    fontSize: 35,
    marginTop: 70,
    fontWeight: '200',
    marginBottom: 30
  },
  card: {
    backgroundColor: 'white',
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: 'rgb(50, 50, 50)',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 3
      }
    })
  },
  input: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#bbb',
    fontSize: 25
  },
  todos: {
    alignItems: 'center'
  }
});
