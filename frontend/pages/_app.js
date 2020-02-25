import App from 'next/app';
// import { Fragment } from 'react';
import Page from '../components/Page';
// import App, { Component } from 'next/app';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Page>
        <Component {...pageProps} />
      </Page>
    );
  }
}

export default MyApp;
