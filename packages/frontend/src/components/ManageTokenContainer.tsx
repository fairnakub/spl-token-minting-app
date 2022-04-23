import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import { isDisabled } from "@testing-library/user-event/dist/utils";
import { FC, Fragment, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "../config/constants";

interface ManageTokenContainerProps {}

const ManageTokenContainer: FC<ManageTokenContainerProps> = (props) => {
  const { control, getValues, watch, setValue } = useFormContext();
  const [isTokenConfirmed, setTokenConfirm] = useState<boolean>(false);
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
                disabled={isTokenConfirmed}
                label="Token address"
                sx={(theme) => ({
                  marginTop: theme.spacing(2),
                })}
              />
            )}
            rules={{ required: true }}
          />

          <Button
            disabled={isTokenConfirmed || !watch(Input.ManageTokenTokenAddress)}
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
            onClick={() => {
              setTokenConfirm(true);
            }}
          >
            Next
          </Button>
        </Fragment>
      )}

      {isTokenConfirmed && (
        <Fragment>
          <Divider sx={{ mt: 3, mb: 2 }} />
          <Typography variant="h6" fontWeight="bold">
            Token detail
          </Typography>
          <Box display="flex">
            <Typography variant="body1">Token address:&nbsp;</Typography>
            <Typography variant="body1">
              {getValues(Input.ManageTokenTokenAddress)}
            </Typography>
          </Box>
          <Box display="flex">
            <Typography variant="body1">Total supply:&nbsp;</Typography>
            <Typography variant="body1">asdasdasd</Typography>
          </Box>
          <Divider sx={{ mt: 3, mb: 2 }} />
          <Box
            display="flex"
            sx={(theme) => ({
              [theme.breakpoints.down("sm")]: {
                flexDirection: "column",
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
              <Typography variant="h6" fontWeight="bold">
                Mint
              </Typography>
              <Controller
                name={Input.MintAmount}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="Mint amount"
                    sx={(theme) => ({
                      marginTop: theme.spacing(2),
                      width: "100%",
                    })}
                  />
                )}
                rules={{ required: true, pattern: /^[0-9]+/i }}
              />
              <Button
                disabled={!watch("mintAmount")}
                variant="contained"
                sx={(theme) => ({
                  marginTop: theme.spacing(2),
                  minWidth: theme.spacing(20),
                  width: "100%",
                })}
              >
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
                disabled={!watch("burnAmount")}
                variant="contained"
                sx={(theme) => ({
                  marginTop: theme.spacing(2),
                  minWidth: theme.spacing(20),
                  width: "100%",
                })}
              >
                Burn
              </Button>
            </Box>
          </Box>
          <Divider sx={{ mt: 3, mb: 2 }} />
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
                required
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
              !watch(Input.AirdropAmount) || !watch(Input.AirdropTargetAddress)
            }
            variant="contained"
            sx={(theme) => ({
              marginTop: theme.spacing(2),
              minWidth: theme.spacing(20),
              [theme.breakpoints.up("sm")]: {
                alignSelf: "end",
              },
            })}
          >
            Confirm
          </Button>
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
              setValue(Input.ManageTokenTokenAddress, "");
              setTokenConfirm(false);
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
