import { FC, useState } from 'react';

import InformationModal from 'src/components/modals/InformationModal';

interface Props {
  text: string;
  content: string;
  title?: string;
}

const InformationLink: FC<Props> = ({ text, title, content }) => {
  const [showInformationModal, setShowInformationModal] = useState(false);

  return (
    <>
      <div className="link" onClick={() => setShowInformationModal(true)}>
        {text}
      </div>
      <InformationModal
        open={showInformationModal}
        text={content}
        title={title || text}
        onClose={() => setShowInformationModal(false)}
      />
    </>
  );
};

export default InformationLink;
