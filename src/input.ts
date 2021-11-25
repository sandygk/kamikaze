/** Stores the input values for the current frame. */
export const input = {
  /** Indicates whether the key to turn counterclockwise is being pressed or not. */
  turnCounterclockwise: false,
  /** Indicates whether the key to turn clockwise is being pressed or not. */
  turnClockwise: false,
  /** Indicates whether the key to fire is being pressed or not. */
  fire: false,
};

/**
Updates the `input` object every time a key is pressed or released
@param key The key that was either pressed or released.
@param pressed Boolean indicating whether the key was pressed or released.
*/
export const setInputState = (key: string, pressed: boolean) => {
  if (key === 'ArrowLeft') input.turnCounterclockwise = pressed;
  if (key === 'ArrowRight') input.turnClockwise = pressed;
  if (key === ' ') input.fire = pressed;
};

