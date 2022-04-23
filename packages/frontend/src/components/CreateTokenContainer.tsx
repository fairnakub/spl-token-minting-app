import { Box, Button, TextField, Typography } from "@mui/material";
import React, { FC, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface CreateTokenContainerProps {}

const CreateTokenContainer: FC<CreateTokenContainerProps> = (props) => {
  const { control, getValues, watch } = useFormContext();

  const isDisabled = () => {
    const isMintAuthEmpty = !watch("mintAuthorityPubkey");
    const isFreezeAuthEmpty = !watch("freezeAuthorityPubkey");
    return isMintAuthEmpty || isFreezeAuthEmpty;
  };

  return (
    <Box display="flex" flexDirection="column">
      <Typography variant="h5" fontWeight="bold">
        Create Token
      </Typography>

      <Controller
        name="mintAuthorityPubkey"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            required
            label="Mint authority pubkey"
            sx={(theme) => ({
              marginTop: theme.spacing(2),
            })}
          />
        )}
        rules={{ required: true }}
      />
      <Controller
        name="freezeAuthorityPubkey"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            required
            label="Freeze authority pubkey"
            sx={(theme) => ({
              marginTop: theme.spacing(2),
            })}
          />
        )}
        rules={{ required: true }}
      />
      <Button
        disabled={isDisabled()}
        variant="contained"
        type="submit"
        sx={(theme) => ({
          marginTop: theme.spacing(2),
          minWidth: theme.spacing(20),
          width: "auto",
          [theme.breakpoints.up("sm")]: {
            maxWidth: theme.spacing(20),
            alignSelf: "end",
          },
        })}
      >
        Create token
      </Button>
    </Box>
  );
};

export default CreateTokenContainer;
