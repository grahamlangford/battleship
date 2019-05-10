export const direction = {
  HORIZONTAL: 'HORIZONTAL',
  VERTICAL: 'VERTICAL'
}

export const error = {
  ROWS_POSITIVE: 'Rows must be a positive integer!',
  COLUMNS_POSITIVE: 'Columns must be a positive integer!',
  SHIP_IN_BOUNDS: 'Ship must be placed in bounds!',
  NO_OVERLAP: 'Ships cannot overlap!',
  NO_TARGET_TWICE: 'Cannot target same place twice!',
  INVALID_LOCATION: 'Invalid hit location targeted'
}

export const message = {
  MISS: 'Miss!',
  HIT: 'Hit!',
  SUNK: ship => `The ${ship} has been sunk!`
}
