import { FC, Fragment, useCallback, useEffect, useState } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Button, SxProps, Theme, Box } from "@mui/material";
import { PhantomProvider, WindowWithSolana } from "../types/";

declare const window: WindowWithSolana;

const ConnectWalletButton: FC = () => {
  const [isPhantom, setPhantom] = useState(false);
  const [provider, setProvider] = useState<PhantomProvider | null>();
  const [connected, setConnected] = useState(false);
  const [pubKey, setPubKey] = useState<PublicKey | null>();

  const prepareProvider = useCallback(() => {
    setProvider(window?.solana);
    setPhantom(true);
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
      console.log(`connect event: ${publicKey}`);
      setConnected(true);
      setPubKey(publicKey);
    });
    provider?.on("disconnect", () => {
      console.log("disconnect event");
      setConnected(false);
      setPubKey(null);
    });
  }, [provider]);

  const connectHandler: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    console.log(`connect handler`);
    if (window?.solana?.isPhantom && !provider) {
      prepareProvider();
    } else {
      // TODO: Alert error phantom wallet missing
    }
    provider?.connect().catch((err) => {
      console.error("connect ERROR:", err);
    });
  };

  const disconnectHandler: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    console.log("disconnect handler");
    if (window?.solana?.isPhantom && !provider) {
      prepareProvider();
    } else {
      // TODO: Alert error phantom wallet missing
    }
    provider?.disconnect().catch((err) => {
      console.error("disconnect ERROR:", err);
    });
  };

  return (
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
      {connected && isPhantom ? pubKey?.toBase58() : "Connect"}
    </Button>
  );
};

export default ConnectWalletButton;
