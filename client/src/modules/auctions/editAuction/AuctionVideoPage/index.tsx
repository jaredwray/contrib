import { useCallback, useEffect, useState, useContext } from 'react';

import { useQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router-dom';

import { GetAuctionMediaQuery } from 'src/apollo/queries/auctions';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import StepByStepPageLayout from 'src/components/layouts/StepByStepPageLayout';
import AttachmentModal from 'src/components/modals/AttachmentModal';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { useShowNotification } from 'src/helpers/useShowNotification';
import { AuctionAttachment } from 'src/types/Auction';

import Row from '../common/Row';
import UploadingDropzone from '../common/UploadingDropzone';
import styles from './styles.module.scss';

interface AttachmentsStateInterface {
  uploaded: AuctionAttachment[];
  loading: File[];
}

const AuctionVideoPage = () => {
  const { account } = useContext(UserAccountContext);
  const [selectedAttachment, setSelectedAttachment] = useState<AuctionAttachment | null>(null);
  const { auctionId } = useParams<{ auctionId: string }>();
  const history = useHistory();
  const { showError, showWarning } = useShowNotification();
  const [attachments, setAttachments] = useState<AttachmentsStateInterface>({
    uploaded: [],
    loading: [],
  });
  const { data: auctionData } = useQuery(GetAuctionMediaQuery, {
    variables: { id: auctionId },
    fetchPolicy: 'cache-and-network',
  });
  const auction = auctionData?.auction;
  useEffect(() => {
    if (!auction) return;

    setAttachments((prevState: any) => {
      return {
        ...prevState,
        uploaded: auction.attachments,
        loading: [],
      };
    });
  }, [auction]);

  const handlePrevAction = useCallback(() => {
    history.push(`/auctions/${auctionId}/description`);
  }, [auctionId, history]);

  const handleSubmit = useCallback(() => {
    if (attachments.uploaded.length === 0) {
      showError('You need to upload at least one attachment');
    } else {
      history.push(`/auctions/${auctionId}/photo`);
    }
  }, [showError, attachments.uploaded.length, auctionId, history]);

  const closeModal = useCallback(() => {
    setSelectedAttachment(null);
  }, [setSelectedAttachment]);

  const description =
    'Provide a single video (preferably portrait mode) that shows the item off and talks to what makes it special.';

  if (!account?.isAdmin && auction?.isActive) {
    history.push(`/`);
    return null;
  }
  if (auction === null) {
    history.replace('/404');
    return null;
  }
  if (auction === undefined) {
    return null;
  }

  setPageTitle(`Auction ${auction.title} | Video page`);

  return (
    <StepByStepPageLayout
      header="Auction an item"
      initialValues={{ photos: [], videos: [] }}
      loading={!!attachments?.loading.length}
      prevAction={handlePrevAction}
      progress={30}
      step="3"
      title="Videos"
      onSubmit={handleSubmit}
    >
      <AttachmentModal attachment={selectedAttachment} closeModal={closeModal} />
      <Row childrenWrapperClassName={styles.dropzoneWrapper} description={description}>
        <UploadingDropzone
          accepted=".mp4, .webm, .opgg, .mov"
          attachments={attachments}
          auction={auction}
          isVideoPage={true}
          setAttachments={setAttachments}
          setErrorMessage={(message) => showWarning(message.toString())}
          setSelectedAttachment={setSelectedAttachment}
        />
      </Row>
    </StepByStepPageLayout>
  );
};

export default AuctionVideoPage;
