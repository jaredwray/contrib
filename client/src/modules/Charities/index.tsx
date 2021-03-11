import { useCallback, useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { ProgressBar } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import { MyFavoriteCharitiesQuery, UpdateMyFavoriteCharities } from 'src/apollo/queries/charities';
import Layout from 'src/components/Layout';
import { useUrlQueryParam } from 'src/helpers/useUrlQueryParam';
import { Charity } from 'src/types/Charity';

import { InfluencerOnboardingFlowCharitiesForm } from './InfluencerOnboardingFlowCharitiesForm';

import 'src/components/Layout/Steps.scss';

export default function CharitiesPage() {
  const stepByStep = Boolean(useUrlQueryParam('sbs'));
  const history = useHistory();

  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
  const { data: myAccountsData } = useQuery(MyFavoriteCharitiesQuery);
  const [updateMyFavoriteCharities, { error: updateError }] = useMutation(UpdateMyFavoriteCharities);
  const influencerProfile = myAccountsData?.myAccount?.influencerProfile;

  const handleSubmit = useCallback(
    async (favoriteCharities: Charity[]) => {
      setSuccessMessage(undefined);

      await updateMyFavoriteCharities({
        variables: { charities: favoriteCharities.map((c) => c.id) },
      });

      if (stepByStep) {
        history.push('/welcome');
      } else {
        setSuccessMessage('Your profile has been successfully updated.');
      }
    },
    [updateMyFavoriteCharities, stepByStep, history],
  );

  return (
    <Layout>
      {stepByStep && <ProgressBar now={66} />}
      {influencerProfile && (
        <InfluencerOnboardingFlowCharitiesForm
          initialFavoriteCharities={influencerProfile.favoriteCharities}
          isStepByStep={stepByStep}
          submitErrorMessage={updateError?.message}
          submitSuccessMessage={successMessage}
          onSubmit={handleSubmit}
        />
      )}
    </Layout>
  );
}
