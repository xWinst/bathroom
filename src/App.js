import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { Room, Modal, Panel } from 'components';

const App = () => {
  const [showModal, setShowModal] = useState(null);
  const [args, setArgs] = useState({});
  console.log('args: ', args);

  const openPanel = () => {
    setShowModal(true);
  };

  const closePanel = () => {
    setShowModal(false);
  };

  return (
    <div className="App">
      <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <directionalLight color="white" position={[-1, 3, -4]} />
          <Room openPanel={openPanel} />
          <OrbitControls />
          <Environment preset="park" background />
        </Suspense>
      </Canvas>
      {showModal && (
        <Modal close={closePanel}>
          <Panel submit={setArgs} />
        </Modal>
      )}
    </div>
  );
};

export default App;
