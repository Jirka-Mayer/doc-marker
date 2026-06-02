import { useAtomValue } from "jotai";
import * as styles from "./AppBody.module.scss";
import { FormColumn } from "./form/FormColumn";
import { ReportColumn } from "./report/ReportColumn";
import { AppMode } from "../state/AppMode";
import { useContext } from "react";
import { DocMarkerContext } from "./DocMarkerContext";

export function AppBody(props) {
  const { isOpen } = props;

  const { editorStore } = useContext(DocMarkerContext);

  const appMode = useAtomValue(editorStore.appModeAtom);
  const isFormOpen = appMode === AppMode.ANNOTATE_HIGHLIGHTS;

  return (
    <div
      className={
        styles["app-body"] + " " + (isOpen ? "" : styles["app-body--closed"])
      }
    >
      <div className={styles["report"]}>
        <ReportColumn />
      </div>
      <div
        className={
          styles["form"] + " " + (isFormOpen ? "" : styles["form--closed"])
        }
      >
        <FormColumn />
      </div>
    </div>
  );
}
