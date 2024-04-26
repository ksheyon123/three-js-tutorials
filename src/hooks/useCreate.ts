import * as THREE from "three";

export const useCreate = () => {
  const createObject = () => {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    return cube;
  };

  const handleObjectLookAt = (obj: THREE.Mesh) => {
    // Set the position of the cone
    obj.position.set(0, 0, 0);

    obj.matrixAutoUpdate = false;

    const position = new THREE.Vector3(0, 0, 0); // Object coordinate
    obj.matrix.setPosition(position);
    const eye = position.clone();
    // Calculate the orientation to look at (1, 0, 1)
    var target = new THREE.Vector3(1, 1, 1);
    var up = new THREE.Vector3(0, 1, 0); // Using the global up vector

    // Calculate direction from position to target
    var direction = new THREE.Vector3()
      .subVectors(target, position)
      .normalize();

    // Calculate new up vector that is orthogonal to the direction
    var right = new THREE.Vector3().crossVectors(direction, up).normalize();
    var correctedUp = new THREE.Vector3()
      .crossVectors(right, direction)
      .normalize();

    // Apply lookAt matrix using manual calculation
    obj.matrix.lookAt(eye, target, up);

    // Update the matrix
    obj.matrixWorldNeedsUpdate = true;
  };

  return {
    createObject,
    handleObjectLookAt,
  };
};
