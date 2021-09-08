import { useCallback, useEffect, useState, useContext } from 'react';

import { useQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router-dom';

import { GetAuctionMediaQuery } from 'src/apollo/queries/auctions';
import AttachmentModal from 'src/components/AttachmentModal';
import StepByStepPageLayout from 'src/components/StepByStepPageLayout';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
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

const AuctionPhotoPage = () => {
  const { account } = useContext(UserAccountContext);
  const [selectedAttachment, setSelectedAttachment] = useState<AuctionAttachment | null>(null);
  const { auctionId } = useParams<{ auctionId: string }>();
  const history = useHistory();
  const { showWarning } = useShowNotification();
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
    history.push(`/auctions/${auctionId}/video`);
  }, [auctionId, history]);

  const handleSubmit = useCallback(() => {
    history.push(`/auctions/${auctionId}/price/starting`);
  }, [auctionId, history]);

  const closeModal = useCallback(() => {
    setSelectedAttachment(null);
  }, [setSelectedAttachment]);

  const description = (
    <span>
      You can provide a number of photos that show the item off from a couple of angles as well as any standout
      markings, signatures, etc.
    </span>
  );

  if (!account?.isAdmin && auction?.isActive) {
    history.push(`/`);
  }
  if (auction === null) {
    history.replace('/404');
    return null;
  }
  if (auction === undefined) {
    return null;
  }

  setPageTitle(`Auction ${auction.title} | Photo page`);

  return (
    <StepByStepPageLayout
      header="Auction an item"
      initialValues={{ photos: [], videos: [] }}
      loading={!!attachments?.loading.length}
      prevAction={handlePrevAction}
      progress={44.44}
      step="4"
      title="Photos"
      onSubmit={handleSubmit}
    >
      <AttachmentModal attachment={selectedAttachment} closeModal={closeModal} />
      <Row childrenWrapperCLassName={styles.dropzoneWrapper} description={description}>
        <UploadingDropzone
          accepted=".png, .jpeg, .jpg, .webp"
          attachments={attachments}
          auction={auction}
          isVideoPage={false}
          setAttachments={setAttachments}
          setErrorMessage={(message) => showWarning(message.toString())}
          setSelectedAttachment={setSelectedAttachment}
        />
      </Row>
    </StepByStepPageLayout>
  );
};

export default AuctionPhotoPage;
