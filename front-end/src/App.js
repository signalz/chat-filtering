import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: ''
    }
  }

  uploadFile = (data, url) => {
    fetch(`http://localhost:5000/${url}`, {
      method: 'post',
      body: data
    }).then((response) => response.json()
    ).then(res => console.log(res)
    ).catch((err) => {
      console.log(err);
    });
  }

  onInputFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const data = new FormData();
      data.append('file', file);
      data.append('name', file.name);
      this.file = data;
    } else {
      this.file = undefined;
    }
  }

  onButtonClickHandle = () => {
    this.uploadFile(this.data, this.state.url);
  }

  onInputTextChange = (e) => {
    this.setState({
      url: `${e.target.value}`
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="App-intro">
          <div>
            <div>
              <input type='file' onChange={this.onInputFileChange}></input>
            </div>
            <div>
              <input type='text' onChange={this.onInputTextChange} value={this.state.url} placeholder='path to upload file'></input>
            </div>
            <div>
              <button onClick={this.onButtonClickHandle}>Upload file</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
