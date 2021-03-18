import { useCallback, useEffect, useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { Alert, Button, Col, Container, Image, ProgressBar, Row } from 'react-bootstrap';
import { Redirect, useHistory } from 'react-router-dom';

import { MyAccountQuery } from 'src/apollo/queries/myAccountQuery';
import { UpdateInfluencerProfileAvatarMutation, UpdateInfluencerProfileMutation } from 'src/apollo/queries/profile';
import Form from 'src/components/Form/Form';
import InputField from 'src/components/Form/InputField';
import Layout from 'src/components/Layout';
import StepByStepRow from 'src/components/StepByStepRow';
import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { useUrlQueryParam } from 'src/helpers/useUrlQueryParam';
import { UserAccount } from 'src/types/UserAccount';

import styles from './styles.module.scss';

const MAX_AVATAR_SIZE_MB = 2;
const HIDE_ALERT_TIMEOUT_MS = 3500;

export default function MyProfilePage() {
  const [updateInfluencerProfile, { loading: updatingProfile }] = useMutation(UpdateInfluencerProfileMutation);
  const [updateInfluencerProfileAvatar] = useMutation(UpdateInfluencerProfileAvatarMutation);

  let fileInput: HTMLInputElement | null = null;
  const stepByStep = useUrlQueryParam('sbs');
  const history = useHistory();
  const [updateError, setUpdateError] = useState('');
  const [successUpdateMessage, setSuccessUpdateMessage] = useState('');

  const { loading: accountDataLoading, data: myAccountsData, error: accountDataLoadingError } = useQuery<{
    myAccount: UserAccount;
  }>(MyAccountQuery);
  const influencerProfile = myAccountsData?.myAccount?.influencerProfile;

  const handleSubmit = useCallback(
    ({
      name,
      sport,
      team,
      profileDescription,
    }: {
      name: string;
      sport: string;
      team: string;
      profileDescription: string;
    }) => {
      if (name && sport && team && profileDescription) {
        updateInfluencerProfile({
          variables: { name, sport, team, profileDescription },
        })
          .then(() => {
            if (stepByStep) {
              history.replace('/charities?sbs=true');
            } else {
              setSuccessUpdateMessage('Your profile has been successfully updated.');
            }
          })
          .catch((error) => setUpdateError(error.message));
      }
    },
    [stepByStep, history, updateInfluencerProfile],
  );

  useEffect(() => {
    successUpdateMessage &&
      setTimeout(() => {
        setSuccessUpdateMessage('');
      }, HIDE_ALERT_TIMEOUT_MS);
  }, [successUpdateMessage]);

  useEffect(() => {
    updateError &&
      setTimeout(() => {
        setUpdateError('');
      }, HIDE_ALERT_TIMEOUT_MS);
  }, [updateError]);

  const selectFile = () => {
    fileInput?.click();
  };

  const onFileSelected = useCallback(
    (event: any) => {
      const image = event.target.files[0];

      if (!image) return;

      const fileSizeInMegaBytes = image.size / (1024 * 1024);

      if (fileSizeInMegaBytes > MAX_AVATAR_SIZE_MB) {
        setUpdateError(`File is too big! Maximum allowed size is ${MAX_AVATAR_SIZE_MB}MB`);
        return;
      }

      const avatarFileInput = document.getElementById('avatarFileInput') as HTMLInputElement;
      const imageExpansion = image.name.split('.').pop();
      const acceptedTypes = avatarFileInput.getAttribute('accept');
      const allovedExpansions = acceptedTypes?.replaceAll('.', '').split(',');

      if (!allovedExpansions?.includes(imageExpansion)) {
        setUpdateError(`You can upload only images with types: ${acceptedTypes}!`);
        return;
      }

      const avatar = document.getElementById('profileAvatar') as HTMLImageElement;
      avatar.src = URL.createObjectURL(image);

      updateInfluencerProfileAvatar({
        variables: { image },
      }).catch((error) => setUpdateError(error.message));
    },
    [updateInfluencerProfileAvatar],
  );

  if (accountDataLoading) {
    return <>Loading...</>;
  }
  if (accountDataLoadingError) {
    console.error("Account's data loading error: ", accountDataLoadingError);
    return null;
  }
  if (!influencerProfile) {
    return <Redirect to="/" />;
  }

  const initialValues = {
    name: influencerProfile?.name,
    sport: influencerProfile?.sport,
    team: influencerProfile?.team,
    profileDescription: influencerProfile?.profileDescription,
  };

  return (
    <Layout>
      {stepByStep && <ProgressBar now={33} />}
      <section className={styles.root}>
        <Form initialValues={initialValues} onSubmit={handleSubmit}>
          {updateError && (
            <Alert className={styles.alert} variant="danger">
              {updateError}
            </Alert>
          )}
          {successUpdateMessage && (
            <Alert className={styles.alert} variant="success">
              {successUpdateMessage}
            </Alert>
          )}

          <Container>
            <Row>
              <Col className="text-label label-with-separator">Create your account</Col>
            </Row>
            <Row className="text-headline">
              <Col xs="9">Your Profile</Col>
              {stepByStep && (
                <Col className="text-right step-title" xs="3">
                  Step 1
                </Col>
              )}
            </Row>
            <hr className="d-none d-md-block" />
            <Row className="pt-3 pt-md-0">
              <Col md="6">
                <div className={clsx(styles.avatar, 'w-100')}>
                  <input
                    ref={(ref) => (fileInput = ref)}
                    accept=".png,.jpeg,.jpg,.webp"
                    className="d-none"
                    id="avatarFileInput"
                    type="file"
                    onChange={onFileSelected}
                  />
                  <Image
                    roundedCircle
                    id="profileAvatar"
                    src={ResizedImageUrl(influencerProfile?.avatarUrl, 120)}
                    onClick={selectFile}
                  />
                  <Button
                    className={clsx(styles.upload, 'text-label text-all-cups')}
                    variant="dark"
                    onClick={selectFile}
                  >
                    change photo
                  </Button>
                </div>
              </Col>
              <Col className="pt-4 pt-md-0" md="6">
                <InputField required name="name" title="Enter your name" />

                <InputField required name="sport" title="Enter your sport" />

                <InputField required name="team" title="Enter your team name" />

                <InputField
                  required
                  textarea
                  className={styles.textarea}
                  name="profileDescription"
                  title="Enter description"
                />
              </Col>
            </Row>
            {!stepByStep && (
              <Row className="pb-4">
                <Col>
                  <Button className=" float-right text-label" type="submit" variant="secondary">
                    Submit
                  </Button>
                </Col>
              </Row>
            )}
          </Container>

          {stepByStep && <StepByStepRow loading={updatingProfile} />}
        </Form>
      </section>
    </Layout>
  );
}
