import ship from './ship'

describe('engine/ship.js', () => {
  it('can create a ship with name: cruiser and length: 3', () => {
    const testShip = ship('cruiser', 3)
    expect(testShip.getName()).toBe('cruiser')
    expect(testShip.getLength()).toBe(3)
  })

  it('throws an error if hit is outside ship size', () => {
    const testShip = ship('cruiser', 3)
    expect(() => testShip.hit(-1)).toThrow('Invalid hit location targeted')
    expect(() => testShip.hit(3)).toThrow('Invalid hit location targeted')
  })

  it('throws an error if hit is specified to the same location twice', () => {
    const testShip = ship('cruiser', 3)
    testShip.hit(2)
    expect(() => testShip.hit(2)).toThrow()
  })

  it('isSunk when all locations hit', () => {
    const testShip = ship('cruiser', 3)
    expect(testShip.isSunk()).toBe(false)
    testShip.hit(1)
    expect(testShip.isSunk()).toBe(false)
    testShip.hit(2)
    expect(testShip.isSunk()).toBe(false)
    testShip.hit(0)
    expect(testShip.isSunk()).toBe(true)
  })
})
