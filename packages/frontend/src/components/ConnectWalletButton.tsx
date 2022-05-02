import { FC, Fragment, useCallback, useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { Button } from "@mui/material";
import { PhantomProvider, WindowWithSolana } from "../types/";
import { useFormContext } from "react-hook-form";
import { Input } from "../config/constants";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletName } from "@solana/wallet-adapter-base";
import { displaySnackbar } from "../redux/coreSlice";
import { useDispatch } from "react-redux";

declare const window: WindowWithSolana;

const ConnectWalletButton: FC = () => {
  const dispatch = useDispatch();
  const { setValue } = useFormContext();
  const [provider, setProvider] = useState<PhantomProvider | null>();
  // const [connected, setConnected] = useState(false);
  // const [pubKey, setPubKey] = useState<PublicKey | null>();
  const { disconnect, select, publicKey, connected } = useWallet();

  const prepareProvider = useCallback(() => {
    setProvider(window?.solana);
    window?.solana?.connect({ onlyIfTrusted: true });
  }, []);

  useEffect(() => {
    if ("solana" in window) {
      if (window?.solana?.isPhantom) {
        prepareProvider();
      }
    }
  }, [prepareProvider]);

  useEffect(() => {
    if (connected) {
      dispatch(displaySnackbar({ type: "success", message: "Connected" }));
    }
  }, [connected, dispatch]);

  useEffect(() => {
    provider?.on("connect", (publicKey: PublicKey) => {
      setValue(Input.RequestSolWalletAddress, publicKey.toBase58());
      setValue(Input.MintAuthorityPubkey, publicKey.toBase58());
      setValue(Input.FreezeAuthorityPubkey, publicKey.toBase58());
    });
    provider?.on("accountChanged", () => {
      disconnect().then(() =>
        dispatch(displaySnackbar({ type: "error", message: "Disconnected" }))
      );
    });
  }, [disconnect, dispatch, provider, setValue]);

  const connectHandler: React.MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    if (window?.solana?.isPhantom) {
      select("Phantom" as WalletName);
    } else {
      dispatch(
        displaySnackbar({ type: "error", message: "Phantom Wallet not found" })
      );
    }
  };

  const disconnectHandler: React.MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    disconnect().then(() =>
      dispatch(displaySnackbar({ type: "error", message: "Disconnected" }))
    );
  };

  return (
    <Fragment>
      <Button
        onClick={connected ? disconnectHandler : connectHandler}
        variant="contained"
        sx={(theme) => ({
          borderRadius: theme.spacing(4),
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "block",
          width: "auto",
          [theme.breakpoints.up("sm")]: {
            ml: theme.spacing(3),
            width: theme.spacing(20),
            alignSelf: "center",
          },
        })}
      >
        {connected ? publicKey?.toBase58() : "Connect"}
      </Button>
    </Fragment>
  );
};

export default ConnectWalletButton;
