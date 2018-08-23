import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  uploadFile = (data) => {
    fetch('http://localhost:5000/upload', {
      method: 'post',
      body: data
    }).then((response) => response.json()
    ).then(res => console.log(res)
    ).catch((err) => {
      console.log(err);
    });
  }

  handleUploadFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const data = new FormData();
      data.append('file', file);
      data.append('name', file.name);
      this.uploadFile(data);
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          <input type='file' onChange={this.handleUploadFile}></input>
        </p>
      </div>
    );
  }
}

export default App;
