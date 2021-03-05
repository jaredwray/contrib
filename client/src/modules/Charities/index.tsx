import { useState, useCallback, useEffect, useRef, MouseEvent, ChangeEvent, SyntheticEvent } from 'react';

import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { Alert, Button, Container, Row, Col, ProgressBar, Form, InputGroup } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import { MyCharitiesQuery, CharitiesSearch, UpdateMyFavoriteCarities } from 'src/apollo/queries/charities';
import Layout from 'src/components/Layout';
import URLSearchParam from 'src/helpers/URLSearchParam';
import { Charity } from 'src/types/Charity';
import { UserAccount } from 'src/types/UserAccount';

import './styles.scss';
import 'src/components/Layout/Steps.scss';

const HIDE_ALERT_TIMEOUT_MS = 3500;

export default function CharitiesPage() {
  const stepByStep = URLSearchParam('sbs');
  const history = useHistory();
  const [updateError, setUpdateError] = useState('');
  const [successUpdateMessage, setSuccessUpdateMessage] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const { data: myAccountsData, error: favoriteCharitiesLoadingError } = useQuery<{
    favoriteCharities: Charity[];
    myAccount: UserAccount;
  }>(MyCharitiesQuery);
  const [updateMyFavoriteCarities] = useMutation(UpdateMyFavoriteCarities);
  const [executeSearch, { data: searchResult }] = useLazyQuery(CharitiesSearch);
  const [favoriteCharities, setFavoriteCharities] = useState<Charity[] | []>([]);
  const influencerProfile = myAccountsData?.myAccount?.influencerProfile;
  const searchInput = useRef(null);

  const onSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();

      const favoriteCharityIds = favoriteCharities.map((charity: Charity) => charity.id);
      updateMyFavoriteCarities({
        variables: { charities: favoriteCharityIds },
      })
        .then(() => {
          if (stepByStep) {
            history.replace('/welcome');
          } else {
            setSuccessUpdateMessage('Your profile has been successfully updated.');
          }
        })
        .catch((error) => setUpdateError(error.message));
    },
    [favoriteCharities, history],
  );

  const onInputSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;

    setSearchFilter(target.value);
  }, []);

  const selectedCharity = (charity: Charity) => favoriteCharities.some((e) => e.id === charity.id);

  const onSerchResultClick = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      e.preventDefault();
      const target = e.target as HTMLElement;

      if (target.tagName === 'BUTTON') {
        const selectedCharity = searchResult.charitiesSearch.filter(
          (charity: Charity) => charity.id === target.dataset.charityId,
        );

        if (target.parentElement?.classList.contains('selected')) {
          removeFromFavoriteCharities(target.dataset.charityId);
        } else {
          setFavoriteCharities(favoriteCharities.concat(selectedCharity));
        }
      }
    },
    [searchResult, favoriteCharities],
  );

  const onCancelBtnClick = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      // @ts-ignore: Object is possibly 'null'.
      searchInput && (searchInput.current.value = '');
      setSearchFilter('');
    },
    [searchFilter],
  );

  const removeFromFavoriteCharities = (charityId: string | undefined) => {
    if (charityId) {
      const filteredFavoriteCharities = favoriteCharities.filter((charity: Charity) => charity.id !== charityId);
      setFavoriteCharities(filteredFavoriteCharities);
    }
  };

  const onFavoritecharityClick = useCallback(
    (e: MouseEvent<HTMLUListElement>) => {
      e.preventDefault();
      const target = e.target as HTMLElement;

      removeFromFavoriteCharities(target.dataset.charityId);
    },
    [favoriteCharities],
  );

  useEffect(() => {
    executeSearch({ variables: { query: searchFilter } });
  }, [searchFilter]);

  useEffect(() => {
    influencerProfile && setFavoriteCharities(influencerProfile.favoriteCharities);
  }, [myAccountsData]);

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

  if (favoriteCharitiesLoadingError) {
    console.error('Data loading error: ', favoriteCharitiesLoadingError);
    return null;
  }

  return (
    <Layout>
      {stepByStep && <ProgressBar now={66} />}
      <section className="charities-page">
        <Form onSubmit={onSubmit}>
          {updateError && <Alert variant="danger">{updateError}</Alert>}
          {successUpdateMessage && <Alert variant="success">{successUpdateMessage}</Alert>}

          <Container>
            <Row>
              <Col className="text-label label-with-separator">Create your account</Col>
            </Row>
            <Row className="charities-page-title text-headline">
              <Col sm="9" xs="8">
                Your charities
              </Col>
              {stepByStep && (
                <Col className="text-right step-title" sm="3" xs="4">
                  Step 2
                </Col>
              )}
            </Row>
            <hr />
            <Row className="pt-3 pt-md-0">
              <Col md="6">
                <div className="text-subhead">Choose your charities</div>
                <div className="text-body pt-0 pt-md-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consectetur quis eu amet vitae sitsed
                  facilisi suscipit volutpat.
                </div>
              </Col>
              <Col className="pt-2 pt-md-0" md="6">
                <Form.Group
                  className={
                    'charities-search-container mb-0 ' + (searchResult?.charitiesSearch?.length ? 'active' : '')
                  }
                >
                  <Form.Label>Search</Form.Label>
                  <InputGroup>
                    <Form.Control
                      ref={searchInput}
                      className="charities-search-input"
                      placeholder="Search charities by name"
                      onChange={onInputSearchChange}
                    />
                    {searchFilter && (
                      <InputGroup.Append>
                        <Button
                          className="charities-search-cancel-btn text-all-cups text-label"
                          variant="link"
                          onClick={onCancelBtnClick}
                        >
                          Cancel
                        </Button>
                      </InputGroup.Append>
                    )}
                  </InputGroup>
                  <ul className="charities-search-result p-0 m-0" onClick={onSerchResultClick}>
                    {(searchResult?.charitiesSearch || []).map((charity: Charity) => (
                      <li
                        key={'search-result-' + charity.id}
                        className={
                          'charities-search-result-item text-label ' + (selectedCharity(charity) ? 'selected' : '')
                        }
                        title={charity.name}
                      >
                        <span>{charity.name}</span>
                        <Button data-charity-id={charity.id} />
                      </li>
                    ))}
                  </ul>
                </Form.Group>
                <ul className="charities-page-charities-list p-0 m-0" onClick={onFavoritecharityClick}>
                  {favoriteCharities.map((charity: Charity) => (
                    <li
                      key={'charity-item-' + charity.id}
                      className="charities-page-charity-item text-label align-middle"
                      title={charity.name}
                    >
                      <span>{charity.name}</span>
                      <Button data-charity-id={charity.id} />
                    </li>
                  ))}
                </ul>
              </Col>
            </Row>
            <Row className="buffer d-none d-md-block" />
            <hr />
            <Row className="pt-3 pt-md-0">
              <Col md="6">
                <div className="text-subhead">Don’t see your charity?</div>
                <div className="text-body pt-0 pt-md-2">
                  If your charity isn’t listed send us their info and we will add them to Contrib.
                </div>
              </Col>
              <Col className="pt-2 pt-md-0" md="6">
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control placeholder="Enter charity name" />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Contact</Form.Label>
                  <Form.Control placeholder="Enter website or social" />
                </Form.Group>
              </Col>
            </Row>
            {!stepByStep && (
              <Row>
                <Col>
                  <Button className="btn-ochre float-right" type="submit">
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
                  <a className="steps-prev-btn text-subhead" href="/profile?sbs=true">
                    Prev
                  </a>
                </Col>
                <Col className="steps-navigation-items" xs="6">
                  <Button className="btn-with-arrows steps-next-btn float-right" type="submit">
                    Finish
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
