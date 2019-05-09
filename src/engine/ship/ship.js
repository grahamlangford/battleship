export default (name, length) => {
  const hits = new Array(length).fill(false)

  const getName = () => name
  const getLength = () => length
  const hit = location => {
    if (location < 0 || location >= length) {
      throw new Error('Invalid hit location targeted')
    } else if (hits[location]) {
      throw new Error('Cannot target same place twice!')
    } else {
      hits[location] = true
    }
  }
  const isSunk = () => {
    return hits.every(bool => bool)
  }

  return { getName, getLength, hit, isSunk }
}
