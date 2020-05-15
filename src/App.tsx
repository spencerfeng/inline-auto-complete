import React from 'react'
import logo from './logo.svg'
import './App.css'
import InlineAutoCompleteWrapper from './components/InlineAutoCompleteWrapper'

const styles = {
  input: {
    padding: 5,
    lineHeight: 1.4,
    width: 200,
    height: 100,
    border: '1px solid #cccccc'
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
      <InlineAutoCompleteWrapper trigger="@" suggestions={['Item 1', 'Item 2', 'Item 3', 'Item 4']}>
        <textarea style={styles.input} />
      </InlineAutoCompleteWrapper>
    </div>
  )
}

export default App
