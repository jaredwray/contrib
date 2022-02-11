import { FC } from 'react';

import Dinero from 'dinero.js';
import { Button } from 'react-bootstrap';

import InputField from 'src/components/forms/inputs/InputField';
import MoneyField from 'src/components/forms/inputs/MoneyField';
import { AuctionItem } from 'src/types/Auction';

import Row from '../../common/Row';
import styles from './styles.module.scss';

interface Props {
  formState: AuctionItem[];
  updating: boolean;
  handleAddItem: () => void;
  handleBack: () => void;
  handleRemoveCurrentItem: (id: string) => void;
  updateFormState: (name: string, value: string | Dinero.Dinero) => void;
}

const MAX_AUCTION_ITEMS = 10;

const MultipleItems: FC<Props> = ({
  formState,
  updating,
  handleAddItem,
  handleBack,
  handleRemoveCurrentItem,
  updateFormState,
}) => {
  const isMaxItems = formState.length >= MAX_AUCTION_ITEMS;
  const isButtonRemoveDisabled = formState.length <= 2;

  return (
    <section className="pb-5">
      {formState.map(({ id, name, contributor, fairMarketValue }, index) => (
        <Row
          key={id}
          withTitleSeparator
          childrenWrapperClassName="p-0"
          description={`Add information about your auction item ${index + 1}`}
          renderRemoveButton={() => (
            <Button
              className="mb-3"
              disabled={isButtonRemoveDisabled || updating}
              variant="light"
              onClick={handleRemoveCurrentItem.bind(null, id)}
            >
              Remove Item
            </Button>
          )}
          title={`Auction item ${index + 1}`}
        >
          <>
            <InputField
              disabled={updating}
              name={`name_${id}`}
              setValueToState={updateFormState}
              title="Item Name"
              valueFromState={name}
            />
            <InputField
              disabled={updating}
              name={`contributor_${id}`}
              setValueToState={updateFormState}
              title="Contributor"
              valueFromState={contributor}
            />
            <MoneyField
              disabled={updating}
              name={`fairMarketValue_${id}`}
              setValueToState={updateFormState}
              title="Fair Market Value"
              valueFromState={fairMarketValue}
            />
          </>
        </Row>
      ))}
      <div className={styles.buttonsWrapper}>
        <Button className="mr-5" disabled={updating} variant="light" onClick={handleBack}>
          Single Item
        </Button>
        <Button disabled={isMaxItems || updating} onClick={handleAddItem}>
          {isMaxItems ? 'Max items' : ' Add item'}
        </Button>
      </div>
    </section>
  );
};

export default MultipleItems;
