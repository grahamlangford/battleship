import './bootstrap'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

import 'typeface-roboto'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import CssBaseline from '@material-ui/core/CssBaseline'

import App from './components/App'
import Pvp from './components/Pvp'
import PvC from './components/PvC'
import * as serviceWorker from './serviceWorker'

import theme from './theme'

const Routes = () => {
  const [gameType, setGameType] = useState({ type: 'home' })
  console.log('gameType = ', gameType.type)

  return (
    <Router>
      <Route
        exact
        path="/"
        render={() => {
          if (gameType.type === 'pvp') return <Redirect to="/pvp" />
          if (gameType.type === 'ai') return <Redirect to="/ai" />
          return <App setGameType={setGameType} />
        }}
      />
      <Route
        path="/pvp"
        render={props => {
          if (gameType.type === 'home') return <Redirect to="/" />
          return <Pvp {...props} goHome={() => setGameType({ type: 'home' })} />
        }}
      />
      <Route
        path="/ai"
        render={props => {
          if (gameType.type === 'home') return <Redirect to="/" />
          return <PvC {...props} goHome={() => setGameType({ type: 'home' })} />
        }}
      />
    </Router>
  )
}

console.log(theme)
ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <Routes />
  </MuiThemeProvider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
