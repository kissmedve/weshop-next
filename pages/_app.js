import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "../node_modules/bulma/css/bulma.css";
import "../styles/globals.css";
import Layout from "../components/Layout";
import { SessionProvider } from "next-auth/react";

config.autoAddCss = false;

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;
