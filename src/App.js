import { useState, Suspense } from 'react';
import {
  CanvasTexture,
  RepeatWrapping,
  NearestFilter,
  TextureLoader,
  MeshStandardMaterial,
  DoubleSide,
} from 'three';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { Room, Modal, Panel, Loader } from 'components';
import model from 'model/bathroom.glb';

const App = () => {
  const [showModal, setShowModal] = useState(null);
  const [selectedMesh, setSelectedMesh] = useState(null);
  const [rerender, setRerender] = useState(false);
  console.log('rerender: ', rerender);

  const { nodes } = useGLTF(model);
  const meshes = Object.values(nodes);

  const closePanel = () => {
    setShowModal(false);
  };

  const selectMesh = mesh => {
    setSelectedMesh(mesh);
    setShowModal(true);
  };

  const createTailMesh = (texture, width, height, seamColor, seamSize) => {
    const image = new Image();
    image.src = texture;
    const scale = image.width / Math.min(width, height);
    const gap = seamSize * scale;
    const vw = Math.min(1, width / height);
    const vh = Math.min(1, height / width);

    const canvas = document.createElement('canvas');
    canvas.width = image.width + gap * vh;
    canvas.height = image.height + gap * vw;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = seamColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      image,
      0,
      0,
      image.width * vw,
      image.height * vh,
      gap * vh,
      gap * vw,
      canvas.width,
      canvas.height
    );

    const newTexture = new CanvasTexture(canvas);

    newTexture.repeat.set(300 / (width + seamSize), 300 / (height + seamSize));
    newTexture.magFilter = NearestFilter;
    newTexture.minFilter = NearestFilter;

    return newTexture;
  };

  const handleSubmit = ({
    seamColor,
    seamSize,
    tailWeidth,
    tailHeight,
    texture,
    isTail,
  }) => {
    let newTexture;
    if (isTail) {
      newTexture = createTailMesh(
        texture,
        tailWeidth,
        tailHeight,
        seamColor,
        seamSize
      );
    } else {
      newTexture = new TextureLoader().load(texture);
    }
    newTexture.wrapS = RepeatWrapping;
    newTexture.wrapT = RepeatWrapping;
    newTexture.needsUpdate = true;
    const mesh = meshes[selectedMesh];
    mesh.material = new MeshStandardMaterial({
      map: newTexture,
      envMapIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.8,
      side: DoubleSide,
    });

    setRerender(prev => !prev);
  };

  return (
    <div className="App">
      <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 1] }}>
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.3} />
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
