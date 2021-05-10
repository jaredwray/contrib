import * as React from 'react';

function VerifiedIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" height={22} viewBox="0 0 23 22" width={23} xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect fill="#5A7864" height={22} rx={11} width={22} x={0.253} />
      <path d="M6.253 10.364l3.89 3.889 6.363-6.364" stroke="#fff" strokeWidth={2} />
    </svg>
  );
}

export default VerifiedIcon;
