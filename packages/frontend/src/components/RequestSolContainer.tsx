import { Box, Button, TextField, Typography } from "@mui/material";
import { getValue } from "@testing-library/user-event/dist/utils";
import { FC, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { PhantomProvider, WindowWithSolana } from "../types";

declare const window: WindowWithSolana;

const RequestSolContainer: FC = (props) => {
  const { control, getValues, watch } = useFormContext();
  return (
    <Box display="flex" flexDirection="column">
      <Typography variant="h5" fontWeight="bold">
        Request Sol
      </Typography>
      <Controller
        name="requestSolWalletAddress"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            required
            label="Your wallet address"
            sx={(theme) => ({
              marginTop: theme.spacing(2),
            })}
          />
        )}
        rules={{ required: true }}
      />
      <Button
        disabled={!watch("requestSolWalletAddress") || undefined}
        variant="contained"
        sx={(theme) => ({
          marginTop: theme.spacing(2),
          minWidth: theme.spacing(20),
          width: "auto",
          [theme.breakpoints.up("sm")]: {
            maxWidth: theme.spacing(20),
            alignSelf: "end",
          },
        })}
        onClick={() => {
          console.log(window.solana?.publicKey.toString());
        }}
      >
        Request 1 Sol
      </Button>
    </Box>
  );
};

export default RequestSolContainer;
