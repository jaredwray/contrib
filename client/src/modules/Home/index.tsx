import { Parallax, Background } from 'react-parallax';

import Layout from 'src/components/layouts/Layout';

import Banner from './Banner';
import EndingSoon from './EndingSoon';
import Status from './Status';
import styles from './styles.module.scss';

export default function HomePage() {
  return (
    <Layout>
      <Parallax strength={1000}>
        <Background className={styles.backgroundWrapper}>
          <Banner />
        </Background>
        <div className={styles.parallaxDiv} />
      </Parallax>
      <Status />
      <EndingSoon />
    </Layout>
  );
}
