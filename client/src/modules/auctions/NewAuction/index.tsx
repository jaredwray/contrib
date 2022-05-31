import { useCallback, useState, useEffect, useContext } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { useHistory, useParams } from 'react-router-dom';

import {
  CreateAuctionMutation,
  AddAuctionMediaMutation,
  ContentStorageAuthDataQuery,
  FinishAuctionCreationMutation,
} from 'src/apollo/queries/auctions';
import AsyncButton from 'src/components/buttons/AsyncButton';
import Form from 'src/components/forms/Form/Form';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import Layout from 'src/components/layouts/Layout';
import { MIN_BID_STEP_VALUE } from 'src/constants';
import resizedImageUrl from 'src/helpers/resizedImageUrl';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { useShowNotification } from 'src/helpers/useShowNotification';
import { AuctionAttachment } from 'src/types/Auction';
import { AuctionAttachmentInput } from 'src/types/inputs/AuctionAttachmentInput';

import Attachments from './Attachments';
import Details from './Details';
import { IFormState } from './IFormState';
import styles from './styles.module.scss';

const NewAuction = () => {
  const { ownerId } = useParams<{ ownerId: string }>();
  const { account } = useContext(UserAccountContext);
  const [fileForCover, setFileForCover] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [formState, setFormState] = useState<IFormState>({
    missed: ['attachments', 'title', 'startPrice', 'fairMarketValue', 'charity'],
    errors: {},
  });
  const [creating, setCreating] = useState(false);
  const [ready, setReady] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [auctionId, setAuctionId] = useState('');
  const [timeNow, setTimeNow] = useState(Date.now());
  const { showError, showMessage, showWarning } = useShowNotification();
  const history = useHistory();

  const { data: storageAuthData } = useQuery(ContentStorageAuthDataQuery);
  const [finishAuctionCreation] = useMutation(FinishAuctionCreationMutation);
  const [addAuctionMedia] = useMutation(AddAuctionMediaMutation);
  const [createAuction] = useMutation(CreateAuctionMutation, {
    async onCompleted({ createAuction }) {
      const newAuctionId = createAuction.id;
      setAuctionId(newAuctionId);

      await Promise.all(
        files.map(async (file, index) => {
          const input = { file, filename: file.name } as AuctionAttachmentInput;

          if (file.type.startsWith('video/')) {
            input.uid = await cloudflareUpload(file);
          }
          if (fileForCover === index) {
            input.forCover = true;
          }

          const response = await addAuctionMedia({ variables: { id: newAuctionId, input } });
          const attachment = response.data.addAuctionAttachment;

          if (index === fileForCover) setCoverImageUrl(coverImagePath(attachment));
        }),
      );

      try {
        await finishAuctionCreation({ variables: { id: newAuctionId } });

        showMessage('Created');
        updateState();
        setTimeout(redirectToNextPage, 2500);
      } catch (error) {
        showError(error.message);
        setCreating(false);
      }
    },
  });

  const coverImagePath = (attachment: AuctionAttachment) => {
    if (attachment.type === 'VIDEO') return `${attachment.thumbnail}?width=800&`;

    return resizedImageUrl(attachment.url, 480) + '?';
  };

  const updateState = useCallback(() => {
    if (ready) return;

    setTimeNow(Date.now());
    setTimeout(() => updateState(), 500);
  }, [ready, setTimeNow]);
  const redirectToNextPage = useCallback(() => {
    auctionId && history.push(`/auctions/${auctionId}/done`);
  }, [history, auctionId]);

  const cloudflareUpload = useCallback(
    async (file: File) => {
      const { authToken, accountId } = storageAuthData.getContentStorageAuthData;
      const formData = new FormData();
      formData.append('file', file, file.name);

      try {
        let uid;
        await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/stream`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${authToken}` },
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
  const validateFormValues = useCallback(
    (values: any) => {
      const errors = {} as any;

      if (values.title?.length === 0) errors.title = 'Cannot be blank';
      if (values.startPrice?.amount === 0) errors.startPrice = 'Cannot be zero';
      if (values.fairMarketValue?.amount === 0) errors.fairMarketValue = 'Cannot be zero';
      if (!values.charity) errors.charity = 'Cannot be blank';
      if (values.bidStep?.amount !== undefined && values.bidStep?.amount < MIN_BID_STEP_VALUE * 100)
        errors.bidStep = `Should be more than $${MIN_BID_STEP_VALUE}`;
      if (values.itemPrice?.amount > 0 && values.startPrice?.amount >= values.itemPrice?.amount)
        errors.itemPrice = `Should be more than Starting Bid Price`;

      setFormState((prevState) => {
        return { ...prevState, errors };
      });

      return errors;
    },
    [setFormState],
  );
  const onSubmit = useCallback(
    async (values) => {
      if (files.length === 0) {
        showWarning('You should select at least one file');
        return;
      }

      const input = { ...values, duration: Number(values.duration) };
      if (ownerId) input.organizerId = ownerId;

      const errors = validateFormValues(values);

      if (Object.keys(errors).length) {
        showWarning('Some values are invalid');
        return;
      }

      try {
        setCreating(true);
        await createAuction({ variables: { input } });
      } catch (error: any) {
        showError(error.message);
        setCreating(false);
      }
    },
    [showError, showWarning, validateFormValues, createAuction, files.length, ownerId],
  );

  const checkMissed = useCallback(
    (name: string, value: any) => {
      const valueLengthOrAmount = value.hasOwnProperty('length') ? value.length : value.amount;
      const hasValue = valueLengthOrAmount > 0;
      const blankValue = valueLengthOrAmount === 0;

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
  useEffect(() => {
    ready && redirectToNextPage();
  }, [ready, redirectToNextPage]);

  if (ownerId && account?.assistant) {
    const assistantInfluencerIds = account?.assistant?.influencerIds || [];

    if (!assistantInfluencerIds.includes(ownerId)) {
      history.replace('/');
      return null;
    }
  }

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
            <Details checkMissed={checkMissed} disabled={creating} errors={formState?.errors} />
            <div className=" mx-3 mx-md-0">
              <AsyncButton
                className={clsx(styles.button, 'w-100 mt-4')}
                disabled={formState?.missed?.length > 0}
                loading={creating}
                type="submit"
              >
                Create Auction
              </AsyncButton>
            </div>
          </section>
        </Form>
        {coverImageUrl && (
          <img
            alt=""
            className={styles.coverImage}
            src={`${coverImageUrl}n=${timeNow}`}
            onError={(event) => setReady(false)}
            onLoad={(event) => setReady(true)}
          />
        )}
      </div>
    </Layout>
  );
};

export default NewAuction;
