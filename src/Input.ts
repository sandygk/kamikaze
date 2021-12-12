/** Handles the logic to read the user input. */
export class Input {
  /** Indicates whether the key to turn clockwise is being pressed or not. */
  static turnClockwise = false;
  /** Indicates whether the key to turn counterclockwise is being pressed or not. */
  static turnCounterclockwise = false;
  /** Indicates whether the key to fire is being pressed or not. */
  static fire = false;

  /**
  Creates listeners to update the `input` state every time
  a key is pressed or released.
  */
  static init() {
    window.addEventListener('keydown', (event: any) => {
      Input.setState(event.key, true);
    });
    window.addEventListener('keyup', (event: KeyboardEvent) => {
      Input.setState(event.key, false);
    });
  }

  /**
  Updates the `input` object every time a key is pressed or released
  @param key The key that was either pressed or released.
  @param pressed Boolean indicating whether the key was pressed or released.
  */
  private static setState (key: string, pressed: boolean) {
    if (key === 'ArrowLeft') Input.turnCounterclockwise = pressed;
    if (key === 'ArrowRight') Input.turnClockwise = pressed;
    if (key === ' ') Input.fire = pressed;
  }
}





