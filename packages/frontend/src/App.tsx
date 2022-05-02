import { FC, ReactNode, useMemo } from "react";
import "./config/connection";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Main from "./pages/Main";

interface ContextProps {
  children: ReactNode;
}

const Context: FC<ContextProps> = (props) => {
  const { children } = props;
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <Provider store={store}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          {children}
        </WalletProvider>
      </ConnectionProvider>
    </Provider>
  );
};

const App: FC = () => {
  return (
    <Context>
      <Main />
    </Context>
  );
};

export default App;
