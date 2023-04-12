const Room = ({ selectMesh, meshes }) => {
  return (
    <group dispose={null}>
      <group
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
        position={[0, -1.5, 2.5]}
      >
        {meshes.map((mesh, index) => (
          <mesh
            key={mesh.uuid}
            castShadow
            receiveShadow
            geometry={mesh.geometry}
            material={mesh.material}
            onClick={e => {
              e.stopPropagation();
              selectMesh(index);
            }}
          >
            {mesh.userData.shinyMaterial && (
              <mesh
                geometry={mesh.geometry}
                material={mesh.userData.shinyMaterial}
              />
            )}
          </mesh>
        ))}
      </group>
    </group>
  );
};

export default Room;
