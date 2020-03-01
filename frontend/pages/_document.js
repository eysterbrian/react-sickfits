// Brian's attempt at _document.js
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    // const origRenderPage = ctx.renderPage;
    const sheet = new ServerStyleSheet();
    const page = renderPage(App => {
      return props => sheet.collectStyles(<App {...props} />);
    });
    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags };
  }

  render() {
    return (
      <html>
        <Head>{this.props.styleTags}</Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default MyDocument;
