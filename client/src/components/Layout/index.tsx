import Footer from './Footer';
import Header from './Header';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function Layout({ children }: { children: any }) {
  return (
    <div className="d-block d-md-flex flex-column min-vh-100">
      <Header />
      <main className="d-block d-md-flex flex-column flex-grow-1" role="main">
        {children}
      </main>
      <Footer />
    </div>
  );
}
