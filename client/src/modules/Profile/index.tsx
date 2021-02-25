import { Alert, Button, Container, Image, Row, Col, ProgressBar, Form } from 'react-bootstrap';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useState, useCallback, useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

import ResizedImageUrl from '../../helpers/ResizedImageUrl';
import URLSearchParam from '../../helpers/URLSearchParam';
import Layout from '../../components/Layout';
import { UserAccount } from '../../types/UserAccount';
import { MyAccountQuery } from '../../apollo/queries/MyAccountQuery';

import './styles.scss';
import '../../components/Layout/Steps.scss';

const UpdateInfluencerProfileMutation = gql`
  mutation UpdateInfluencerProfile($name: String!, $sport: String!, $team: String!, $profileDescription: String!) {
    updateMyInfluencerProfile(
      input: { name: $name, sport: $sport, team: $team, profileDescription: $profileDescription }
    ) {
      id
    }
  }
`;

const UpdateInfluencerProfileAvatarMutation = gql`
  mutation UpdateInfluencerProfileAvatar($image: Upload!) {
    updateMyInfluencerProfileAvatar(image: $image) {
      id
    }
  }
`;

const MAX_AVATAR_SIZE_MB = 2;
const HIDE_ALERT_TIMEOUT_MS = 3500;

export default function Profile() {
  const [updateInfluencerProfile] = useMutation(UpdateInfluencerProfileMutation);
  const [updateInfluencerProfileAvatar] = useMutation(UpdateInfluencerProfileAvatarMutation);

  let fileInput: HTMLInputElement | null = null;
  const stepByStep = URLSearchParam('sbs');
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
      let image = event.target.files[0];

      if (!image) return;

      let fileSizeInMegaBytes = image.size / (1024 * 1024);

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

      let avatar = document.getElementById('profileAvatar') as HTMLImageElement;
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
      <ProgressBar now={33} />
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
              <Col xs="3" className="text-right step-title">
                Step 1
              </Col>
            </Row>
            <hr className="d-none d-md-block" />
            <Row className="pt-3 pt-md-0">
              <Col md="6">
                <div className="profile-page-avatar w-100">
                  <input
                    type="file"
                    className="d-none"
                    id="avatarFileInput"
                    accept=".png,.jpeg,.jpg,.webp"
                    ref={(ref) => (fileInput = ref)}
                    onChange={onFileSelected}
                  />
                  <Image
                    id="profileAvatar"
                    src={ResizedImageUrl(influencerProfile?.avatarUrl, 120)}
                    roundedCircle
                    onClick={selectFile}
                  />
                  <Button className="picture-upload-btn text-label text-all-cups" onClick={selectFile}>
                    change photo
                  </Button>
                </div>
              </Col>
              <Col md="6">
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    placeholder="Enter your name"
                    className={formErrors.name && 'is-invalid'}
                    name="name"
                    ref={register({ required: 'required' })}
                  />
                  <ErrorMessage className="invalid-feedback" name="name" as="div" errors={formErrors} />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Sport</Form.Label>
                  <Form.Control
                    placeholder="Enter your sport"
                    className={formErrors.sport && 'is-invalid'}
                    name="sport"
                    ref={register({ required: 'required' })}
                  />
                  <ErrorMessage className="invalid-feedback" name="sport" as="div" errors={formErrors} />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Team</Form.Label>
                  <Form.Control
                    placeholder="Enter your team name"
                    className={formErrors.team && 'is-invalid'}
                    name="team"
                    ref={register({ required: 'required' })}
                  />
                  <ErrorMessage className="invalid-feedback" name="team" as="div" errors={formErrors} />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Why you are doing this (edit whenever)</Form.Label>
                  <Form.Control
                    placeholder="Enter description"
                    as="textarea"
                    rows={5}
                    className={formErrors.profileDescription && 'is-invalid'}
                    name="profileDescription"
                    ref={register({ required: 'required' })}
                  />
                  <ErrorMessage className="invalid-feedback" name="profileDescription" as="div" errors={formErrors} />
                </Form.Group>
              </Col>
            </Row>
            {!stepByStep && (
              <Row>
                <Col>
                  <Button type="submit" className="btn-ochre float-right">
                    Submit
                  </Button>
                </Col>
              </Row>
            )}
          </Container>

          {stepByStep && (
            <Container fluid className="steps-navigation-container">
              <Row className="pl-4 pr-4">
                <Col xs="6" className="steps-navigation-items">
                  <div className="steps-prev-btn disabled text-subhead">Prev</div>
                </Col>
                <Col xs="6" className="steps-navigation-items">
                  <Button type="submit" className="btn-with-arrows steps-next-btn float-right">
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
