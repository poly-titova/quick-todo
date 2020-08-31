import React, { Component } from "react";
import { Layout, Input, Button } from "antd";

// мы импортировали firestore модуль
import firestore from "./firestore";

import "./App.css";

const { Header, Footer, Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    // установили состояние по умолчанию для нашего приложения
    this.state = { addingTodo: false, pendingTodo: "" };
    // мы хотим, чтобы обработчики событий разделяли этот контекст
    this.addTodo = this.addTodo.bind(this);
  }

  async addTodo(evt) {
    // установили флаг, чтобы указать загрузку
    this.setState({ addingTodo: true });
    // добавили новую задачу из значения ввода
    await firestore.collection("todos").add({
      content: this.state.pendingTodo,
      completed: false
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
        </Content>
        <Footer className="App-footer">&copy; My Company</Footer>
      </Layout>
    );
  }
}

export default App;