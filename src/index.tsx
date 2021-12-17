import ReactDOM from "react-dom";
import Root from "./Root";
import store from "./store/store";
import { Provider } from "react-redux";
import { Web3ContextProvider } from "./hooks";
import { SnackbarProvider } from "notistack";
import SnackMessage from "./components/Messages/snackbar";
import { QueryClient, QueryClientProvider } from "react-query";

import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <SnackbarProvider
      maxSnack={4}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      content={(key, message: string) => <SnackMessage id={key} message={JSON.parse(message)} />}
      autoHideDuration={10000}
    >
      <Provider store={store}>
        <Web3ContextProvider>
          <Root />
        </Web3ContextProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </Provider>
    </SnackbarProvider>
  </QueryClientProvider>,
  document.getElementById("root"),
);
