import { FC, useState, useEffect } from 'react';

import { format as dateFormat } from 'date-fns';
import { toDate } from 'date-fns-tz';
import { Accordion, Card } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

import { TermsInput } from 'src/types/TermsInput';

import styles from './styles.module.scss';

interface Props {
  eventKey: string;
  terms: TermsInput;
  role: string;
  roleInTitle: string;
}

const PrivacyCard: FC<Props> = ({ eventKey, terms, role, roleInTitle }) => {
  const [mdText, setMdText] = useState('');
  const termsDate = dateFormat(toDate(terms.date), 'MMM dd yyyy');
  const source = `/content/terms/${role}_${terms.version}.md`;

  useEffect(() => {
    fetch(source)
      .then((response) => response.text())
      .then((text) => setMdText(text));
  });

  return (
    <Card>
      <Accordion.Toggle as={Card.Header} className="cursor-pointer" eventKey={eventKey}>
        Privacy and Terms for {roleInTitle} since {termsDate}
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={eventKey}>
        <Card.Body className={styles.terms}>
          <ReactMarkdown>{mdText}</ReactMarkdown>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
};

export default PrivacyCard;
