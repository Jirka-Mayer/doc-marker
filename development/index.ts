async function main() {
  // Debugging tool that displays react re-renders of components.
  // Must be imported before React and React DOM.
  // https://github.com/aidenybai/react-scan
  if (process.env.NODE_ENV === "development") {
    await import("react-scan");
  }

  // deferred import so that react-scan is imported first
  const { bootstrapDocMarker, DummyRobot } = await require("../src/index");

  bootstrapDocMarker({
    element: document.getElementById("doc-marker"),

    customization: {
      name: "DocMarker Demo Customization",
    },

    // the orange ÚFAL theme used for the demo
    theme: {
      palette: {
        mode: "light",
        primary: {
          main: "#f47b20", // ÚFAL orange
          contrastText: "rgba(255,255,255,0.95)", // white text over the primary
        },
        secondary: {
          main: "#f47b20", // light yellow
        },
      },
    },

    robot: new DummyRobot(),
  });
}

main();
