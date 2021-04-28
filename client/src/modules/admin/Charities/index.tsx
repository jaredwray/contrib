import { useState } from 'react';

import { useQuery } from '@apollo/client';
import { Table } from 'react-bootstrap';

import { AllCharitiesQuery } from 'src/apollo/queries/charities';
import { ManagePage } from 'src/components/ManagePage';
import { PER_PAGE } from 'src/components/Pagination';

export default function CharitiesPage(): any {
  const [pageSkip, setPageSkip] = useState(0);

  const { loading, data, error } = useQuery(AllCharitiesQuery, {
    variables: { size: PER_PAGE, skip: pageSkip },
  });

  if (error) {
    return null;
  }

  const charities = data?.charities || { skip: 0, totalItems: 0, items: [] };

  return (
    <ManagePage items={charities} loading={loading} pageSkip={pageSkip} setPageSkip={setPageSkip}>
      <Table className="d-block d-sm-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody className="font-weight-normal">
          {charities.items.map((item: any) => (
            <tr key={item.id} className="clickable">
              <td>{item.id}</td>
              <td className="break-word">{item.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </ManagePage>
  );
}
