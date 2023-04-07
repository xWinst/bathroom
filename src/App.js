import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { Room } from 'components';

const App = () => {
  return (
    <div className="App">
      <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight color="white" position={[-2, -2, 5]} />
          <Room />
          <OrbitControls />
          <Environment preset="park" background />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default App;
