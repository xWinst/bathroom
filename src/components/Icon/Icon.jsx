import icons from 'icons/icons.svg';

const Icon = ({ icon, cn, click, w, h = w, s }) => {
  return (
    <svg className={cn} onClick={click} width={w} height={h} style={s}>
      <use href={`${icons}#${icon}`} />
    </svg>
  );
};

export default Icon;
