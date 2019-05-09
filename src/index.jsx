import './bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'
import 'typeface-roboto'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import CssBaseline from '@material-ui/core/CssBaseline'

import App from './components/App'
import * as serviceWorker from './serviceWorker'

import theme from './theme'

console.log(theme)
ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </MuiThemeProvider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
