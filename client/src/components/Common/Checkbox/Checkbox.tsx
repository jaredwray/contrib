import './Checkbox.scss';

interface PropTypes {
  checked?: boolean;
}

export default function Checkbox({ checked }: PropTypes) {
  return (
    <>
      <input type="checkbox" checked={checked} onChange={() => {}} />
      <span />
    </>
  );
}
