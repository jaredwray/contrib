import React, { FC } from 'react';

import cn from 'clsx';

import styles from './styles.module.scss';

interface Props {
  step: string | null;
  header: string;
  title: string;
  className?: string;
}

const StepHeader: FC<Props> = ({ step, title, className, header }) => (
  <div className={styles.root}>
    <p className="text-label label-with-separator">{header}</p>
    <div className={cn(styles.title, className)}>
      <span className="text-headline">{title}</span>
      {step && <span className={cn(styles.step, 'text-headline')}>Step {step}</span>}
    </div>
  </div>
);

export default StepHeader;
