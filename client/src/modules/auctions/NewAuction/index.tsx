import { useCallback, useState, useEffect } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';

import {
  CreateAuctionMutation,
  AddAuctionMediaMutation,
  ContentStorageAuthDataQuery,
  FinishAuctionCreationMutation,
} from 'src/apollo/queries/auctions';
import AsyncButton from 'src/components/buttons/AsyncButton';
import Form from 'src/components/forms/Form/Form';
import Layout from 'src/components/layouts/Layout';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { useShowNotification } from 'src/helpers/useShowNotification';
import { AuctionAttachmentInput } from 'src/types/inputs/AuctionAttachmentInput';

import Attachments from './Attachments';
import Details from './Details';
import IFormState from './IFormState';
import styles from './styles.module.scss';

const NewAuction = () => {
  const [fileForCover, setFileForCover] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [formState, setFormState] = useState<IFormState>({
    missed: ['attachments', 'title', 'startPrice', 'fairMarketValue', 'charity'],
    errors: [],
  });
  const [creating, setCreating] = useState(false);
  const { showError, showMessage } = useShowNotification();
  const history = useHistory();

  const { data: storageAuthData } = useQuery(ContentStorageAuthDataQuery);
  const [finishAuctionCreation] = useMutation(FinishAuctionCreationMutation);
  const [addAuctionMedia] = useMutation(AddAuctionMediaMutation);
  const [createAuction] = useMutation(CreateAuctionMutation, {
    async onCompleted({ createAuction }) {
      const auctionId = createAuction.id;

      await Promise.all(
        files.map(async (file, index) => {
          const input = { file, filename: file.name } as AuctionAttachmentInput;

          if (file.type.startsWith('video/')) {
            input.uid = await cloudflareUpload(file);
          }
          if (fileForCover === index) {
            input.forCover = true;
          }

          await addAuctionMedia({
            variables: { id: auctionId, input },
          });
        }),
      );

      try {
        await finishAuctionCreation({ variables: { id: auctionId } });
      } catch (error: any) {
        showError(error.message);
      }

      showMessage('Created');
      history.push(`/auctions/${auctionId}/done`);
    },
  });

  const cloudflareUpload = useCallback(
    async (file: File) => {
      const { authToken, accountId } = storageAuthData.getContentStorageAuthData;
      const formData = new FormData();
      formData.append('file', file, file.name);

      try {
        let uid;
        await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/stream`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => (uid = data.result.uid));

        return uid;
      } catch (error) {
        return undefined;
      }
    },
    [storageAuthData],
  );
  const onSubmit = useCallback(
    async (values) => {
      try {
        const input = { ...values, duration: Number(values.duration) };
        setCreating(true);
        await createAuction({ variables: { input } });
      } catch (error: any) {
        showError(error.message);
      }
    },
    [showError, createAuction],
  );
  const checkMissed = useCallback(
    (name: string, value: any) => {
      const hasValue = value.hasOwnProperty('length') ? value.length > 0 : value.amount > 0;
      const blankValue = value.hasOwnProperty('length') ? value.length === 0 : value.amount === 0;

      if (hasValue && formState?.missed?.includes(name))
        setFormState((prevState) => {
          return {
            ...prevState,
            missed: prevState.missed.filter((value, index) => value !== name),
          };
        });

      if (blankValue && !formState?.missed?.includes(name))
        setFormState((prevState) => {
          return {
            ...prevState,
            missed: [...new Set([...prevState.missed, name])],
          };
        });
    },
    [setFormState, formState?.missed],
  );

  useEffect(() => checkMissed('attachments', files), [files, checkMissed]);

  setPageTitle('New Auction');

  return (
    <Layout>
      <div className={clsx(styles.root, 'text-center')}>
        <section className={clsx(styles.section, styles.title, 'm-auto py-4')}>
          Let’s quickly create your new auction!
        </section>
        <Form className={styles.form} initialValues={{}} onSubmit={onSubmit}>
          <Attachments
            disabled={creating}
            fileForCover={fileForCover}
            files={files}
            setFileForCover={setFileForCover}
            setFiles={setFiles}
          />
          <section className={clsx(styles.section, 'm-auto py-4')}>
            <Details checkMissed={checkMissed} disabled={creating} />
            <AsyncButton
              className={clsx(styles.button, 'w-100 mt-4')}
              disabled={formState?.missed?.length > 0}
              loading={creating}
              type="submit"
            >
              Create Auction
            </AsyncButton>
          </section>
        </Form>
      </div>
    </Layout>
  );
};

export default NewAuction;
