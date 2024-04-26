export const useControl = () => {
  const getCoord = (obj: THREE.Mesh) => {
    const coord = obj.position.clone();
    return coord;
  };

  const setCoord = (vector3: THREE.Vector3, obj: THREE.Mesh) => {
    const coord = getCoord(obj);
    const { x, y, z } = coord.add(vector3);
    obj.position.set(x, y, z);
  };

  return {
    getCoord,
    setCoord,
  };
};
