import * as React from 'react';

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" height={23} viewBox="0 0 26 23" width={26} xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect height={20} rx={3.5} stroke="#5A7864" strokeWidth={3} width={23} x={1.5} y={1.5} />
      <path d="M3 2h20v5H3z" fill="#5A7864" />
      <rect fill="#5A7864" height={2} rx={0.5} width={2} x={10} y={9} />
      <rect fill="#5A7864" height={2} rx={0.5} width={2} x={10} y={12.5} />
      <rect fill="#5A7864" height={2} rx={0.5} width={2} x={10} y={16} />
      <rect fill="#5A7864" height={2} rx={0.5} width={2} x={6} y={12.5} />
      <rect fill="#5A7864" height={2} rx={0.5} width={2} x={6} y={16} />
      <rect fill="#5A7864" height={2} rx={0.5} width={2} x={14} y={9} />
      <rect fill="#5A7864" height={2} rx={0.5} width={2} x={14} y={12.5} />
      <rect fill="#5A7864" height={2} rx={0.5} width={2} x={14} y={16} />
      <rect fill="#5A7864" height={2} rx={0.5} width={2} x={18} y={9} />
      <rect fill="#5A7864" height={2} rx={0.5} width={2} x={18} y={12.5} />
      <rect fill="#5A7864" height={2} rx={0.5} width={2} x={18} y={16} />
    </svg>
  );
}

export default CalendarIcon;
