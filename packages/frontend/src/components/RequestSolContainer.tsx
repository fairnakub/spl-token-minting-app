import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import {
  Alert,
  AlertColor,
  Box,
  Button,
  CircularProgress,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { getValue } from "@testing-library/user-event/dist/utils";
import { FC, useCallback, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { PhantomProvider, WindowWithSolana } from "../types";
import connection from "../config/connection";
import { Input, Status } from "../config/constants";
import openInNewTab from "../utils/openInNewTab";

const RequestSolContainer: FC = (props) => {
  const { control, getValues, watch } = useFormContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const [status, setStatus] = useState<Status>();

  const onRequestAirdrop = useCallback(async () => {
    setIsLoading(true);
    const value = getValues(Input.RequestSolWalletAddress);

    try {
      const publicKey = new PublicKey(value);
      if (publicKey) {
        const txn = await connection.requestAirdrop(
          publicKey,
          LAMPORTS_PER_SOL
        );
        console.log(txn);
        await connection.confirmTransaction(txn);
        setResult(txn);
        setStatus(Status.Success);
      }
    } catch (e: any) {
      setStatus(Status.Error);
      setResult(e.message);
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }, [getValues]);

  return (
    <Box display="flex" flexDirection="column">
      {status && (
        <Alert
          severity={status as AlertColor}
          sx={(theme) => ({ marginBottom: theme.spacing(2) })}
          onClose={() => {
            setStatus(undefined);
          }}
        >
          {status === Status.Success ? (
            <>
              Successful!&nbsp;
              <Link
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  openInNewTab(
                    `https://explorer.solana.com/tx/${result}?cluster=devnet`
                  );
                }}
              >
                view txn
              </Link>
            </>
          ) : (
            <>Failed! {result}</>
          )}
        </Alert>
      )}
      <Typography variant="h5" fontWeight="bold">
        Request Sol
      </Typography>
      <Controller
        name={Input.RequestSolWalletAddress}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            required
            disabled={isLoading}
            label="Your wallet address"
            sx={(theme) => ({
              marginTop: theme.spacing(2),
            })}
          />
        )}
        rules={{ required: true }}
      />
      <Button
        disabled={!watch(Input.RequestSolWalletAddress) || isLoading}
        variant="contained"
        sx={(theme) => ({
          marginTop: theme.spacing(2),
          minWidth: theme.spacing(20),
          width: "auto",
          [theme.breakpoints.up("sm")]: {
            maxWidth: theme.spacing(22),
            alignSelf: "end",
          },
        })}
        onClick={async () => {
          await onRequestAirdrop();
        }}
      >
        {isLoading && (
          <CircularProgress
            style={{ width: "15px", height: "15px", marginRight: "8px" }}
          />
        )}
        Request 1 Sol
      </Button>
    </Box>
  );
};

export default RequestSolContainer;
