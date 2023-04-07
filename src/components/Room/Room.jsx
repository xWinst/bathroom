// import { useState } from 'react';
import { useGLTF } from '@react-three/drei';
import model from 'model/bathroom.glb';

const Room = ({ openPanel }) => {
  //   const [selectedMesh, setSelectedMesh] = useState(null);
  const { nodes } = useGLTF(model);
  const meshes = Object.values(nodes);

  const onClick = mesh => {
    // setSelectedMesh(mesh);
    openPanel();
  };

  return (
    <group dispose={null}>
      <group
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
        position={[0, -1.5, 2.5]}
      >
        {meshes.map(mesh => (
          <mesh
            key={mesh.uuid}
            castShadow
            receiveShadow
            geometry={mesh.geometry}
            material={mesh.material}
            onClick={() => onClick(mesh)}
          />
        ))}
      </group>
    </group>
  );
};

useGLTF.preload(model);

export default Room;
