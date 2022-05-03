import { FC, useCallback, useState } from 'react';

import { useQuery } from '@apollo/client';

import { ActiveCharitiesList } from 'src/apollo/queries/charities';
import { CharitySearchSelect, Option } from 'src/components/forms/selects/CharitySearchSelect';
import { Charity, CharityStatus } from 'src/types/Charity';

interface Props {
  disabled?: boolean;
}

const Charities: FC<Props> = ({ disabled }) => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const { data, loading } = useQuery(ActiveCharitiesList, {
    variables: { filters: { status: [CharityStatus.ACTIVE] } },
  });

  const charityOption = useCallback((charity: Charity): Option => {
    return { label: charity.name, value: charity.id, id: charity.id };
  }, []);
  // const favoriteCharities = auction.auctionOrganizer.favoriteCharities;
  // const favoriteCharitiesIds = favoriteCharities.map((charity: Charity) => charity.id);
  // const options = [
  //   ...favoriteCharities,
  //   ...charitiesListData.charitiesList.items.filter((ch: Charity) => !favoriteCharitiesIds.includes(ch.id)),
  // ].map((charity: Charity) => charityOption(charity));

  if (loading) return null;

  const options = data.charitiesList.items.map((charity: Charity) => charityOption(charity));

  return (
    <div>
      <CharitySearchSelect
        required
        disabled={!!disabled}
        floatingLabel="Charity"
        name="charity"
        options={options}
        placeholder=""
        selectedOption={selectedOption}
        onChange={setSelectedOption}
      />
      <div className="text-label-light text-start mx-3 my-2">Search for, and select your partner Charity</div>
    </div>
  );
};

export default Charities;
