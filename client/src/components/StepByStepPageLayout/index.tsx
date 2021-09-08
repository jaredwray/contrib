import { FC } from 'react';

import { Container, ProgressBar } from 'react-bootstrap';

import Form from 'src/components/Form/Form';
import Layout from 'src/components/Layout';
import StepByStepPageRow from 'src/components/StepByStepPageRow';

import StepPageHeader from './StepPageHeader';
import styles from './styles.module.scss';

interface Props {
  loading: boolean;
  progress: number;
  initialValues?: any;
  isActive?: boolean;
  onSubmit?: any;
  step: string;
  title: string;
  header: string;
  onClose?: () => void;
  prevAction?: () => void;
}
const StepByStepPageLayout: FC<Props> = ({
  loading,
  progress,
  isActive,
  step,
  title,
  header,
  initialValues,
  onSubmit,
  prevAction,
  children,
}) => {
  return (
    <Layout>
      {!isActive && <ProgressBar now={progress} />}
      <section className={styles.section}>
        <Form className={styles.form} initialValues={initialValues} onSubmit={onSubmit}>
          <Container className={styles.container}>
            <StepPageHeader header={header} step={isActive ? null : step} title={title} />
            {children}
          </Container>
          <StepByStepPageRow isActive={isActive} loading={loading} prevAction={prevAction} />
        </Form>
      </section>
    </Layout>
  );
};

export default StepByStepPageLayout;
