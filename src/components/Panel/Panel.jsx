import { useState } from 'react';
import { textures, solidTextures } from 'textures';
import s from './Panel.module.css';

const colors = ['#eeeeee', '#888888', '#101010', '#001978'];

const Panel = ({ submit }) => {
  const [seamColor, setSeamColor] = useState('#888888');
  const [seamSize, setSeamSize] = useState(1.5);
  const [tailWeidth, setTailWeidth] = useState(30);
  const [tailHeight, setTailHeight] = useState(30);
  const [texture, setTexture] = useState(null);

  console.log(textures.indexOf(texture));
  const onChange = e => {
    const { value, name } = e.target;

    let func;
    if (name === 'seamSize') {
      func = setSeamSize;
    } else {
      func = name === 'tailWeidth' ? setTailWeidth : setTailHeight;
    }
    func(value);
  };

  const valueCorrection = e => {
    const { name } = e.target;
    let min, max, func, value;
    if (name === 'seamSize') {
      min = 0;
      max = 10;
      value = seamSize;
      func = setSeamSize;
    } else {
      min = 15;
      max = 100;
      if (name === 'tailWeidth') {
        func = setTailWeidth;
        value = tailWeidth;
      } else {
        func = setTailHeight;
        value = tailHeight;
      }
    }
    func(Math.min(max, Math.max(value, min)));
  };

  const changeTexture = (texture, isTail = true) => {
    setTexture(texture);
    submit({
      seamColor,
      seamSize,
      tailWeidth,
      tailHeight,
      texture,
      isTail,
    });
  };

  return (
    <div>
      <div className={s.prop}>
        <p>Колір шва</p>
        <ul className={s.colorList}>
          {colors.map(color => (
            <li
              className={color === seamColor ? s.active : s.item}
              key={color}
              onClick={() => setSeamColor(color)}
            >
              <div className={s.color} style={{ backgroundColor: color }}></div>
            </li>
          ))}
        </ul>
      </div>

      <div className={s.flexBox + ' ' + s.prop}>
        <p>Розмір шва (см)</p>
        <input
          name="seamSize"
          className={s.input}
          value={seamSize}
          onChange={onChange}
          onBlur={valueCorrection}
          type="number"
        />
      </div>

      <div className={s.flexBox + ' ' + s.prop}>
        <p>Розмір плитки (см)</p>
        <input
          name="tailWeidth"
          className={s.input}
          value={tailWeidth}
          onChange={onChange}
          onBlur={valueCorrection}
          type="number"
        />
        <p>X</p>
        <input
          name="tailHeight"
          className={s.input}
          value={tailHeight}
          onChange={onChange}
          onBlur={valueCorrection}
          type="number"
        />
      </div>

      <div className={s.prop}>
        <p>Текстура плитки</p>
        <ul className={s.colorList}>
          {textures.map((image, i) => (
            <li
              className={
                i === textures.indexOf(texture) ? s.activeTexture : s.texture
              }
              key={image}
              onClick={() => changeTexture(image)}
            >
              <img src={image} width={60} alt="" />
            </li>
          ))}
        </ul>
      </div>
      <div className={s.prop}>
        <p className={s.prop}>Суцільна текстура</p>
        <ul className={s.colorList}>
          {solidTextures.map((image, i) => (
            <li
              className={
                i === solidTextures.indexOf(texture)
                  ? s.activeTexture
                  : s.texture
              }
              key={image}
              onClick={() => changeTexture(image, false)}
            >
              <img src={image} width={64} alt="" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Panel;
