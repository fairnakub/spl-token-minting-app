import React, { FC, ReactNode, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import "./config/connection";
import {
  CreateTokenContainer,
  ManageTokenContainer,
  RequestSolContainer,
  ConnectWalletButton,
} from "./components";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
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

interface ContxtProps {
  children: ReactNode;
}

const Context: FC<ContxtProps> = (props) => {
  const { children } = props;
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};

const App: FC = () => {
  const [value, setValue] = useState<number>(0);
  const methods = useForm();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Context>
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
    </Context>
  );
};

export default App;
