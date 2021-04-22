import { useState, useEffect } from 'react';

const VERSION = '1.0';

export default function TermsText() {
  const [termsHtml, setTermsHtml] = useState('');
  const source = `/content/terms/${VERSION}.html`;

  useEffect(() => {
    fetch(source)
      .then((response) => response.text())
      .then((text) => setTermsHtml(text));
  });

  return <div className="terms text--body" dangerouslySetInnerHTML={{ __html: termsHtml }} />;
}
