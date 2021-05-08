import { FC, useContext } from 'react';

import clsx from 'clsx';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Layout from 'src/components/Layout';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { Charity, CharityStatus } from 'src/types/Charity';

import styles from './CharityProfilePageContent.module.scss';

interface Props {
  charity: Charity;
}

export const CharityProfilePageContent: FC<Props> = ({ charity }) => {
  const { account } = useContext(UserAccountContext);

  const profileDescriptionParagraphs = (charity?.profileDescription ?? 'no description').split('\n');

  const isMyProfile = account?.charity?.id === charity.id;
  const isActive = charity.status === CharityStatus.ACTIVE;

  if (!isActive && (!isMyProfile || !account?.isAdmin)) {
    return null;
  }

  return (
    <Layout>
      <section className={styles.root}>
        {isMyProfile && (
          <Container className="p-0">
            <Row>
              <Col className="p-0">
                <Link className={clsx(styles.editBtn, 'text-label btn btn-secondary')} to={'/charity/me/edit'}>
                  Edit
                </Link>
              </Col>
            </Row>
          </Container>
        )}
        <div className={styles.header}>
          <Image roundedCircle className={styles.avatar} src={ResizedImageUrl(charity?.avatarUrl || '', 194)} />
        </div>
        {account?.isAdmin && (
          <Container>
            <Row>
              <Col>
                <Link className="text-label float-right" to={`/charity/${charity.id}/edit`}>
                  Edit
                </Link>
              </Col>
            </Row>
          </Container>
        )}
        <Container className={styles.content}>
          <Row>
            <Col md="6">
              <p className="text-headline break-word">{charity.name}</p>
              {charity.websiteUrl && (
                <p className="text-label text-all-cups">
                  <a className={styles.link} href={charity.websiteUrl}>
                    {charity.websiteUrl}&#160;&gt;&gt;
                  </a>
                </p>
              )}
            </Col>
            <Col md="6">
              <span className="label-with-separator text-label">Charity profile</span>
              {profileDescriptionParagraphs.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex} className="text--body mb-4 mt-4 break-word">
                  {paragraph}
                </p>
              ))}
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  );
};
