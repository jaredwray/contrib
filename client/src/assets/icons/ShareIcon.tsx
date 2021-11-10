import * as React from 'react';

function ShareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="feather feather-share"
      fill="none"
      height={24}
      stroke="#5a7864"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width={24}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
      <polyline points="16 6 12 2 8 6"></polyline>
      <line x1="12" x2="12" y1="2" y2="15"></line>
    </svg>
  );
}

export default ShareIcon;
