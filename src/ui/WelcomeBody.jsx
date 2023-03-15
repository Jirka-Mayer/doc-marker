import * as styles from "./WelcomeBody.module.scss"
import Typography from '@mui/material/Typography'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, Paper, Stack, Table, TableBody, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from "@mui/material"
import { useState } from "react"
import { useAtom } from "jotai"
import { AppFile } from "../state/file/AppFile"
import DeleteIcon from '@mui/icons-material/Delete'
import DownloadIcon from '@mui/icons-material/Download'
import * as fileStore from "../state/fileStore"

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

  const [fileList] = useAtom(fileStore.fileListAtom)
  const [,createNewFile] = useAtom(fileStore.createNewFileAtom)
  const [,openFile] = useAtom(fileStore.openFileAtom)
  const [,deleteFile] = useAtom(fileStore.deleteFileAtom)
  const [,downloadFile] = useAtom(fileStore.downloadFileAtom)

  function openDeleteFileDialog(record) {
    // TODO: actually show a dialog
    deleteFile(record.uuid)
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
          
          <Typography variant="h5" gutterBottom>Start from scratch</Typography>

          <Stack direction="row" spacing={2} className={styles["new-file-actions"]}>
            <Button
              variant="contained"
              /* TODO: get the default form ID from somewhere */
              onClick={() => createNewFile("ResQPlus AppDevelopmentForm 1.0 CZ")}
            >Create New File</Button>
            <Button
              variant="outlined"
              component="label"
              disabled={true}
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


          <Typography variant="h5" gutterBottom>Files in this web browser</Typography>

          { fileList.length === 0 ? (
            <Typography variant="body1" gutterBottom>
              No files stored in the browser.
            </Typography>
          ) : (
            <TableContainer component="div" className={styles["file-list"]}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>File</TableCell>
                    <TableCell>Last modified</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fileList.map(record =>
                    <TableRow key={ record.uuid }>
                      <TableCell>
                        <Tooltip title="Open file" placement="left" disableInteractive>
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => openFile(record.uuid)}
                          >
                            { record.constructFileName() }
                          </Button>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        { record.writtenAt.toISOString() }
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Delete from browser" placement="left" disableInteractive>
                          <IconButton
                            size="small"
                            className={styles["file-list__action-button"]}
                            onClick={() => openDeleteFileDialog(record)}
                          >
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download" placement="right" disableInteractive>
                          <IconButton
                            size="small"
                            className={styles["file-list__action-button"]}
                            onClick={() => downloadFile(record.uuid)}
                          >
                            <DownloadIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) }


          <Typography variant="h5" gutterBottom>Testing Data</Typography>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={test_onlyDischargeReport}
            >Only Discharge Report</Button>
          </Stack>

          <Dialog open={isNewFileDialogOpen} onClose={() => {}}>
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
              <Button onClick={() => {}}>Cancel</Button>
              <Button variant="contained" onClick={() => {}}>Create</Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </div>
    </div>
  )
}