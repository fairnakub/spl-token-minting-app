import { Box, Button, TextField, Typography } from "@mui/material";
import { getValue } from "@testing-library/user-event/dist/utils";
import { FC, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface RequestSolContainerProps {}

const RequestSolContainer: FC<RequestSolContainerProps> = (props) => {
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
        type="submit"
        sx={(theme) => ({
          marginTop: theme.spacing(2),
          maxWidth: theme.spacing(20),
          [theme.breakpoints.up("sm")]: {
            alignSelf: "end",
          },
        })}
      >
        Request 1 Sol
      </Button>
    </Box>
  );
};

export default RequestSolContainer;
