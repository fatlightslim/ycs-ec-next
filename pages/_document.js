import Document, { Html, Head, Main, NextScript } from "next/document"
import basicAuthMiddleware from "nextjs-basic-auth-middleware"

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const { req, res } = ctx

    // await basicAuthMiddleware(req, res, {
    //   includePaths: ["/", '/setting'],
    //   excludePaths: ["/api"],
    // })
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="robots" content="noindex , nofollow" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
