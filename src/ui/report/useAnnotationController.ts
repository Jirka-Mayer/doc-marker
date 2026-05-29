import { useCallback, useContext, useEffect } from "react";
import * as editorStore from "../../state/editorStore";
import { AppMode } from "../../state/editor/AppMode";
import { useAtomValue } from "jotai";
import { DocMarkerContext } from "../DocMarkerContext";
import { TextRange } from "../../utils/TextRange";
import {
  QuillExtended,
  SelectionChangedEventArgs,
} from "../../quill/QuillExtended";
import { ContextMenuController } from "./ContextMenuController";

export interface AnnotationControllerProps {
  readonly quillExtended: QuillExtended;
  readonly clickCmc: ContextMenuController;
  readonly dragCmc: ContextMenuController;
}

/**
 * Controls report-related UI in the annotation mode
 */
export function useAnnotationController(props: AnnotationControllerProps) {
  const appMode = useAtomValue(editorStore.appModeAtom);
  const activeFieldId = useAtomValue(editorStore.activeFieldIdAtom);

  const onSelectionChange = useCallback(
    (e: SelectionChangedEventArgs) => {
      handleSelectionChange(props, e.range, activeFieldId);
    },
    [activeFieldId],
  );

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
    if (appMode === AppMode.ANNOTATE_HIGHLIGHTS) {
      attach();
      return detach;
    }
  }, [appMode, activeFieldId]);
}

function handleSelectionChange(
  props: AnnotationControllerProps,
  range: TextRange,
  activeFieldId: string | null,
) {
  // if no field is active, do nothing
  if (activeFieldId === null) {
    return;
  }

  // if the selection is outside quill, do nothing
  if (range === null) {
    return;
  }

  if (range.length === 0) {
    handleClick(props, range.index, activeFieldId);
  } else {
    handleDrag(props, range);
  }
}

function handleClick(
  props: AnnotationControllerProps,
  index: number,
  activeFieldId: string,
) {
  // ignore clicks around the text
  if (!props.quillExtended.isClickInsideText(index)) {
    return;
  }

  // get highlight range
  const highlightRange = props.quillExtended.getHighlightRange(
    index,
    activeFieldId,
  );

  // the click was not over any highlighted range
  if (highlightRange === null) {
    return;
  }

  // show the context menu
  props.clickCmc.openMenu(highlightRange);
}

function handleDrag(props: AnnotationControllerProps, range: TextRange) {
  // open the context menu that asks whether to add a new highlight range
  props.dragCmc.openMenu(range);
}
