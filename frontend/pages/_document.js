// Brian's attempt at _document.js
import Document, { Head, Main, NextScript } from 'next/document';

// This as named import, not the default import!
import { ServerStyleSheet } from 'styled-components';

class MyDocument extends Document {
  static getInitialProps(ctx) {
    const origRenderPage = ctx.renderPage;
    const sheet = new ServerStyleSheet();
    const page = origRenderPage(App => {
      return props => sheet.collectStyles(<App {...props} />);
    });
    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags };
  }

  render() {
    return (
      <html>
        {/* Include the SSR style tags inside the head!! */}
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
