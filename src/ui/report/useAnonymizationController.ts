import { useCallback, useEffect } from "react";
import { AppMode } from "../../state/AppMode";
import { useAtomValue } from "jotai";
import { QuillExtended } from "../../quill/QuillExtended";
import { ContextMenuController } from "./ContextMenuController";
import { AnnotationControllerProps } from "./useAnnotationController";
import { TextRange } from "../../utils/TextRange";
import { EditorStore } from "../../state/EditorStore";

export interface AnnonymizationControllerProps {
  readonly quillExtended: QuillExtended;
  readonly editorStore: EditorStore;
  readonly clickCmc: ContextMenuController;
  readonly dragCmc: ContextMenuController;
}

export function useAnonymizationController(
  props: AnnonymizationControllerProps,
) {
  const appMode = useAtomValue(props.editorStore.appModeAtom);

  const onSelectionChange = useCallback((e) => {
    handleSelectionChange(props, e.range);
  }, []);

  function attach() {
    props.quillExtended.disable();
    props.quillExtended.enableWordSelection();
    props.quillExtended.onSelectionChanged.subscribe(onSelectionChange);
  }

  function detach() {
    props.quillExtended.enable();
    props.quillExtended.disableWordSelection();
    props.quillExtended.onSelectionChanged.unsubscribe(onSelectionChange);
  }

  // connect with react
  useEffect(() => {
    if (appMode === AppMode.ANONYMIZE) {
      attach();
      return detach;
    }
  }, [appMode]);
}

function handleSelectionChange(
  props: AnnotationControllerProps,
  range: TextRange | null,
) {
  // if the selection is outside quill, do nothing
  if (range === null) {
    return;
  }

  if (range.length === 0) {
    handleClick(props, range.index);
  } else {
    handleDrag(props, range);
  }
}

function handleClick(props: AnnotationControllerProps, index: number) {
  // ignore clicks around the text
  if (!props.quillExtended.isClickInsideText(index)) {
    return;
  }

  // get anonymized range
  const anonymizedRange = props.quillExtended.getAnonymizedRange(index);

  // the click was not over any anonymized range
  if (anonymizedRange === null) {
    return;
  }

  // show the context menu
  props.clickCmc.openMenu(anonymizedRange);
}

function handleDrag(props: AnnotationControllerProps, range: TextRange) {
  // open context menu that asks for the kind of anonymized data
  props.dragCmc.openMenu(range);
}
