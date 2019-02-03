import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { hot } from 'react-hot-loader/root';
import css from 'styled-jsx/css';
import { Provider } from 'react-redux';
import configureStore from './configureStore';

export const { persistor, store } = configureStore();

const styles = css`
  .App-link {
    background-color: red;
  }
`;

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
          <style jsx>{styles}</style>
        </div>
      </Provider>
    );
  }
}


const AppHot = () => <App />;
export default hot(AppHot);
