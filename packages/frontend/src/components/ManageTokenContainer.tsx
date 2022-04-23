import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import { isDisabled } from "@testing-library/user-event/dist/utils";
import { FC, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface ManageTokenContainerProps {}

const ManageTokenContainer: FC<ManageTokenContainerProps> = (props) => {
  const { control, getValues, watch, setValue } = useFormContext();
  const [isTokenConfirmed, setTokenConfirm] = useState<boolean>(false);
  return (
    <Box display="flex" flexDirection="column">
      <Typography variant="h5" fontWeight="bold">
        Manage Token
      </Typography>

      <Controller
        name="manageTokenTokenAddress"
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
        disabled={isTokenConfirmed || !watch("manageTokenTokenAddress")}
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
        onClick={() => {
          setTokenConfirm(true);
        }}
      >
        Confirm
      </Button>

      {isTokenConfirmed && (
        <>
          <Divider sx={{ mt: 3, mb: 2 }} />
          <Typography variant="h6" fontWeight="bold">
            Token detail
          </Typography>
          <Box display="flex">
            <Typography variant="body1">Token address:&nbsp;</Typography>
            <Typography variant="body1">asdasdasd</Typography>
          </Box>
          <Box display="flex">
            <Typography variant="body1">Total supply:&nbsp;</Typography>
            <Typography variant="body1">asdasdasd</Typography>
          </Box>
          <Divider sx={{ mt: 3, mb: 2 }} />
          <Typography variant="h6" fontWeight="bold">
            Mint
          </Typography>
          <Controller
            name="mintAmount"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                required
                label="Mint amount"
                sx={(theme) => ({
                  marginTop: theme.spacing(2),
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
              [theme.breakpoints.up("sm")]: {
                alignSelf: "end",
              },
            })}
          >
            Mint
          </Button>
          <Divider sx={{ mt: 3, mb: 2 }} />
          <Typography variant="h6" fontWeight="bold">
            Burn
          </Typography>
          <Controller
            name="burnAmount"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                required
                label="Burn amount"
                sx={(theme) => ({
                  marginTop: theme.spacing(2),
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
              [theme.breakpoints.up("sm")]: {
                alignSelf: "end",
              },
            })}
          >
            Burn
          </Button>
          <Divider sx={{ mt: 3, mb: 2 }} />
          <Typography variant="h6" fontWeight="bold">
            Mint and send to an address
          </Typography>
          <Controller
            name="airdropTargetAddress"
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
            name="airdropAmount"
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
            disabled={!watch("airdropAmount") || !watch("airdropTargetAddress")}
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
              setValue("manageTokenTokenAddress", "");
              setTokenConfirm(false);
            }}
          >
            Close
          </Button>
        </>
      )}
    </Box>
  );
};

export default ManageTokenContainer;
