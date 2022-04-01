import { useCallback, useContext, useState, useMemo } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import clsx from 'clsx';
import Dinero from 'dinero.js';
import { Button } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { GetAuctionDetailsQuery, UpdateAuctionMutation } from 'src/apollo/queries/auctions';
import MoneyField from 'src/components/forms/inputs/MoneyField';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import StepByStepPageLayout from 'src/components/layouts/StepByStepPageLayout';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { trimObject } from 'src/helpers/trimObject';
import { useShowNotification } from 'src/helpers/useShowNotification';
import { AuctionItem } from 'src/types/Auction';

import Row from '../common/Row';
import MultipleFMV from './MultipleFairMarketValue';
import styles from './styles.module.scss';

const FairMarketValuePage = () => {
  const { account } = useContext(UserAccountContext);
  const { auctionId } = useParams<{ auctionId: string }>();
  const { showMessage, showError, showWarning } = useShowNotification();
  const history = useHistory();

  const generateInitialValuesForAuctionItem = useCallback(
    () => ({
      id: uuidv4(),
      name: '',
      contributor: '',
      fairMarketValue: { amount: 0, currency: 'USD' as Dinero.Currency },
    }),
    [],
  );

  const [formState, setFormState] = useState<AuctionItem[]>([
    generateInitialValuesForAuctionItem(),
    generateInitialValuesForAuctionItem(),
  ]);

  const [isMultipleFMV, setIsMultipleFMV] = useState(false);

  const { loading: isLoadingQuery, data: auctionData } = useQuery(GetAuctionDetailsQuery, {
    variables: { id: auctionId },
    /* istanbul ignore next */
    onCompleted({ auction }) {
      const auctionItems = auction?.items;

      if (!auctionItems?.length) return;

      setIsMultipleFMV(true);
      setFormState(
        auctionItems.map(({ id, name, contributor, fairMarketValue }: any) => ({
          id,
          name,
          contributor,
          fairMarketValue,
        })),
      );
    },
  });

  const auction = auctionData?.auction;
  const { isActive, fairMarketValue } = auction || {};

  const [updateAuction, { loading: updating }] = useMutation(UpdateAuctionMutation, {
    /* istanbul ignore next */
    onCompleted() {
      if (isActive) {
        history.goBack();
      } else {
        history.push(`/auctions/${auctionId}/duration`);
      }
    },
  });

  const initialValues = useMemo(
    () => ({
      fairMarketValue: Dinero(fairMarketValue).toObject(),
    }),
    [fairMarketValue],
  );

  const isValidAuctionItemsData = useCallback(
    (fields: AuctionItem[]) => {
      if (fields.some(({ fairMarketValue }) => fairMarketValue.amount === 0)) {
        showWarning('Fair Market Value for auction item can not be zero');
        return false;
      }
      if (fields.some(({ name }) => !name)) {
        showWarning(`Item name can not be blank`);
        return false;
      }
      if (fields.some(({ contributor }) => !contributor)) {
        showWarning(`Contributor name can not be blank`);
        return false;
      }
      return true;
    },
    [showWarning],
  );

  const tryToUpdateAuction = useCallback(
    async (variables: any) => {
      try {
        await updateAuction({ variables: { id: auctionId, ...variables } });
        if (isActive) showMessage('Updated');
      } catch (error: any) {
        showError(error.message);
      }
    },
    [auctionId, isActive, updateAuction, showError, showMessage],
  );

  const updateAuctionItemsFMV = useCallback(
    async (formState: AuctionItem[]) => {
      const trimmedFormState = formState.map((item) => trimObject(item));

      if (!isValidAuctionItemsData(trimmedFormState)) return;

      tryToUpdateAuction({ items: trimmedFormState });
    },
    [tryToUpdateAuction, isValidAuctionItemsData],
  );

  const updateAuctionFMV = useCallback(
    async (fairMarketValue) => {
      if (fairMarketValue.amount === 0) {
        showWarning('Fair Market Value can not be zero');
        return;
      }

      tryToUpdateAuction({ fairMarketValue });
    },
    [tryToUpdateAuction, showWarning],
  );

  const handleSubmit = useCallback(
    async (values) => {
      if (isMultipleFMV) {
        updateAuctionItemsFMV(formState);
        return;
      }

      updateAuctionFMV(values.fairMarketValue);
    },
    [formState, isMultipleFMV, updateAuctionFMV, updateAuctionItemsFMV],
  );

  const handlePrevAction = useCallback(() => {
    history.push(`/auctions/${auctionId}/bids-step`);
  }, [auctionId, history]);

  const handleIsMultipleItems = useCallback(() => setIsMultipleFMV(true), [setIsMultipleFMV]);

  const updateFormState = useCallback((name: string, value: string | Dinero.DineroObject) => {
    const [itemFieldName, itemId] = name.split('_');

    setFormState((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return { ...item, [itemFieldName]: value };
        }

        return item;
      }),
    );
  }, []);

  const handleAddItem = useCallback(() => {
    setFormState((prev) => [...prev, generateInitialValuesForAuctionItem()]);
  }, [generateInitialValuesForAuctionItem]);

  const handleRemoveCurrentItem = useCallback((id: string) => {
    setFormState((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleBack = useCallback(() => {
    setIsMultipleFMV(false);
  }, []);

  if (!account?.isAdmin && isActive) {
    history.push(`/`);
    return null;
  }
  if (auction === null) {
    history.replace('/404');
    return null;
  }
  if (auction === undefined) return null;

  setPageTitle(`Edit Auction ${auction.title} | Fair Market Value`);

  return (
    <StepByStepPageLayout
      header="Auction an item"
      initialValues={initialValues}
      isActive={isActive}
      loading={updating}
      prevAction={handlePrevAction}
      step={7}
      title={`${isActive ? 'Edit ' : ''}Fair Market Value`}
      onSubmit={handleSubmit}
    >
      {isMultipleFMV ? (
        <MultipleFMV
          formState={formState}
          handleAddItem={handleAddItem}
          handleBack={handleBack}
          handleRemoveCurrentItem={handleRemoveCurrentItem}
          updateFormState={updateFormState}
          updating={updating}
        />
      ) : (
        <>
          <Row description="The fair market value is the price something would sell for on the open market. A good example of this is a jersey signed or not would have a fair market value of $99 dollars which is what it is online.">
            {!isLoadingQuery && <MoneyField name="fairMarketValue" />}
          </Row>
          <Button className={clsx(styles.multipleItemsButton, 'mb-0 mb-md-4')} onClick={handleIsMultipleItems}>
            Multiple Items
          </Button>
        </>
      )}
    </StepByStepPageLayout>
  );
};

export default FairMarketValuePage;
