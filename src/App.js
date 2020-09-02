import React, { Component } from "react";
import { Layout, Input, Button, List, Icon } from "antd";

// мы импортировали firestore модуль
import firestore from "./firestore";

import "./App.css";

const { Header, Footer, Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    // установили состояние по умолчанию для нашего приложения
    this.state = { addingTodo: false, pendingTodo: "", todos: [] };
    // мы хотим, чтобы обработчики событий разделяли этот контекст
    this.addTodo = this.addTodo.bind(this);
    this.completeTodo = this.completeTodo.bind(this);
    // мы следим за изменениями в нашей коллекции задач в Firebase
    firestore.collection("todos").onSnapshot(snapshot => {
      let todos = [];
      snapshot.forEach(doc => {
        const todo = doc.data();
        todo.id = doc.id;
        if (!todo.completed) todos.push(todo);
      });
      // сортируем наши задачи по добавленному времени
      todos.sort(function(a, b) {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
      // каждый раз, когда состояние нашей базы данных изменяется, мы обновляем состояние
      this.setState({ todos });
    });
  }

  async completeTodo(id) {
    // отметили задачу как выполненную
    await firestore
      .collection("todos")
      .doc(id)
      .set({
        completed: true
      });
  }

  async addTodo() {
    if (!this.state.pendingTodo) return;
    // установили флаг, чтобы указать загрузку
    this.setState({ addingTodo: true });
    // добавили новую задачу из значения ввода
    await firestore.collection("todos").add({
      content: this.state.pendingTodo,
      completed: false,
      createdAt: new Date().toISOString()
    });
    // сняли флаг загрузки и очистили ввод
    this.setState({ addingTodo: false, pendingTodo: "" });
  }

  render() {
    return (
      <Layout className="App">
        <Header className="App-header">
          <h1>Quick Todo</h1>
        </Header>
        <Content className="App-content">
          <Input
            ref="add-todo-input"
            className="App-add-todo-input"
            size="large"
            placeholder="What needs to be done?"
            disabled={this.state.addingTodo}
            onChange={evt => this.setState({ pendingTodo: evt.target.value })}
            value={this.state.pendingTodo}
            onPressEnter={this.addTodo}
            required
          />
          <Button
            className="App-add-todo-button"
            size="large"
            type="primary"
            onClick={this.addTodo}
            loading={this.state.addingTodo}
          >
            Add Todo
          </Button>
          <List
            className="App-todos"
            size="large"
            bordered
            dataSource={this.state.todos}
            renderItem={todo => (
              <List.Item>
                {todo.content}
                <Icon
                  onClick={evt => this.completeTodo(todo.id)}
                  className="App-todo-complete"
                  type="check"
                />
              </List.Item>
            )}
          />
        </Content>
        <Footer className="App-footer">&copy; My Company</Footer>
      </Layout>
    );
  }
}

export default App;