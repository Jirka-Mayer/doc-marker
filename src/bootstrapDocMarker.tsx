import { currentOptions, PartialDmOptions, setOptions } from "./options";
import { bootstrapLocalization } from "./i18n";
import { createRoot } from "react-dom/client";
import * as styles from "./ui/Application.module.scss";

/**
 * Creates the entire DocMarker application from the given options object.
 */
export async function bootstrapDocMarker(
  givenOptions: PartialDmOptions,
): Promise<void> {
  setOptions(givenOptions);

  if (!givenOptions.element) {
    throw new Error("Missing `element` in the options object.");
  }

  // localization
  await bootstrapLocalization();

  // APIs
  await import("./importApis");

  // React slots
  const importedSlots = await currentOptions.slotsImporter();
  setOptions({ slots: importedSlots }, true); // additive set

  // defered import so that options are already set when the application is imported
  const { Application } = await import("./ui/Application");

  // check that element option is set
  if (!currentOptions.element) {
    throw new Error("The DocMarker `element` option is required.");
  }

  // create and bind the application
  const root = createRoot(currentOptions.element);
  root.render(<Application />);
  currentOptions.element.classList.add(styles["application"]);
}
