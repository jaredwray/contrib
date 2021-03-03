import { useState, useCallback, useEffect, useRef, MouseEvent, ChangeEvent, SyntheticEvent } from 'react';

import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { Alert, Button, Container, Row, Col, ProgressBar, Form, InputGroup } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import { MyCharitiesQuery, CharitiesSearch, UpdateMyFavoriteCarities } from 'src/apollo/queries/charities';
import Layout from 'src/components/Layout';
import URLSearchParam from 'src/helpers/URLSearchParam';
import useOutsideClick from 'src/helpers/useOutsideClick';
import { Charity } from 'src/types/Charity';
import { UserAccount } from 'src/types/UserAccount';

import './styles.scss';
import 'src/components/Layout/Steps.scss';

const HIDE_ALERT_TIMEOUT_MS = 3500;

export default function CharitiesPage() {
  const stepByStep = URLSearchParam('sbs');
  const history = useHistory();

  const [state, setState] = useState({
    updateError: '',
    successUpdateMessage: '',
    searchQuery: '',
    favoriteCharities: [] as Charity[],
  });

  const { data: myAccountsData, error: favoriteCharitiesLoadingError } = useQuery<{
    favoriteCharities: Charity[];
    myAccount: UserAccount;
  }>(MyCharitiesQuery);
  const [updateMyFavoriteCarities] = useMutation(UpdateMyFavoriteCarities);
  const [executeSearch, { data: searchResult }] = useLazyQuery(CharitiesSearch);
  const influencerProfile = myAccountsData?.myAccount?.influencerProfile;
  const searchInput = useRef(null);
  const searchConteiner = useRef(null);

  const clearAndCloseSearch = useCallback(() => {
    // @ts-ignore: Object is possibly 'null'.
    searchInput && (searchInput.current.value = '');
    updateState('searchQuery', '');
  }, [state.searchQuery]);

  useOutsideClick(searchConteiner, clearAndCloseSearch);

  const updateState = (key: string, value: string | Charity[]) => {
    setState((prevState) => {
      return { ...prevState, [key]: value };
    });
  };

  const onSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();

      const favoriteCharityIds = state.favoriteCharities.map((charity: Charity) => charity.id);
      updateMyFavoriteCarities({
        variables: { charities: favoriteCharityIds },
      })
        .then(() => {
          if (stepByStep) {
            history.replace('/welcome');
          } else {
            updateState('successUpdateMessage', 'Your profile has been successfully updated.');
          }
        })
        .catch((error) => updateState('updateError', error.message));
    },
    [state.favoriteCharities, history],
  );

  const onInputSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;

    updateState('searchQuery', target.value);
  }, []);

  const selectedCharity = (charity: Charity) => state.favoriteCharities.some((e) => e.id === charity.id);

  const removeFromFavoriteCharities = (charityId: string | undefined) => {
    if (charityId) {
      const filteredFavoriteCharities = state.favoriteCharities.filter((charity: Charity) => charity.id !== charityId);
      updateState('favoriteCharities', filteredFavoriteCharities);
    }
  };

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
          updateState('favoriteCharities', state.favoriteCharities.concat(selectedCharity));
        }
      }
    },
    [searchResult, state.favoriteCharities],
  );

  const onFavoriteCharityClick = useCallback(
    (e: MouseEvent<HTMLUListElement>) => {
      e.preventDefault();
      const target = e.target as HTMLElement;

      removeFromFavoriteCharities(target.dataset.charityId);
    },
    [state.favoriteCharities],
  );

  useEffect(() => {
    executeSearch({ variables: { query: state.searchQuery } });
  }, [state.searchQuery]);

  useEffect(() => {
    influencerProfile && updateState('favoriteCharities', influencerProfile.favoriteCharities);
  }, [myAccountsData]);

  useEffect(() => {
    state.successUpdateMessage &&
      setTimeout(() => {
        updateState('successUpdateMessage', '');
      }, HIDE_ALERT_TIMEOUT_MS);
  }, [state.successUpdateMessage]);

  useEffect(() => {
    state.updateError &&
      setTimeout(() => {
        updateState('updateError', '');
      }, HIDE_ALERT_TIMEOUT_MS);
  }, [state.updateError]);

  if (favoriteCharitiesLoadingError) {
    console.error('Data loading error: ', favoriteCharitiesLoadingError);
    return null;
  }

  return (
    <Layout>
      {stepByStep && <ProgressBar now={66} />}
      <section className="charities-page">
        <Form onSubmit={onSubmit}>
          {state.updateError && <Alert variant="danger">{state.updateError}</Alert>}
          {state.successUpdateMessage && <Alert variant="success">{state.successUpdateMessage}</Alert>}

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
                  ref={searchConteiner}
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
                    {state.searchQuery && (
                      <InputGroup.Append>
                        <Button
                          className="charities-search-cancel-btn with-input text-all-cups text-label"
                          variant="link"
                          onClick={clearAndCloseSearch}
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
                <ul className="charities-page-charities-list p-0 m-0" onClick={onFavoriteCharityClick}>
                  {state.favoriteCharities.map((charity: Charity) => (
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
