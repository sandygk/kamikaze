export const rad2deg = (rad: number) => {
  return (rad * 180) / PI;
};

export const deg2rad = (deg: number) => {
  return (deg * PI) / 180;
};

export const PI = Math.PI;
export const TAU = 2 * PI;

export const RIGHT = 0;
export const DOWN = PI / 2;
export const LEFT = PI;
export const UP = -PI / 2;
