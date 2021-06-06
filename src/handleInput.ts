import { inputs } from './store';

export const handleInput = (): void => {
  const trackInput = (key: string, pressed: boolean) => {
    if (key === 'ArrowLeft') inputs.turnLeft = pressed;
    if (key === 'ArrowRight') inputs.turnRight = pressed;
    if (key === 'ArrowUp') inputs.moveForward = pressed;
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
