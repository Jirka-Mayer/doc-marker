import * as styles from "./Application.module.scss";
import { AppBar } from "./AppBar";
import { WelcomeBody } from "./WelcomeBody";
import { StatusBar } from "./StatusBar";
import { AppBody } from "./AppBody";
import { useAtom } from "jotai";
import { ChangeLocaleDialog } from "./dialogs/ChangeLocaleDialog";
import useUnload from "../utils/useUnload";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DmOptions } from "../options";
import { CreateFileDialog } from "./dialogs/CreateFileDialog";
import { ReportLanguageDialog } from "./dialogs/ReportLanguageDialog";
import { RobotPredictionSnackbar } from "./dialogs/RobotPredictionSnackbar";
import {
  DocMarkerContext,
  useConstructContextServices,
} from "./DocMarkerContext";
import { Theme } from "@emotion/react";
import { useMemo } from "react";

export interface ApplicationProps {
  readonly dmOptions: DmOptions;
}

export function Application(props: ApplicationProps) {
  const docMarkerContext = useConstructContextServices(props.dmOptions);
  const { dmOptions, fileMetadataStore, fileStateManager } = docMarkerContext;

  const theme: Theme = useMemo(() => createTheme(dmOptions.theme), [dmOptions]);

  const [isFileOpen] = useAtom(fileMetadataStore.isFileOpenAtom);

  // close te file when closing the browser
  // (this may trigger saving if the file is dirty)
  useUnload((e) => {
    if (isFileOpen) {
      fileStateManager.closeFile();
    }
  });

  return (
    <DocMarkerContext.Provider value={docMarkerContext}>
      <ThemeProvider theme={theme}>
        <div className={styles["app-bar-container"]}>
          <AppBar />
        </div>
        <div className={styles["app-body-container"]}>
          <WelcomeBody isOpen={!isFileOpen} />

          <AppBody isOpen={isFileOpen} />
        </div>
        <div className={styles["status-bar-container"]}>
          {/* Currently only used for debugging: Press Ctrl+F12 to see it */}
          <StatusBar />
        </div>

        <ChangeLocaleDialog />
        <CreateFileDialog />
        <ReportLanguageDialog />
        <RobotPredictionSnackbar />
        {dmOptions.slots.dialogs}
      </ThemeProvider>
    </DocMarkerContext.Provider>
  );
}
