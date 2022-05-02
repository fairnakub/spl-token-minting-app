import {
  Snackbar,
  Alert,
  Box,
  Paper,
  Tabs,
  Tab,
  Link,
  Typography,
} from "@mui/material";
import { FC, Fragment, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import {
  ConnectWalletButton,
  RequestSolContainer,
  CreateTokenContainer,
  ManageTokenContainer,
} from "../components";
import { resetSnackbar, selectSnackbar } from "../redux/coreSlice";
import openInNewTab from "../utils/openInNewTab";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box>{children}</Box>
    </div>
  );
};

const Main: FC = () => {
  const [value, setValue] = useState<number>(0);
  const methods = useForm();
  const snackbar = useSelector(selectSnackbar);
  const dispatch = useDispatch();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Fragment>
      {snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          ClickAwayListenerProps={{ mouseEvent: false }}
          autoHideDuration={
            snackbar.autoHideDuration === null
              ? null
              : snackbar.autoHideDuration || 5000
          }
          onClose={() => {
            dispatch(resetSnackbar());
          }}
        >
          <Alert
            severity={snackbar?.type}
            sx={(theme) => ({ marginBottom: theme.spacing(2) })}
            onClose={() => {
              dispatch(resetSnackbar());
            }}
          >
            <Fragment>
              <Typography fontWeight="bold">{snackbar?.title}</Typography>
              <Box>{snackbar?.message}</Box>
              {snackbar?.transaction && (
                <Link
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    openInNewTab(
                      `https://explorer.solana.com/tx/${snackbar.transaction}?cluster=devnet`
                    );
                  }}
                >
                  View Transaction
                </Link>
              )}
            </Fragment>
          </Alert>
        </Snackbar>
      )}
      <FormProvider {...methods}>
        <Box
          sx={(theme) => ({
            display: "flex",
            justifyContent: "center",
            minHeight: "100vh",
            padding: theme.spacing(5),
            backgroundColor: theme.palette.grey[200],
            backgroundImage: `url("https://wallpaperforu.com/wp-content/uploads/2021/04/Wallpaper-Black-And-White-Morning-Foggy-Forest-Bw-Clouds44-scaled.jpg")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            alignItems: "center",
          })}
        >
          <Paper
            sx={(theme) => ({
              maxWidth: theme.spacing(78.75),
              borderRadius: theme.shape.borderRadius,
              display: "flex",
              flexDirection: "column",
            })}
          >
            <Box
              sx={(theme) => ({
                display: "flex",
                flexDirection: "column-reverse",
                [theme.breakpoints.up("sm")]: {
                  flexDirection: "row",
                },
                padding: theme.spacing(2),
                maxWidth: { xs: "calc(100vw - 48px)", sm: 900 },
              })}
            >
              <Tabs
                allowScrollButtonsMobile
                orientation="horizontal"
                variant="scrollable"
                scrollButtons="auto"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                sx={{ borderBottom: 1, borderColor: "divider" }}
              >
                <Tab label="REQUEST SOL" />
                <Tab label="CREATE TOKEN" />
                <Tab label="MANAGE TOKEN" />
              </Tabs>
              <ConnectWalletButton />
            </Box>
            <Box sx={(theme) => ({ padding: theme.spacing(3) })}>
              <TabPanel value={value} index={0}>
                <RequestSolContainer />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <CreateTokenContainer />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <ManageTokenContainer />
              </TabPanel>
            </Box>
          </Paper>
        </Box>
      </FormProvider>
    </Fragment>
  );
};

export default Main;
