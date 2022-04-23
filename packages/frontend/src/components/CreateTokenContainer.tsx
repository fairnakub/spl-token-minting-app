import {
  Box,
  Button,
  FormControl,
  InputLabel,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import React, { FC, useCallback, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "../config/constants";
import { WindowWithSolana } from "../types";
import { OutlinedInput } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { createMint } from "@solana/spl-token";
import connection from "../config/connection";

declare const window: WindowWithSolana;

interface CreateTokenContainerProps {}

const CreateTokenContainer: FC<CreateTokenContainerProps> = (props) => {
  const { control, getValues, watch } = useFormContext();
  const [decimal, setDecimal] = useState<number>(0);

  const isDisabled = () => {
    const isMintAuthEmpty = !watch(Input.MintAuthorityPubkey);
    const isFreezeAuthEmpty = !watch(Input.FreezeAuthorityPubkey);
    return isMintAuthEmpty || isFreezeAuthEmpty;
  };

  const createTokenHandler = useCallback(async () => {
    // const payer = window.solana.publicKey;
    // const mint = await createMint(
    //   connection,
    //   payer,
    //   mintAuthority.publicKey,
    //   freezeAuthority.publicKey,
    //   decimal
    // );
  }, [decimal]);

  return (
    <Box display="flex" flexDirection="column">
      <Typography variant="h5" fontWeight="bold">
        Create Token
      </Typography>

      <Controller
        name={Input.MintAuthorityPubkey}
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
        name={Input.FreezeAuthorityPubkey}
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
      <Controller
        name={Input.Decimals}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <FormControl
            sx={(theme) => ({
              marginTop: theme.spacing(2),
            })}
          >
            <InputLabel required htmlFor="outlined-adornment-password">
              Decimals
            </InputLabel>
            <OutlinedInput
              {...field}
              required
              type="number"
              label="Decimal"
              value={decimal}
              inputProps={{ min: 0, style: { textAlign: "center" } }}
              startAdornment={
                <IconButton
                  disabled={decimal === 0}
                  onClick={() =>
                    setDecimal((prev) => {
                      if (!prev) {
                        return prev;
                      }
                      return prev - 1;
                    })
                  }
                >
                  <RemoveIcon />
                </IconButton>
              }
              endAdornment={
                <IconButton
                  disabled={decimal === 9}
                  onClick={() =>
                    setDecimal((prev) => {
                      if (prev === 9) {
                        return prev;
                      }
                      return prev + 1;
                    })
                  }
                >
                  <AddIcon />
                </IconButton>
              }
            />
          </FormControl>
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
            maxWidth: theme.spacing(22),
            alignSelf: "end",
          },
        })}
      >
        Confirm
      </Button>
    </Box>
  );
};

export default CreateTokenContainer;
