import { inputs } from './store';

export const handleInput = (): void => {
  const trackInput = (key: string, pressed: boolean) => {
    if (key === 'ArrowLeft') inputs.turnCounterclockwise = pressed;
    if (key === 'ArrowRight') inputs.turnClockwise = pressed;
    if (key === 'ArrowUp') inputs.accelerate = pressed;
    if (key === 'Space') inputs.fire = pressed;
  };

  const handleKeyDown = (event: any) => {
    trackInput(event.key, true);
  };
  const handleKeyUp = (event: KeyboardEvent) => {
    trackInput(event.key, false);
  };
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
};
