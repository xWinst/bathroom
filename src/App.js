import { useState, Suspense } from 'react';
import {
  RepeatWrapping,
  CanvasTexture,
  NearestFilter,
  MeshPhysicalMaterial,
  TextureLoader,
} from 'three';

import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { Room, Modal, Panel, Loader } from 'components';
import model from 'model/bathroom.glb';
import { normalTile, normalSeam, rougness } from 'textures';

const App = () => {
  const [showModal, setShowModal] = useState(null);
  const [selectedMesh, setSelectedMesh] = useState(null);

  const { nodes } = useGLTF(model);
  const startMeshes = Object.values(nodes).filter(mesh => mesh.isMesh);
  const [meshes, setMeshes] = useState(startMeshes);

  const closePanel = () => {
    setShowModal(false);
  };

  const selectMesh = mesh => {
    setSelectedMesh(mesh);
    setShowModal(true);
  };

  const getMatterials = (texture, width, height, seamColor, seamSize) => {
    const image = new Image();
    image.src = texture;
    const scale = image.width / Math.max(width, height);
    const gap = seamSize * scale;
    const vw = Math.min(1, width / height);
    const vh = Math.min(1, height / width);

    const canvas = document.createElement('canvas');
    canvas.width = image.width * vw + gap;
    canvas.height = image.height * vh + gap;

    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      0,
      0,
      image.width * vw,
      image.height * vh,
      gap / 2,
      gap / 2,
      canvas.width - gap / 2,
      canvas.height - gap / 2
    );

    const newTexture = new CanvasTexture(canvas);

    newTexture.repeat.set(300 / (width + seamSize), 300 / (height + seamSize));
    newTexture.magFilter = NearestFilter;
    newTexture.minFilter = NearestFilter;
    newTexture.wrapS = RepeatWrapping;
    newTexture.wrapT = RepeatWrapping;

    const image2 = new Image();
    image2.src = normalTile;
    const canvas2 = document.createElement('canvas');
    canvas2.width = image.width * vw + gap;
    canvas2.height = image.height * vh + gap;

    const ctx2 = canvas2.getContext('2d');

    ctx2.drawImage(
      image2,
      0,
      0,
      image2.width,
      image2.height,
      gap / 2,
      gap / 2,
      canvas.width - gap / 2,
      canvas.height - gap / 2
    );

    const normalMap = new TextureLoader().load(normalSeam);
    normalMap.repeat.set(5, 5);
    normalMap.wrapS = RepeatWrapping;
    normalMap.wrapT = RepeatWrapping;

    const normalTileMap = new CanvasTexture(canvas2);
    normalTileMap.repeat.set(
      300 / (width + seamSize),
      300 / (height + seamSize)
    );
    normalTileMap.wrapS = RepeatWrapping;
    normalTileMap.wrapT = RepeatWrapping;

    const rougnessMap = new TextureLoader().load(rougness);
    rougnessMap.repeat.set(5, 5);
    rougnessMap.wrapS = RepeatWrapping;
    rougnessMap.wrapT = RepeatWrapping;

    var material1 = new MeshPhysicalMaterial({
      color: seamColor,
      normalMap,
      rougnessMap,
      clearcoat: 0,
      roughness: 1,
    });

    var material2 = new MeshPhysicalMaterial({
      map: newTexture,
      envMap: newTexture,
      normalMap: normalTileMap,
      emissiveIntensity: 1,
      transparent: true,
      clearcoat: 0.5,
      roughness: 0.3,
      metalness: 0.2,
    });

    return [material1, material2];
  };

  const handleSubmit = ({
    seamColor,
    seamSize,
    tailWeidth,
    tailHeight,
    texture,
    isTail,
  }) => {
    if (selectedMesh) {
      let material1, material2;
      if (isTail) {
        [material1, material2] = getMatterials(
          texture,
          tailWeidth,
          tailHeight,
          seamColor,
          seamSize
        );
      } else {
        const newTexture = new TextureLoader().load(texture);
        newTexture.wrapS = RepeatWrapping;
        newTexture.wrapT = RepeatWrapping;
        material1 = new MeshPhysicalMaterial({
          map: newTexture,
          envMap: newTexture,
          emissiveIntensity: 1,
          clearcoat: 0.5,
          roughness: 0.5,
        });
      }

      setMeshes(prev => {
        const result = [...prev];
        result[selectedMesh].material = material1;
        result[selectedMesh].userData.shinyMaterial = material2;

        return result;
      });
    }
  };

  return (
    <div className="App">
      <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 1] }}>
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.1} />
          <directionalLight color="white" position={[1, -2, -4]} />
          <Room meshes={meshes} selectMesh={selectMesh} />
          <OrbitControls />
          <Environment preset="park" background />
        </Suspense>
      </Canvas>
      {showModal && (
        <Modal close={closePanel}>
          <Panel submit={handleSubmit} />
        </Modal>
      )}
    </div>
  );
};

useGLTF.preload(model);
export default App;
