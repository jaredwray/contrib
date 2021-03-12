import * as React from 'react';

function AddVideo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" height={50} viewBox="0 0 50 50" width={50} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M0 10C0 4.477 4.477 0 10 0h30c5.523 0 10 4.477 10 10v30c0 5.523-4.477 10-10 10H10C4.477 50 0 45.523 0 40V10z"
        fill="#F0F0EE"
      />
      <rect height={19} rx={3} stroke="#5A7864" strokeWidth={3} width={20} x={13.5} y={16.5} />
      <path
        d="M43.485 20.75a1.5 1.5 0 00-2.426-1.18l-6.985 5.486a1.5 1.5 0 000 2.359l6.985 5.485a1.5 1.5 0 002.426-1.18V20.75z"
        stroke="#5A7864"
        strokeLinejoin="round"
        strokeWidth={3}
      />
      <circle cx={14} cy={33} fill="#5A7864" r={7.75} stroke="#F0F0EE" strokeWidth={1.5} />
      <path d="M13 29h2v8h-2z" fill="#fff" />
      <path d="M18 32v2h-8v-2z" fill="#fff" />
    </svg>
  );
}

export default AddVideo;
