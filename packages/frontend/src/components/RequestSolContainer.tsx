import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useCallback, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import connection from "../config/connection";
import { Input, Status } from "../config/constants";
import { useDispatch } from "react-redux";
import { displaySnackbar } from "../redux/coreSlice";

const RequestSolContainer: FC = (props) => {
  const { control, getValues, watch } = useFormContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

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

        await connection.confirmTransaction(txn);
        dispatch(
          displaySnackbar({
            type: Status.Success,
            title: "Successful!",
            transaction: txn,
          })
        );
      }
    } catch (e: any) {
      dispatch(
        displaySnackbar({
          type: Status.Error,
          title: "Failed!",
          message: e.message,
        })
      );
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, getValues]);

  return (
    <Box display="flex" flexDirection="column">
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
