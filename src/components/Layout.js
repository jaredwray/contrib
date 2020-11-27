import React from 'react'
import Head from 'next/head'
import NextNProgress from 'components/NextNProgress';
import Header from './Header'
import Footer from './Footer'
import { FormProvider } from 'components/FormContext'
import { BookingProvider } from 'components/BookingContext'
import { useSession } from 'next-auth/client'

const Layout = pageProps => {
  const [session] = useSession()

  const headerProps = {
    nav: {
      classes: pageProps.nav && pageProps.nav.classes,
      fixed: pageProps.nav && pageProps.nav.fixed,
      color: pageProps.nav && pageProps.nav.color,
      light: pageProps.nav && pageProps.nav.light,
      dark: pageProps.nav && pageProps.nav.dark
    },
    loggedUser: session && session.user,
    headerClasses: pageProps.headerClasses
  }
  return (
    <div style={{ paddingTop: pageProps.noPaddingTop ? '0' : '72px' }} className={pageProps.className}>
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&amp;family=Poppins:ital,wght@0,300;0,400;0,700;1,400&amp;display=swap" />
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.1/css/all.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/5.3.8/css/swiper.min.css" />
        <link rel="icon" href="/favicon.png" />
        <title>{pageProps.title} - Contrib</title>
      </Head>
      <NextNProgress color="#4E66F8" options={{ showSpinner: false }} />
      {!pageProps.hideHeader &&
        <Header {...headerProps} />
      }
      {pageProps.listingForm || pageProps.bookingForm ?
        <React.Fragment>
          {pageProps.listingForm &&
            <FormProvider>
              <main>{pageProps.children}</main>
            </FormProvider>
          }
          {pageProps.bookingForm &&
            <BookingProvider>
              <main>{pageProps.children}</main>
            </BookingProvider>
          }
        </React.Fragment>
        :
        <main>{pageProps.children}</main>
      }
      {!pageProps.hideFooter &&
        <Footer />
      }
    </div>
  )
}

export default Layout