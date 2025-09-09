import { DmOptions, PartialDmOptions, setOptions } from "./options";
import { bootstrapLocalization } from "./i18n";
import * as styles from "./ui/Application.module.scss";

/**
 * Creates the entire DocMarker application from the given options object.
 */
export async function bootstrapDocMarker(
  givenOptions: PartialDmOptions,
): Promise<void> {
  const dmOptions: DmOptions = setOptions(givenOptions);

  if (!dmOptions.element) {
    throw new Error("Missing `element` in the options object.");
  }

  // Debugging tool that displays react re-renders of components.
  // Must be imported before React and React DOM.
  // https://github.com/aidenybai/react-scan
  if (process.env.NODE_ENV === "development") {
    await import("react-scan");
  }

  // react import defered after react-scan
  const { createRoot } = await import("react-dom/client");

  // localization
  const localesRepository = await bootstrapLocalization(dmOptions);

  // APIs
  await import("./importApis");

  // React slots
  const importedSlots = await dmOptions.slotsImporter();
  setOptions({ slots: importedSlots }, true); // additive set

  // defered import so that options are already set when the application is imported
  const { Application } = await import("./ui/Application");

  // create and bind the application
  const root = createRoot(dmOptions.element);
  root.render(
    <Application dmOptions={dmOptions} localesRepository={localesRepository} />,
  );
  dmOptions.element.classList.add(styles["application"]);
}
