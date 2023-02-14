import * as styles from "./WelcomeBody.module.scss"
import Typography from '@mui/material/Typography'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Paper, Stack, TextField } from "@mui/material"
import { useState } from "react"
import { AppFile } from "../state/file/AppFile"

import packageJson from "../../package.json"
const VERSION = packageJson.version

import json_test_onlyDischargeReport from "./test__only-discharge-report.json"

export function WelcomeBody(props) {
  
  const {
    isOpen,
    applicationOpenFile
  } = props

  const [isNewFileDialogOpen, setNewDialogOpen] = useState(false)
  const [newFilePatientId, setNewFilePatientId] = useState("")

  function generateNewPatientId() {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, "0")
    const d = String(now.getDate() + 1).padStart(2, "0")
    const salt = Math.floor((Math.random() * 999) + 1)
    return `doc_marker_${y}-${m}-${d}_${salt}`
  }

  function openNewFileDialog() {
    setNewFilePatientId(generateNewPatientId())
    setNewDialogOpen(true)
  }

  function closeNewFileDialog() {
    setNewDialogOpen(false)
  }

  function submitNewFileDialog() {
    if (newFilePatientId === "")
      return
    createNewFile(newFilePatientId)
    setNewDialogOpen(false)
  }

  function createNewFile(patientId) {
    const file = AppFile.newEmpty(patientId)
    applicationOpenFile(file)
  }

  async function uploadFile(input) {
    if (input.files.length === 0)
      return

    const json = await input.files[0].text()
    input.value = null

    const body = JSON.parse(json)
    const file = new AppFile(body)
    applicationOpenFile(file)
  }

  function test_onlyDischargeReport() {
    const file = new AppFile(json_test_onlyDischargeReport)
    applicationOpenFile(file)
  }

  return (
    <div className={`${styles["welcome-body"]} ${isOpen ? "" : styles["welcome-body--closed"]}`}>
      <div className={styles["centering-container"]}>
        <Paper className={styles["paper"]} square>

          <Typography variant="h3">DocMarker for RES-Q+</Typography>
          <Typography variant="h5" gutterBottom sx={{ opacity: 0.5 }}>[v{VERSION}]</Typography>
          
          <Typography variant="h5" gutterBottom>Real Data</Typography>

          <Typography variant="body1" gutterBottom>
            Here can be a list of uploaded files identified by patient ID
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={openNewFileDialog}
            >Create New File</Button>
            <Button
              variant="contained"
              component="label"
            >
              Upload File
              <input
                hidden
                accept="application/json"
                type="file"
                onChange={e => uploadFile(e.target)}
              />
            </Button>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h5" gutterBottom>Testing Data</Typography>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={test_onlyDischargeReport}
            >Only Discharge Report</Button>
          </Stack>

          <Dialog open={isNewFileDialogOpen} onClose={closeNewFileDialog}>
            <DialogTitle>Create New File</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Dear RES-Q user. RES-Q effort is to ensure that our partnership is compliant with all legislation. Please understand that
                we cannot allow identification of patients from RES-Q database. Therefore, please use RES-Q generated identifier.
                It contains SITE ID and RECORD CREATION DATE and it allows to filter patients by creation date in the Patient List.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="new-file__patient-id"
                label="Patient ID"
                type="text"
                fullWidth
                variant="standard"
                value={newFilePatientId}
                onChange={e => {setNewFilePatientId(e.target.value)}}
              />
              <TextField
                autoFocus
                margin="dense"
                id="new-file__patient-id"
                label="Patient Admission Date"
                type="text"
                fullWidth
                variant="standard"
                defaultValue="This field is not used now, need to learn more about it."
                disabled
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={closeNewFileDialog}>Cancel</Button>
              <Button variant="contained" onClick={submitNewFileDialog}>Create</Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </div>
    </div>
  )
}