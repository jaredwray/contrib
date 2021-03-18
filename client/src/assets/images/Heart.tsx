import * as React from 'react';

function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" height={17} viewBox="0 0 18 17" width={18} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M10.159 2.986h0l.004-.004A4.005 4.005 0 0112.998 1.8c1.057 0 2.074.422 2.83 1.178A4.148 4.148 0 0117 5.873a4.148 4.148 0 01-1.174 2.897l-.001.001-6.903 7-6.88-6.995A4.127 4.127 0 011 5.938a4.12 4.12 0 011.18-2.802 3.982 3.982 0 012.744-1.19 3.975 3.975 0 012.779 1.05l.508.512.704.71.71-.704.533-.528z"
        stroke="#96AF9B"
        strokeWidth={2}
      />
    </svg>
  );
}

export default HeartIcon;
