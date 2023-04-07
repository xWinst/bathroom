import { useGLTF } from '@react-three/drei';
import modelUrl from 'model/bathroom.glb';

const Room = () => {
  const { nodes } = useGLTF(modelUrl);
  const meshes = Object.values(nodes);

  const onClick = mesh => {
    console.log('mesh: ', mesh);
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

useGLTF.preload(modelUrl);

export default Room;
