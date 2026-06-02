import { AppMode } from "../../state/AppMode";
import { HighlightsAllocator } from "../highlights/HighlightsAllocator";
import { styles, activateHighlightValueClassSet } from "./quillStyles";

// TODO: dissolve into QuillExtended

/**
 * Class responsible for setting the proper CSS classes on the quill element
 */
export class QuillStateRenderer {
  private readonly quillElement: HTMLDivElement;
  private readonly containerElement: HTMLDivElement;
  private readonly highlightsAllocator: HighlightsAllocator;

  private lastKnownActiveFieldId: string | null = null;

  constructor(
    quillElement: HTMLDivElement,
    containerElement: HTMLDivElement,
    highlightsAllocator: HighlightsAllocator,
  ) {
    this.quillElement = quillElement;
    this.containerElement = containerElement;
    this.highlightsAllocator = highlightsAllocator;
  }

  /**
   * Refreshes the set of rendered CSS classes
   * (e.g. when the allocator gets reset)
   */
  public refresh(): void {
    this.renderFieldActivity(this.lastKnownActiveFieldId);
  }

  /**
   * Makes sure that active field highlight is activated
   */
  public renderFieldActivity(activeFieldId: string | null): void {
    // remember the active field
    this.lastKnownActiveFieldId = activeFieldId;

    // remove all of our highlight activation css classes
    Array.from(this.quillElement.classList.values())
      .filter((name) => activateHighlightValueClassSet.has(name))
      .forEach((name) => this.quillElement.classList.remove(name));

    // no field is active, do not add any css class
    if (activeFieldId === null) {
      return;
    }

    // add the proper activity css class
    const activeFieldNumber =
      this.highlightsAllocator.getHighlightNumber(activeFieldId);
    this.quillElement.classList.add(
      styles["activate-highlight-" + activeFieldNumber.toString()],
    );
  }

  /**
   * Sets the app mode CSS classes
   */
  public renderAppMode(appMode: AppMode): void {
    if (appMode === AppMode.ANONYMIZE) {
      this.containerElement.classList.add(styles["anonymization-mode"]);
    } else {
      this.containerElement.classList.remove(styles["anonymization-mode"]);
    }

    if (appMode === AppMode.ANNOTATE_HIGHLIGHTS) {
      this.containerElement.classList.add(styles["annotating-mode"]);
    } else {
      this.containerElement.classList.remove(styles["annotating-mode"]);
    }
  }
}
