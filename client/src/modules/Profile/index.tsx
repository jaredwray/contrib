import { useCallback, useEffect, useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { Alert, Button, Col, Container, Form, Image, ProgressBar, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Redirect, useHistory } from 'react-router-dom';

import { MyAccountQuery } from 'src/apollo/queries/myAccountQuery';
import { UpdateInfluencerProfileAvatarMutation, UpdateInfluencerProfileMutation } from 'src/apollo/queries/profile';
import Layout from 'src/components/Layout';
import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { useUrlQueryParam } from 'src/helpers/useUrlQueryParam';
import { UserAccount } from 'src/types/UserAccount';

import './styles.scss';
import 'src/components/Layout/Steps.scss';

const MAX_AVATAR_SIZE_MB = 2;
const HIDE_ALERT_TIMEOUT_MS = 3500;

export default function ProfilePage() {
  const [updateInfluencerProfile] = useMutation(UpdateInfluencerProfileMutation);
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
  const { register, errors: formErrors, handleSubmit } = useForm({
    defaultValues: {
      name: influencerProfile?.name,
      sport: influencerProfile?.sport,
      team: influencerProfile?.team,
      profileDescription: influencerProfile?.profileDescription,
    },
  });

  const onSubmit = useCallback(
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

  return (
    <Layout>
      {stepByStep && <ProgressBar now={33} />}
      <section className="profile-page">
        <Form onSubmit={handleSubmit(onSubmit)}>
          {updateError && <Alert variant="danger">{updateError}</Alert>}
          {successUpdateMessage && <Alert variant="success">{successUpdateMessage}</Alert>}

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
                <div className="profile-page-avatar w-100">
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
                  <Button className="picture-upload-btn text-label text-all-cups" onClick={selectFile}>
                    change photo
                  </Button>
                </div>
              </Col>
              <Col className="pt-4 pt-md-0" md="6">
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    ref={register({ required: 'required' })}
                    className={formErrors.name && 'is-invalid'}
                    name="name"
                    placeholder="Enter your name"
                  />
                  <ErrorMessage as="div" className="invalid-feedback" errors={formErrors} name="name" />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Sport</Form.Label>
                  <Form.Control
                    ref={register({ required: 'required' })}
                    className={formErrors.sport && 'is-invalid'}
                    name="sport"
                    placeholder="Enter your sport"
                  />
                  <ErrorMessage as="div" className="invalid-feedback" errors={formErrors} name="sport" />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Team</Form.Label>
                  <Form.Control
                    ref={register({ required: 'required' })}
                    className={formErrors.team && 'is-invalid'}
                    name="team"
                    placeholder="Enter your team name"
                  />
                  <ErrorMessage as="div" className="invalid-feedback" errors={formErrors} name="team" />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Why you are doing this (edit whenever)</Form.Label>
                  <Form.Control
                    ref={register({ required: 'required' })}
                    as="textarea"
                    className={formErrors.profileDescription && 'is-invalid'}
                    name="profileDescription"
                    placeholder="Enter description"
                    rows={5}
                  />
                  <ErrorMessage as="div" className="invalid-feedback" errors={formErrors} name="profileDescription" />
                </Form.Group>
              </Col>
            </Row>
            {!stepByStep && (
              <Row>
                <Col>
                  <Button className=" float-right text-label" type="submit" variant="secondary">
                    Submit
                  </Button>
                </Col>
              </Row>
            )}
          </Container>

          {stepByStep && (
            <Container fluid className="steps-navigation-container">
              <Row className="pl-4 pr-4">
                <Col className="steps-navigation-items" xs="6">
                  <div className="steps-prev-btn disabled text-subhead">Prev</div>
                </Col>
                <Col className="steps-navigation-items" xs="6">
                  <Button className="btn-with-arrows steps-next-btn float-right text-label" type="submit">
                    Next
                  </Button>
                </Col>
              </Row>
            </Container>
          )}
        </Form>
      </section>
    </Layout>
  );
}
