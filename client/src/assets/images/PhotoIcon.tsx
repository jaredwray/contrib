import * as React from 'react';

function AddPhoto(props: React.SVGProps<SVGSVGElement> & { hideAddSign?: boolean }) {
  const { hideAddSign, ...svgProps } = props;

  return (
    <svg fill="none" height={50} viewBox="0 0 50 50" width={50} xmlns="http://www.w3.org/2000/svg" {...svgProps}>
      <path
        d="M0 10C0 4.477 4.477 0 10 0h30c5.523 0 10 4.477 10 10v30c0 5.523-4.477 10-10 10H10C4.477 50 0 45.523 0 40V10z"
        fill="#F0F0EE"
      />
      <path
        d="M31.298 22.663a.5.5 0 00-.74 0l-4.13 4.536-1.558-1.712a.5.5 0 00-.74 0l-4.5 4.941a.5.5 0 00-.13.337V35a.5.5 0 00.5.5h18a.5.5 0 00.5-.5v-4.235a.5.5 0 00-.13-.337l-7.072-7.765z"
        fill="#5A7864"
        stroke="#5A7864"
        strokeLinejoin="round"
      />
      <rect height={23} rx={3} stroke="#5A7864" strokeWidth={3} width={27} x={11.5} y={13.5} />
      {!props.hideAddSign && (
        <>
          <circle cx={20} cy={21} fill="#5A7864" r={3} />
          <circle cx={13} cy={33} fill="#5A7864" r={7.75} stroke="#F0F0EE" strokeWidth={1.5} />
          <path d="M12 29h2v8h-2z" fill="#fff" />
          <path d="M17 32v2H9v-2z" fill="#fff" />
        </>
      )}
    </svg>
  );
}

export default AddPhoto;
