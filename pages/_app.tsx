import "semantic-ui-css/semantic.min.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Container } from "semantic-ui-react";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        // <Container>
        <Component {...pageProps} />
        // </Container>
    );
}
export default MyApp;
