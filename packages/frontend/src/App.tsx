import React, { FC, useEffect, useState } from "react";
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
import {
  CreateTokenContainer,
  ManageTokenContainer,
  RequestSolContainer,
  ConnectWalletButton,
} from "./components";

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

const App: FC = () => {
  const [value, setValue] = useState<number>(0);
  const methods = useForm();
  const onSubmit = (data: any) => console.log(data);
  const theme = useTheme();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <FormProvider {...methods}>
      <Box
        sx={(theme) => ({
          display: "flex",
          justifyContent: "center",
          minHeight: "100vh",
          padding: theme.spacing(5),
          backgroundColor: theme.palette.grey[200],
          alignItems: "center",
        })}
      >
        <Paper
          sx={(theme) => ({
            maxWidth: theme.spacing(100),
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
  );
};

export default App;
