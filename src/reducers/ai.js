import gameboard from '../engine/gameboard/gameboard'
import ship from '../engine/ship/ship'
import computer from '../engine/ai/ai'

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

const ai = computer()
const attack = (difficulty, game) =>
  difficulty === 0 ? ai.attack(game, 10, 10) : ai.smartAttack(game, 10, 10)

const constants = {
  DIFFICULTY: 'DIFFICULTY',
  SET_MESSAGE: 'SET_MESSAGE',
  SET_ERROR: 'SET_ERROR',
  TOGGLE_PLAYER: 'TOGGLE_PLAYER',
  INCREMENT_TURN: 'INCREMENT_TURN',
  RESET: 'RESET'
}

export const actions = {
  setDifficulty: difficulty => ({
    type: constants.DIFFICULTY,
    payload: difficulty
  }),
  setMessage: message => ({ type: constants.SET_MESSAGE, payload: message }),
  setError: error => ({ type: constants.SET_ERROR, payload: error }),
  togglePlayer: () => ({ type: constants.TOGGLE_PLAYER }),
  incrementTurn: () => ({ type: constants.INCREMENT_TURN }),
  reset: () => ({ type: constants.RESET })
}

const game1 = getGame()
const game2 = getGame()

export const initialState = {
  difficulty: 0,
  message: '',
  error: '',
  player: 'Human',
  turn: -3,
  transition: true,
  ships1: getShips(),
  ships2: getShips(),
  game1,
  game2,
  ai,
  attack: () => attack(0, game2)
}

export default (state, action) => {
  switch (action.type) {
    case constants.DIFFICULTY:
      return {
        ...state,
        difficulty: action.payload,
        attack: () => attack(action.payload, game2)
      }
    case constants.SET_MESSAGE:
      return { ...state, message: action.payload }
    case constants.SET_ERROR:
      return { ...state, error: action.payload }
    case constants.TOGGLE_PLAYER: {
      const { player } = state
      const newPlayer = player === 'Human' ? 'AI' : 'Human'
      return { ...state, player: newPlayer }
    }
    case constants.INCREMENT_TURN:
      return { ...state, turn: state.turn + 1 }
    case constants.RESET: {
      const newGame2 = getGame()
      return {
        ...initialState,
        ships1: getShips(),
        ships2: getShips(),
        game1: getGame(),
        game2: newGame2,
        attack: () => attack(0, newGame2)
      }
    }
    default: {
      throw new Error('Invalid dispatch type')
    }
  }
}
