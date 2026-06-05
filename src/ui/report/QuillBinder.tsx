import { useContext, useEffect, useMemo, useRef } from "react";
import * as styles from "./QuillBinder.module.scss"; // must be referenced to be included in CSS
import { useAtomValue } from "jotai";
import { useAnnotationController } from "./useAnnotationController";
import { useAnonymizationController } from "./useAnonymizationController";
import { useTranslation } from "react-i18next";
import { AfterClickMenu as AnonymizationAfterClickMenu } from "./anonymization/AfterClickMenu";
import { AfterDragMenu as AnonymizationAfterDragMenu } from "./anonymization/AfterDragMenu";
import { AfterClickMenu as AnnotationAfterClickMenu } from "./annotation/AfterClickMenu";
import { AfterDragMenu as AnnotationAfterDragMenu } from "./annotation/AfterDragMenu";
import { useTheme } from "@emotion/react";
import { alpha } from "@mui/material";
import { DocMarkerContext } from "../DocMarkerContext";
import { ContextMenuController } from "./ContextMenuController";

/**
 * Binds the quill instance with the DOM as a react component
 */
export function QuillBinder() {
  const { t } = useTranslation("quill");

  const { jotaiStore, quillExtended, editorStore } =
    useContext(DocMarkerContext);

  const theme = useTheme() as any;

  const appMode = useAtomValue(editorStore.appModeAtom);
  const activeFieldId = useAtomValue(editorStore.activeFieldIdAtom);
  const displayDebugInfo = useAtomValue(editorStore.displayDebugInfoAtom);

  // context menu controllers
  const anonymizationClickCMC = useMemo(
    () => new ContextMenuController(jotaiStore, quillExtended),
    [],
  );
  const anonymizationDragCMC = useMemo(
    () => new ContextMenuController(jotaiStore, quillExtended),
    [],
  );
  const annotationClickCMC = useMemo(
    () => new ContextMenuController(jotaiStore, quillExtended),
    [],
  );
  const annotationDragCMC = useMemo(
    () => new ContextMenuController(jotaiStore, quillExtended),
    [],
  );

  const bindingContainerRef = useRef<HTMLDivElement>(null!);

  // quill element attachment to DOM
  useEffect(() => {
    quillExtended.attachTo(bindingContainerRef.current);
    return () => {
      quillExtended.detach();
    };
  }, []);

  // app mode rendering
  useEffect(() => {
    quillExtended.renderAppMode(appMode);
  }, [appMode]);

  // active field rendering
  useEffect(() => {
    quillExtended.renderFieldActivity(activeFieldId);
  }, [activeFieldId]);

  // placeholder text according to the language
  useEffect(() => {
    quillExtended.setPlaceholderText(t("placeholder"));
  }, [t]);

  // themed colors
  useEffect(() => {
    // color for the selected text
    document.body.style.setProperty(
      "--dm-report-selection-color",
      alpha(theme.palette.primary.light, 0.78),
    );

    // regular highlight
    document.body.style.setProperty(
      "--dm-regular-highlight-border",
      theme.palette.primary.main,
    );

    // active highlight
    document.body.style.setProperty(
      "--dm-active-highlight-border",
      theme.palette.primary.main,
    );
    document.body.style.setProperty(
      "--dm-active-highlight-background",
      alpha(theme.palette.primary.main, 0.15),
    );
  });

  // app mode controllers
  useAnonymizationController({
    quillExtended,
    editorStore,
    clickCmc: anonymizationClickCMC,
    dragCmc: anonymizationDragCMC,
  });
  useAnnotationController({
    quillExtended,
    editorStore,
    clickCmc: annotationClickCMC,
    dragCmc: annotationDragCMC,
  });

  // debug rendering
  // TODO: remove from here and put into the report column instead
  const debugRef = useRef<HTMLPreElement>(null!);
  useEffect(() => {
    debugRef.current.innerText = displayDebugInfo
      ? quillExtended.renderHighlightIdMap()
      : "";
  }, [displayDebugInfo]);

  // this is just to bind the scss file, so that parcel does not
  // prune it away. All styles there are defined globally,
  // so no class names need to be referenced.
  styles;

  return (
    <>
      {/* <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet"></link> */}

      <div ref={bindingContainerRef}></div>

      <AnonymizationAfterClickMenu cmc={anonymizationClickCMC} />
      <AnonymizationAfterDragMenu cmc={anonymizationDragCMC} />
      <AnnotationAfterClickMenu cmc={annotationClickCMC} />
      <AnnotationAfterDragMenu cmc={annotationDragCMC} />

      <pre ref={debugRef}></pre>
    </>
  );
}
