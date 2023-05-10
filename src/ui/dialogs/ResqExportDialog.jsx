import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Snackbar, TextField, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import { atom, useAtom } from "jotai";
import * as fileStore from "../../state/fileStore"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CodeIcon from '@mui/icons-material/Code';
import { useState } from "react";
import { exportToResqRegistry } from "../../state/file/exportToResqRegistry";

export const isOpenAtom = atom(false)

const imageUrl_browserConsole = new URL(
  "./ResqExportDialog/browser-console.png", import.meta.url
)

export function ResqExportDialog() {
  const [patientId, setPatientId] = useAtom(fileStore.patientIdAtom)
  const [isOpen, setIsOpen] = useAtom(isOpenAtom)
  const [isSnackbarOpen, setSnackbarOpen] = useState(false)

  function handlePatientIdChange(event) {
    let value = event.target.value.trim()
    if (!value)
      value = null
    setPatientId(value)
  }

  function handleCopyCodeClick() {
    exportToResqRegistry()
    setSnackbarOpen(true)
  }

  return (
    <Dialog open={isOpen} fullScreen onClose={() => setIsOpen(false)}>

      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h3">
          Export dat do RES-Q
        </Typography>

        <Button
          variant="outlined"
          sx={{ my: 4 }}
          startIcon={<ArrowBackIcon />}
          onClick={() => setIsOpen(false)}
        >
          Zpět do aplikace
        </Button>

        <Typography>
          Vytvořte v RES-Q záznam nového pacienta (nebo otevřete existujícího)
          a zkopírujte sem jeho RES-Q identifikátor:
        </Typography>

        <TextField
          autoFocus
          margin="dense"
          label="RES-Q identifikátor pacienta"
          placeholder="Např. demo_site_2023-03-20_839"
          size="medium"
          variant="outlined"
          fullWidth
          value={patientId || ""}
          onChange={handlePatientIdChange}
          sx={{ my: 2 }}
        />

        <Typography>
          Ve formuláři pacienta otevřte konzoli webového prohlížeče pomocí:
        </Typography>

        <Typography component="div">
          <ul>
            <li><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>J</kbd> (MS Edge, Chrome, Opera)</li>
            <li><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>K</kbd> (Firefox)</li>
            <li><kbd>F12</kbd></li>
          </ul>
        </Typography>

        <Paper style={{ overflow: "hidden" }} sx={{ my: 4 }}>
          <img
            src={imageUrl_browserConsole}
            style={{ maxWidth: "100%", display: "block" }}
          />
        </Paper>

        <Typography>
          Kliknutím na tlačítko se vám do schránky zkopíruje exportovací kód:
        </Typography>

        <Button
          variant="contained"
          sx={{ my: 2 }}
          startIcon={<CodeIcon />}
          onClick={handleCopyCodeClick}
        >
          Zkopírovat kód
        </Button>
        <Snackbar
          open={isSnackbarOpen}
          autoHideDuration={5000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert severity="info" onClose={() => setSnackbarOpen(false)}>
            Kód byl zkopírován do schránky
          </Alert>
        </Snackbar>

        <Typography gutterBottom>
          Kód vložte do konzole prohlížeče a stiskem klávesy enter
          ho spustťe. Mělo by se vám zobrazit okno se zprávou o úspěšném
          vložení dat.
        </Typography>
        <Typography>
          RES-Q formulář by nyní měl být vyplněný, zkontrolujte jeho obsah
          a uložte, jako kdybyste ho vyplňil(a) ručně.
        </Typography>

        <Button
          variant="outlined"
          sx={{ mt: 4 }}
          startIcon={<ArrowBackIcon />}
          onClick={() => setIsOpen(false)}
        >
          Zpět do aplikace
        </Button>
      </Container>
    </Dialog>
  )
}