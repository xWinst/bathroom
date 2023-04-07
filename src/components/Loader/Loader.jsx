import { Html } from '@react-three/drei';
import s from './Loader.module.css';

const Loader = () => {
  return (
    <Html center>
      <div className={s.overlay}>
        <div className={s.spinner}>
          <div className={s.item}></div>
          <div className={s.item}></div>
          <div className={s.item}></div>
          <div className={s.item}></div>
          <div className={s.item}></div>
        </div>
      </div>
    </Html>
  );
};

export default Loader;
