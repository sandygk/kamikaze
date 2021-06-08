const rad2deg = (rad: number) => {
  return (rad * 180) / Math.PI;
};

const deg2rad = (deg: number) => {
  return (deg * Math.PI) / 180;
};

const TAU = 2 * Math.PI;

export default { rad2deg, deg2rad, TAU };
