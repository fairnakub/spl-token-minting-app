import { FC, Fragment, useCallback, useEffect, useState } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Button, SxProps, Theme, Box, Alert, Snackbar } from "@mui/material";
import { PhantomProvider, WindowWithSolana } from "../types/";
import { useFormContext } from "react-hook-form";
import { Input, Status } from "../config/constants";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletName } from "@solana/wallet-adapter-base";

declare const window: WindowWithSolana;

const ConnectWalletButton: FC = () => {
  const { setValue, getValues, watch } = useFormContext();
  const [snackBar, setSnackBar] = useState<Status>(Status.Empty);
  const [provider, setProvider] = useState<PhantomProvider | null>();
  // const [connected, setConnected] = useState(false);
  // const [pubKey, setPubKey] = useState<PublicKey | null>();
  const { connect, disconnect, select, publicKey, connecting, connected } =
    useWallet();

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
    provider?.on("connect", (publicKey: PublicKey) => {
      setValue(Input.RequestSolWalletAddress, publicKey.toBase58());
      setValue(Input.MintAuthorityPubkey, publicKey.toBase58());
      setValue(Input.FreezeAuthorityPubkey, publicKey.toBase58());
    });
    provider?.on("accountChanged", (publicKey: PublicKey) => {
      disconnect().then(() => setSnackBar(Status.Error));
    });
  }, [disconnect, provider, setValue]);

  const connectHandler: React.MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    if (window?.solana?.isPhantom) {
      select("Phantom" as WalletName);
      setSnackBar(Status.Success);
    } else {
      setSnackBar(Status.Fail);
    }
  };

  const disconnectHandler: React.MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    disconnect().then(() => setSnackBar(Status.Error));
  };

  return (
    <Fragment>
      <Snackbar
        open={snackBar === Status.Success}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        ClickAwayListenerProps={{ mouseEvent: false }}
        autoHideDuration={3000}
        onClose={() => {
          setSnackBar(Status.Empty);
        }}
      >
        <Alert
          onClose={() => {
            setSnackBar(Status.Empty);
          }}
          severity={Status.Success}
          sx={{ width: "100%" }}
        >
          Connected
        </Alert>
      </Snackbar>

      <Snackbar
        open={snackBar === Status.Error}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        ClickAwayListenerProps={{ mouseEvent: false }}
        autoHideDuration={3000}
        onClose={() => {
          setSnackBar(Status.Empty);
        }}
      >
        <Alert
          onClose={() => {
            setSnackBar(Status.Empty);
          }}
          severity={Status.Error}
          sx={{ width: "100%" }}
        >
          Disconnected
        </Alert>
      </Snackbar>

      <Snackbar
        open={snackBar === Status.Fail}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        ClickAwayListenerProps={{ mouseEvent: false }}
        autoHideDuration={3000}
        onClose={() => {
          setSnackBar(Status.Empty);
        }}
      >
        <Alert
          onClose={() => {
            setSnackBar(Status.Empty);
          }}
          severity={Status.Error}
          sx={{ width: "100%" }}
        >
          Phantom Wallet not found.
        </Alert>
      </Snackbar>

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
