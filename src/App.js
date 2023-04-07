import { useState, Suspense } from 'react';
import {
  CanvasTexture,
  RepeatWrapping,
  NearestFilter,
  TextureLoader,
  MeshBasicMaterial,
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

  const createTailMesh = (texture, weidth, height, seamColor, seamSize) => {
    const image = new Image();
    image.src = texture;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0);
    ctx.strokeStyle = seamColor;
    ctx.lineWidth = seamSize * 38;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    const newTexture = new CanvasTexture(canvas);

    newTexture.wrapS = RepeatWrapping;
    newTexture.wrapT = RepeatWrapping;
    newTexture.repeat.set(300 / (weidth + seamSize), 300 / (height + seamSize));
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
      newTexture.wrapS = RepeatWrapping;
      newTexture.wrapT = RepeatWrapping;
    }
    newTexture.needsUpdate = true;
    const mesh = meshes[selectedMesh];
    mesh.material = new MeshBasicMaterial({
      map: newTexture,
      side: DoubleSide,
    });

    setRerender(prev => !prev);
  };

  return (
    <div className="App">
      <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 1] }}>
        <Suspense fallback={<Loader />}>
          {/* <ambientLight intensity={0.005} />
          <directionalLight color="white" position={[-1, 3, -4]} /> */}
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
