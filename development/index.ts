import { bootstrapDocMarker } from "../src/index" // like "doc-marker"

bootstrapDocMarker({
  element: document.getElementById("doc-marker"),

  customization: {
    name: "DocMarker Demo Customization"
  },

  // the orange ÚFAL theme used for the demo
  theme: {
    palette: {
      mode: "light",
      primary: {
        main: "#f47b20", // ÚFAL orange
        contrastText: "rgba(255,255,255,0.95)" // white text over the primary
      },
      secondary: {
        main: "#f47b20" // light yellow
      }
    }
  }
})
