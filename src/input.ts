
/** Stores the input values for the current frame. */
export const input = {
  turnCounterclockwise: false,
  turnClockwise: false,
  fire: false,
};

export const setInputState = (key: string, pressed: boolean) => {
  if (key === 'ArrowLeft') input.turnCounterclockwise = pressed;
  if (key === 'ArrowRight') input.turnClockwise = pressed;
  if (key === ' ') input.fire = pressed;
};

