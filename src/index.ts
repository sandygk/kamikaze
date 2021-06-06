import { loadSprites } from './loadSprites';
import { resizeCanvas } from './resizeCanvas';
import { app } from './store';
import game from './game';
import { handleInput } from './handleInput';
import './style.css';

window.onload = async (): Promise<void> => {
  document.body.appendChild(app.view);
  resizeCanvas();
  await loadSprites();
  handleInput();
  game.init();
  app.ticker.add(game.update);
};
