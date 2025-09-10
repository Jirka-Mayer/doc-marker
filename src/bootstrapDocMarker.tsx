import {
  mergeOptions,
  DmOptions,
  getDefaultOptions,
  PartialDmOptions,
} from "./options";
import { bootstrapLocalization } from "./i18n";
import * as styles from "./ui/Application.module.scss";
import { Application } from "./ui/Application";
import { createRoot } from "react-dom/client";

/**
 * Creates the entire DocMarker application from the given options object.
 */
export async function bootstrapDocMarker(
  givenOptions: PartialDmOptions,
): Promise<void> {
  let dmOptions: DmOptions = getDefaultOptions();

  // apply given options
  dmOptions = mergeOptions(dmOptions, givenOptions);

  if (!dmOptions.element) {
    throw new Error("Missing `element` in the options object.");
  }

  // localization
  const localesRepository = await bootstrapLocalization(dmOptions);

  // React slots
  const importedSlots = await dmOptions.slotsImporter();
  dmOptions = mergeOptions(dmOptions, { slots: importedSlots });

  // create and bind the application
  const root = createRoot(dmOptions.element);
  root.render(
    <Application dmOptions={dmOptions} localesRepository={localesRepository} />,
  );
  dmOptions.element!.classList.add(styles["application"]);
}
