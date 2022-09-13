import { FC, useCallback, useContext, useState } from 'react';

import { useQuery } from '@apollo/client';

import { ActiveCharitiesList } from 'src/apollo/queries/charities';
import { CharitySearchSelect, Option } from 'src/components/forms/selects/CharitySearchSelect';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import { Charity, CharityStatus } from 'src/types/Charity';

import styles from './styles.module.scss';

interface Props {
  disabled?: boolean;
  checkMissed: (name: string, value: string | Dinero.DineroObject) => void;
}

const Charities: FC<Props> = ({ checkMissed, disabled = false }) => {
  const { account } = useContext(UserAccountContext);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const { data, loading } = useQuery(ActiveCharitiesList, {
    variables: { filters: { status: [CharityStatus.ACTIVE] } },
  });

  const charityOption = useCallback((charity: Charity): Option => {
    return { label: charity.name, value: charity.id, id: charity.id };
  }, []);
  const onChange = useCallback(
    (option: Option | null) => {
      checkMissed('charity', option?.value || '');
      setSelectedOption(option);
    },
    [checkMissed, setSelectedOption],
  );

  if (loading) return null;

  const favoriteCharities = account?.influencerProfile?.favoriteCharities || ([] as Charity[]);
  const favoriteCharitiesIds = favoriteCharities.map((charity: Charity) => charity.id);
  const options = [
    ...favoriteCharities,
    ...data.charitiesList.items.filter((ch: Charity) => !favoriteCharitiesIds.includes(ch.id)),
  ].map((charity: Charity) => charityOption(charity));

  return (
    <div>
      <CharitySearchSelect
        required
        className={styles.select}
        disabled={disabled}
        floatingLabel="Charity"
        name="charity"
        options={options.sort((a, b) => a.label.localeCompare(b.label))}
        placeholder=""
        selectedOption={selectedOption}
        onChange={onChange}
      />
      <div className="text-label-light text-start mx-3 my-2">Search for, and select your partner Charity</div>
    </div>
  );
};

export default Charities;
