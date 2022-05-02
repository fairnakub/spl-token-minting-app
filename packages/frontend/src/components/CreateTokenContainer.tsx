import {
  Box,
  Button,
  FormControl,
  InputLabel,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { FC, useCallback, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "../config/constants";
import { OutlinedInput } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  PublicKey,
  SystemProgram,
  Transaction,
  Keypair,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { displaySnackbar } from "../redux/coreSlice";
import { useDispatch } from "react-redux";

interface CreateTokenContainerProps {}

const CreateTokenContainer: FC<CreateTokenContainerProps> = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { control, getValues, setValue, watch } = useFormContext();
  const [decimals, setDecimals] = useState<number>(0);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const isDisabled = () => {
    const isMintAuthEmpty = !watch(Input.MintAuthorityPubkey);
    const isFreezeAuthEmpty = !watch(Input.FreezeAuthorityPubkey);
    return isMintAuthEmpty || isFreezeAuthEmpty;
  };

  const createTokenHandler = useCallback(async () => {
    setIsLoading(true);
    const mintAuthString = getValues(Input.MintAuthorityPubkey);
    const freezeAuthString = getValues(Input.FreezeAuthorityPubkey);
    const tokenAccount = Keypair.generate();
    try {
      const mintAuthPubkey = new PublicKey(mintAuthString);
      const freezeAuthPubkey = new PublicKey(freezeAuthString);

      const lamports = await getMinimumBalanceForRentExemptMint(connection);
      if (publicKey) {
        const tx = new Transaction().add(
          // create mint account

          SystemProgram.createAccount({
            fromPubkey: publicKey,
            newAccountPubkey: tokenAccount.publicKey,
            space: MINT_SIZE,
            lamports,
            programId: TOKEN_PROGRAM_ID,
          }),
          // init mint account
          createInitializeMintInstruction(
            tokenAccount.publicKey, // mint pubkey
            decimals, // decimals
            mintAuthPubkey, // mint authority
            freezeAuthPubkey // freeze authority
          )
        );

        const signature = await sendTransaction(tx, connection, {
          signers: [tokenAccount],
        });
        await connection.confirmTransaction(signature);

        dispatch(
          displaySnackbar({
            type: "success",
            title: "Successful!",
            message: `You have successfully created a token having this address: ${tokenAccount.publicKey.toBase58()}`,
            transaction: signature,
            autoHideDuration: null,
          })
        );
        setValue(
          Input.ManageTokenTokenAddress,
          tokenAccount.publicKey.toBase58()
        );
      }
    } catch (e: any) {
      dispatch(
        displaySnackbar({ type: "error", title: "Failed!", message: e.message })
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    getValues,
    connection,
    publicKey,
    decimals,
    sendTransaction,
    dispatch,
    setValue,
  ]);

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
            disabled={isLoading}
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
            disabled={isLoading}
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
              disabled={isLoading}
              type="tel"
              label="Decimals"
              value={decimals}
              inputProps={{
                min: 0,
                max: 9,
                style: {
                  textAlign: "center",
                },
              }}
              onInputCapture={(event: any) => {
                if (!event.nativeEvent.data) {
                  setDecimals(0);
                } else {
                  setDecimals(parseInt(event.nativeEvent.data));
                }
              }}
              startAdornment={
                <IconButton
                  disabled={decimals === 0 || isLoading}
                  onClick={() =>
                    setDecimals((prev) => {
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
                  disabled={decimals === 9 || isLoading}
                  onClick={() =>
                    setDecimals((prev) => {
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
        disabled={isDisabled() || isLoading}
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
        onClick={createTokenHandler}
      >
        {isLoading && (
          <CircularProgress
            style={{ width: "15px", height: "15px", marginRight: "8px" }}
          />
        )}
        Confirm
      </Button>
    </Box>
  );
};

export default CreateTokenContainer;
