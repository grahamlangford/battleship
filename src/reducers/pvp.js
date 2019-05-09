import gameboard from '../engine/gameboard/gameboard'
import ship from '../engine/ship/ship'

const getShips = () => [
  ship('destroyer', 2),
  ship('submarine', 3),
  ship('cruiser', 3),
  ship('battleship', 4),
  ship('carrier', 5)
]

const getGame = () => {
  const game = gameboard()
  game.create(10, 10)
  return game
}

const constants = {
  SET_MESSAGE: 'SET_MESSAGE',
  SET_ERROR: 'SET_ERROR',
  TOGGLE_PLAYER: 'TOGGLE_PLAYER',
  INCREMENT_TURN: 'INCREMENT_TURN',
  SET_BOARD: 'SET_BOARD',
  TOGGLE_TRANSITION: 'TOGGLE_TRANSITION',
  RESET: 'RESET'
}

export const actions = {
  setMessage: message => ({ type: constants.SET_MESSAGE, payload: message }),
  setError: error => ({ type: constants.SET_ERROR, payload: error }),
  togglePlayer: () => ({ type: constants.TOGGLE_PLAYER }),
  incrementTurn: () => ({ type: constants.INCREMENT_TURN }),
  setBoard: board => ({ type: constants.SET_BOARD, payload: board }),
  toggleTransition: () => ({ type: constants.TOGGLE_TRANSITION }),
  reset: () => ({ type: constants.RESET })
}

export const initialState = {
  message: '',
  error: '',
  player: 'Player 1',
  turn: -2,
  board: 'Board 1',
  transition: true,
  ships1: getShips(),
  ships2: getShips(),
  game1: getGame(),
  game2: getGame()
}

export default (state, action) => {
  switch (action.type) {
    case constants.SET_MESSAGE:
      return { ...state, message: action.payload }
    case constants.SET_ERROR:
      return { ...state, error: action.payload }
    case constants.TOGGLE_PLAYER: {
      const { player } = state
      const newPlayer = player === 'Player 1' ? 'Player 2' : 'Player 1'
      return { ...state, player: newPlayer }
    }
    case constants.INCREMENT_TURN:
      return { ...state, turn: state.turn + 1 }
    case constants.SET_BOARD:
      return { ...state, board: action.payload }
    case constants.TOGGLE_TRANSITION:
      return { ...state, transition: !state.transition }
    case constants.RESET:
      return {
        ...initialState,
        ships1: getShips(),
        ships2: getShips(),
        game1: getGame(),
        game2: getGame()
      }
    default: {
      throw new Error('Invalid dispatch type')
    }
  }
}
