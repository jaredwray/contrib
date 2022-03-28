import { FC } from 'react';

import { Container, ProgressBar } from 'react-bootstrap';

import Form from 'src/components/forms/Form/Form';
import Layout from 'src/components/layouts/Layout';
import StepByStepPageRow from 'src/components/layouts/StepByStepPageLayout/StepByStepPageRow';

import StepPageHeader from './StepPageHeader';
import styles from './styles.module.scss';

const AUCTION_CREATION_STEPS_NUMBER = 8;

interface Props {
  disabled?: boolean;
  loading: boolean;
  progress?: number;
  stepsNumber?: number;
  initialValues?: any;
  isActive?: boolean;
  onSubmit?: any;
  step: number;
  title: string;
  header: string;
  onClose?: () => void;
  prevAction?: () => void;
}
const StepByStepPageLayout: FC<Props> = ({
  disabled,
  loading,
  progress,
  stepsNumber = AUCTION_CREATION_STEPS_NUMBER,
  isActive,
  step,
  title,
  header,
  initialValues,
  onSubmit,
  prevAction,
  children,
}) => {
  const progressNow = progress || (step * 100) / stepsNumber;

  return (
    <Layout>
      {!isActive && <ProgressBar now={progressNow} />}
      <section className={styles.section}>
        <Form className={styles.form} initialValues={initialValues} onSubmit={onSubmit}>
          <Container className={styles.container} fluid="xxl">
            <StepPageHeader header={header} step={isActive ? null : step} title={title} />
            {children}
          </Container>
          <StepByStepPageRow disabled={disabled} isActive={isActive} loading={loading} prevAction={prevAction} />
        </Form>
      </section>
    </Layout>
  );
};

export default StepByStepPageLayout;
