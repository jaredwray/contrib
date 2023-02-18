import * as React from 'react';

function InactiveIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" height={22} viewBox="0 0 22 22" width={22} xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect fill="#e1825f" height={22} rx={11} width={22} x={0.253} />
      <path d="M 7 7 l 8 9 M 15 7 l -8 9" stroke="#fff" strokeWidth={2} />
    </svg>
  );
}

export default InactiveIcon;
