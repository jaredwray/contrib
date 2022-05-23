import { useState, useEffect } from 'react';

import { useLazyQuery } from '@apollo/client';
import clsx from 'clsx';
import { Container, Row } from 'react-bootstrap';

import { MyBidsQuery } from 'src/apollo/queries/bids';
import Pagination, { PER_PAGE } from 'src/components/custom/Pagination';
import Layout from 'src/components/layouts/Layout';
import { setPageTitle } from 'src/helpers/setPageTitle';

import ItemsTable from './ItemsTable';
import styles from './styles.module.scss';

const MyBids = () => {
  const [pageSkip, setPageSkip] = useState(0);

  const [getBidsList, { loading, data }] = useLazyQuery(MyBidsQuery, {
    variables: {
      params: {
        size: PER_PAGE,
        skip: pageSkip,
      },
    },
    fetchPolicy: 'cache-and-network',
  });
  const bidsData = data?.myBids || { size: 0, skip: 0, totalItems: 0, items: [] };
  const hasBids = bidsData.items.length > 0;

  useEffect(() => getBidsList(), [getBidsList]);

  setPageTitle('My Bids');

  return (
    <Layout>
      <Container fluid className={clsx(styles.container, 'h-100')}>
        <Row className={clsx(styles.wrapper, 'text-label m-auto')}>
          <h1 className="text-headline py-4">My Bids</h1>
          {!loading && (
            <>
              {hasBids && (
                <>
                  <div>
                    <Pagination loading={loading} setPageSkip={setPageSkip} total={bidsData.totalItems} />
                  </div>
                  <ItemsTable items={bidsData.items} />
                </>
              )}
              {!hasBids && <div className="px-3">You haven't placed any bids yet.</div>}
            </>
          )}
        </Row>
      </Container>
    </Layout>
  );
};

export default MyBids;
