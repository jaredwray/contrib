import React, { FC } from 'react';

import InputField from 'src/components/Form/InputField';
import SwitchField from 'src/components/Form/SwitchField';

import styles from './styles.module.scss';

const BasicForm: FC<{}> = () => {
  return (
    <div>
      <InputField required name="title" placeholder="Enter auction title" title="Auction title" />
      <SwitchField className="mb-2" name="gameWorn" title="Game worn" />
      <SwitchField className="mb-2" name="autographed" title="Autographed" />
      <SwitchField className="mb-4" name="authenticityCertificate" title="Certificate of authenticity" />
      <InputField name="playedIn" placeholder="Enter teams and date" title="Game played in" />
      <InputField
        textarea
        className={styles.description}
        externalText="This is the short one or two sentence description that will be used to describe the item when shared on social networks like Twitter and Facebook."
        name="description"
        placeholder="Enter short description"
        title="Short description"
      />
      <InputField
        textarea
        className={styles.fullPageDescription}
        externalText="This is the full description that will appear on the Contrib auction page along side the bidding box etc."
        name="fullPageDescription"
        placeholder="Enter full description"
        title="Full description"
      />
    </div>
  );
};

export default BasicForm;
