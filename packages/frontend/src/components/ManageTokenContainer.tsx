import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import {
  createAssociatedTokenAccountInstruction,
  createBurnCheckedInstruction,
  createMintToCheckedInstruction,
  getAccount,
  getAssociatedTokenAddress,
  getMint,
} from "@solana/spl-token";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { FC, Fragment, useState, useCallback } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "../config/constants";
import { TokenDetail } from "../types/tokenDetail";
import { displaySnackbar } from "../redux/coreSlice";
import { useDispatch } from "react-redux";
import BigNumber from "bignumber.js";

interface ManageTokenContainerProps {}

const ManageTokenContainer: FC<ManageTokenContainerProps> = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { control, getValues, watch, setValue } = useFormContext();
  const [isTokenConfirmed, setTokenConfirm] = useState<boolean>(false);
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [isBurning, setIsBurning] = useState<boolean>(false);
  const [mintToAnotherAddress, setMintToAnotherAddress] =
    useState<boolean>(false);
  const [tokenDetail, setTokenDetail] = useState<TokenDetail>();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const checkIfAtaExist = useCallback(
    async (ata: PublicKey) => {
      try {
        await getAccount(connection, ata);
        return true;
      } catch (e) {
        return false;
      }
    },
    [connection]
  );

  const confirmTokenHandler = useCallback(async () => {
    setIsLoading(true);
    try {
      const tokenAccount = new PublicKey(
        getValues(Input.ManageTokenTokenAddress)
      );
      const detail = await getMint(connection, tokenAccount);
      setTokenDetail({
        tokenAddress: detail.address.toBase58(),
        tokenSupply: detail.supply,
        decimals: detail.decimals,
        freezeAuthority: detail.freezeAuthority?.toBase58() || null,
        mintAuthority: detail.mintAuthority?.toBase58() || null,
        isInitialized: detail.isInitialized,
      });
      setTokenConfirm(true);
    } catch (e: any) {
      setTokenConfirm(false);
      setTokenDetail(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [connection, getValues]);

  const mintHandler = useCallback(async () => {
    if (tokenDetail && publicKey) {
      setIsMinting(true);
      const tokenPubkey = new PublicKey(tokenDetail.tokenAddress);
      const recipientAddress = getValues(Input.MintToAnotherAddress);
      const ata = await getAssociatedTokenAddress(
        tokenPubkey, // mint
        recipientAddress ? new PublicKey(recipientAddress) : publicKey // owner
      );
      const isAtaExist = await checkIfAtaExist(ata);
      try {
        if (tokenDetail.mintAuthority !== publicKey.toBase58()) {
          throw new Error(
            "You don't have the Mint Authority in order to mint this token"
          );
        }
        let tx: Transaction;
        if (isAtaExist) {
          console.log("isAtaExist");
          tx = new Transaction().add(
            createMintToCheckedInstruction(
              tokenPubkey, // mint
              ata, // receiver
              publicKey, // mint authority
              getValues(Input.MintAmount), // amount. if your decimals is 8, you mint 10^8 for 1 token.
              tokenDetail.decimals // decimals
            )
          );
        } else {
          console.log("isNOTAtaExist");
          tx = new Transaction().add(
            createAssociatedTokenAccountInstruction(
              publicKey, // payer
              ata, // ata
              recipientAddress ? new PublicKey(recipientAddress) : publicKey, // owner
              tokenPubkey // mint
            ),
            createMintToCheckedInstruction(
              tokenPubkey, // mint
              ata, // receiver
              publicKey, // mint authority
              getValues(Input.MintAmount), // amount. if your decimals is 8, you mint 10^8 for 1 token.
              tokenDetail.decimals // decimals
            )
          );
        }
        const signature = await sendTransaction(tx, connection);
        await connection.confirmTransaction(signature);
        await confirmTokenHandler();
        dispatch(
          displaySnackbar({
            type: "success",
            title: "Successful!",
            message: `You've successfully MINTED: ${getValues(
              Input.MintAmount
            )}`,
            transaction: signature,
            autoHideDuration: null,
          })
        );
      } catch (e: any) {
        dispatch(
          displaySnackbar({
            type: "error",
            title: "Failed!",
            message: e.message,
          })
        );
        console.log(e);
      } finally {
        setIsMinting(false);
      }
    } else {
      dispatch(
        displaySnackbar({
          type: "error",
          title: "Failed!",
          message: "Please connect your wallet",
        })
      );
    }
  }, [
    tokenDetail,
    checkIfAtaExist,
    confirmTokenHandler,
    connection,
    dispatch,
    getValues,
    publicKey,
    sendTransaction,
  ]);

  const burnHandler = useCallback(async () => {
    if (tokenDetail && publicKey) {
      setIsBurning(true);
      const tokenPubkey = new PublicKey(tokenDetail.tokenAddress);
      const ata = await getAssociatedTokenAddress(
        tokenPubkey, // mint
        publicKey // owner
      );
      try {
        const isAtaExist = await checkIfAtaExist(ata);
        const tokenAmount = await connection.getTokenAccountBalance(ata);
        const amount = tokenAmount.value.amount;
        const burnAmount = getValues(Input.BurnAmount);
        if (new BigNumber(tokenAmount.value.amount).isLessThan(burnAmount)) {
          throw new Error(
            `Your account don't have enough tokens to burn. You have ${amount} while you wish to burn ${burnAmount}`
          );
        }
        let tx: Transaction;
        if (isAtaExist) {
          tx = new Transaction().add(
            createBurnCheckedInstruction(
              ata, // token account
              tokenPubkey, // mint
              publicKey, // owner
              burnAmount, // amount
              tokenDetail.decimals // decimals
            )
          );
        } else {
          tx = new Transaction().add(
            createAssociatedTokenAccountInstruction(
              publicKey, // payer
              ata, // ata
              publicKey, // owner
              tokenPubkey // mint
            ),
            createBurnCheckedInstruction(
              ata, // token account
              tokenPubkey, // mint
              publicKey, // owner
              burnAmount, // amount
              tokenDetail.decimals // decimals
            )
          );
        }
        const signature = await sendTransaction(tx, connection);
        await connection.confirmTransaction(signature);
        await confirmTokenHandler();
        dispatch(
          displaySnackbar({
            type: "success",
            title: "Successful!",
            message: `You've successfully BURNED: ${burnAmount}`,
            transaction: signature,
            autoHideDuration: null,
          })
        );
      } catch (e: any) {
        dispatch(
          displaySnackbar({
            type: "error",
            title: "Failed!",
            message: e.message,
          })
        );
        console.log(e);
      } finally {
        setIsBurning(false);
      }
    } else {
      dispatch(
        displaySnackbar({
          type: "error",
          title: "Failed!",
          message: "Please connect your wallet",
        })
      );
    }
  }, [
    tokenDetail,
    checkIfAtaExist,
    confirmTokenHandler,
    connection,
    dispatch,
    getValues,
    publicKey,
    sendTransaction,
  ]);

  const isMintDisabled = () => {
    if (mintToAnotherAddress) {
      return (
        !watch(Input.MintAmount) ||
        !watch(Input.MintToAnotherAddress) ||
        isMinting
      );
    }
    return !watch(Input.MintAmount) || isMinting;
  };

  const getSupplyLabel = useCallback((supply: BigNumber, decimals: number) => {
    const expo = 10 ** decimals;
    const calculated = supply.dividedBy(expo).decimalPlaces(expo);
    return `${calculated.toString()} [${supply.toString()}]`;
  }, []);

  return (
    <Box display="flex" flexDirection="column">
      <Typography variant="h5" fontWeight="bold">
        Manage Token
      </Typography>
      {!isTokenConfirmed && (
        <Fragment>
          <Controller
            name={Input.ManageTokenTokenAddress}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                required
                disabled={isLoading}
                label="Token address"
                sx={(theme) => ({
                  marginTop: theme.spacing(2),
                })}
              />
            )}
            rules={{ required: true }}
          />

          <Button
            disabled={isLoading || !watch(Input.ManageTokenTokenAddress)}
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
            onClick={confirmTokenHandler}
          >
            {isLoading && (
              <CircularProgress
                style={{ width: "15px", height: "15px", marginRight: "8px" }}
              />
            )}
            Next
          </Button>
        </Fragment>
      )}

      {isTokenConfirmed && tokenDetail && (
        <Fragment>
          <Divider sx={{ mt: 3, mb: 2 }} />
          <Typography variant="h6" fontWeight="bold">
            Token detail
          </Typography>
          <Box
            display="flex"
            sx={(theme) => ({
              [theme.breakpoints.down("sm")]: {
                flexDirection: "column",
                wordWrap: "anywhere",
              },
            })}
          >
            <Typography variant="body1" fontWeight="bold">
              Token address:&nbsp;
            </Typography>
            <Typography variant="body1">{tokenDetail.tokenAddress}</Typography>
          </Box>
          <Box
            display="flex"
            sx={(theme) => ({
              [theme.breakpoints.down("sm")]: {
                flexDirection: "column",
                wordWrap: "anywhere",
              },
            })}
          >
            <Typography variant="body1" fontWeight="bold">
              Total supply:&nbsp;
            </Typography>
            <Typography variant="body1">
              {getSupplyLabel(
                new BigNumber(tokenDetail.tokenSupply.toString()),
                tokenDetail.decimals
              )}
            </Typography>
          </Box>
          <Box
            display="flex"
            sx={(theme) => ({
              [theme.breakpoints.down("sm")]: {
                flexDirection: "column",
                wordWrap: "anywhere",
              },
            })}
          >
            <Typography variant="body1" fontWeight="bold">
              Decimals:&nbsp;
            </Typography>
            <Typography variant="body1">
              {tokenDetail.decimals.toLocaleString()}
            </Typography>
          </Box>
          <Box
            display="flex"
            sx={(theme) => ({
              [theme.breakpoints.down("sm")]: {
                flexDirection: "column",
                wordWrap: "anywhere",
              },
            })}
          >
            <Typography variant="body1" fontWeight="bold">
              Mint authority:&nbsp;
            </Typography>
            <Typography variant="body1">{tokenDetail.mintAuthority}</Typography>
          </Box>
          <Box
            display="flex"
            sx={(theme) => ({
              [theme.breakpoints.down("sm")]: {
                flexDirection: "column",
                wordWrap: "anywhere",
              },
            })}
          >
            <Typography variant="body1" fontWeight="bold">
              Freeze authority:&nbsp;
            </Typography>
            <Typography variant="body1">
              {tokenDetail.freezeAuthority}
            </Typography>
          </Box>
          <Divider sx={{ mt: 3, mb: 2 }} />
          <Box
            display="flex"
            sx={(theme) => ({
              [theme.breakpoints.down("sm")]: {
                flexDirection: "column",
                wordWrap: "anywhere",
              },
            })}
          >
            <Box
              flex={1}
              sx={(theme) => ({
                [theme.breakpoints.up("sm")]: {
                  paddingRight: "12px",
                },
              })}
            >
              <Box display="flex" height="32px" justifyContent="space-between">
                <Typography variant="h6" fontWeight="bold">
                  Mint
                </Typography>
                <FormControlLabel
                  value="end"
                  checked={mintToAnotherAddress}
                  control={
                    <Checkbox
                      checked={mintToAnotherAddress}
                      onClick={() => {
                        setMintToAnotherAddress((prev) => !prev);
                        setValue(Input.MintToAnotherAddress, undefined);
                      }}
                      size="small"
                    />
                  }
                  label="Mint to another wallet"
                  labelPlacement="end"
                />
              </Box>
              <Controller
                name={Input.MintAmount}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    type="number"
                    helperText="If your decimals is n, you mint 10^n for 1 token."
                    disabled={isMinting}
                    label="Mint amount"
                    sx={(theme) => ({
                      marginTop: theme.spacing(2),
                      width: "100%",
                    })}
                  />
                )}
                rules={{ required: true, pattern: /^[0-9]+/i }}
              />
              {mintToAnotherAddress && (
                <Controller
                  name={Input.MintToAnotherAddress}
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      helperText="Wallet address is NOT recipient's Associated Token Account"
                      disabled={isMinting}
                      label="Recipient's wallet address"
                      sx={(theme) => ({
                        marginTop: theme.spacing(2),
                        width: "100%",
                      })}
                    />
                  )}
                  rules={{ required: true }}
                />
              )}
              <Button
                disabled={isMintDisabled()}
                variant="contained"
                sx={(theme) => ({
                  marginTop: theme.spacing(2),
                  minWidth: theme.spacing(20),
                  width: "100%",
                })}
                onClick={mintHandler}
              >
                {isMinting && (
                  <CircularProgress
                    style={{
                      width: "15px",
                      height: "15px",
                      marginRight: "8px",
                    }}
                  />
                )}
                Mint
              </Button>
            </Box>
            <Box
              flex={1}
              sx={(theme) => ({
                paddingLeft: theme.spacing(1.5),
                [theme.breakpoints.down("sm")]: {
                  paddingLeft: 0,
                  paddingTop: theme.spacing(2),
                },
              })}
            >
              <Typography variant="h6" fontWeight="bold">
                Burn
              </Typography>
              <Controller
                name={Input.BurnAmount}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    type="number"
                    helperText="If your decimals is n, you burn 10^n for 1 token."
                    disabled={isBurning}
                    label="Burn amount"
                    sx={(theme) => ({
                      marginTop: theme.spacing(2),
                      width: "100%",
                    })}
                  />
                )}
                rules={{ required: true }}
              />
              <Button
                disabled={!watch(Input.BurnAmount) || isBurning}
                variant="contained"
                sx={(theme) => ({
                  marginTop: theme.spacing(2),
                  minWidth: theme.spacing(20),
                  width: "100%",
                })}
                onClick={burnHandler}
              >
                {isBurning && (
                  <CircularProgress
                    style={{
                      width: "15px",
                      height: "15px",
                      marginRight: "8px",
                    }}
                  />
                )}
                Burn
              </Button>
            </Box>
          </Box>
          {/* <Divider sx={{ mt: 3, mb: 2 }} />
          <Typography variant="h6" fontWeight="bold">
            Airdrop (mint and send to an address in one action)
          </Typography>
          <Controller
            name={Input.AirdropTargetAddress}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                required
                disabled={isAirdroping}
                label="Target address"
                sx={(theme) => ({
                  marginTop: theme.spacing(2),
                })}
              />
            )}
            rules={{ required: true }}
          />
          <Controller
            name={Input.AirdropAmount}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                disabled={isAirdroping}
                required
                type="number"
                label="Amount"
                sx={(theme) => ({
                  marginTop: theme.spacing(2),
                })}
              />
            )}
            rules={{ required: true }}
          />
          <Button
            disabled={
              !watch(Input.AirdropAmount) ||
              !watch(Input.AirdropTargetAddress) ||
              isAirdroping
            }
            variant="contained"
            sx={(theme) => ({
              marginTop: theme.spacing(2),
              minWidth: theme.spacing(20),
              [theme.breakpoints.up("sm")]: {
                alignSelf: "end",
              },
            })}
            onClick={airdropHandler}
          >
            {isAirdroping && (
              <CircularProgress
                style={{ width: "15px", height: "15px", marginRight: "8px" }}
              />
            )}
            Confirm
          </Button> */}
          <Divider sx={{ mt: 3, mb: 3 }} />
          <Button
            variant="outlined"
            sx={(theme) => ({
              minWidth: theme.spacing(20),
              [theme.breakpoints.up("sm")]: {
                alignSelf: "end",
              },
            })}
            onClick={() => {
              setTokenConfirm(false);
              setIsLoading(false);
              setTokenConfirm(false);
              setIsMinting(false);
              setIsBurning(false);
              setValue(Input.MintToAnotherAddress, undefined);
              setValue(Input.MintAmount, undefined);
              setValue(Input.BurnAmount, undefined);
            }}
          >
            Back
          </Button>
        </Fragment>
      )}
    </Box>
  );
};

export default ManageTokenContainer;
