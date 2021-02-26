import './styles.scss';

interface PropTypes {
  checked?: boolean;
}

export default function Checkbox({ checked }: PropTypes) {
  return (
    <>
      <input checked={checked} type="checkbox" onChange={() => {}} />
      <span />
    </>
  );
}
