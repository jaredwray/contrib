import { FC } from 'react';

import TermsConfirmationDialog from 'src/components/TermsConfirmationDialog';

import Footer from './Footer';
import Header from './Header';

const Layout: FC = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <TermsConfirmationDialog />
      <Header />
      <main className="d-flex flex-column flex-grow-1" role="main">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
