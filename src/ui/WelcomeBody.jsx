import * as styles from "./WelcomeBody.module.scss"
import Typography from '@mui/material/Typography'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, Paper, Stack, Table, TableBody, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from "@mui/material"
import { useState } from "react"
import { useAtom } from "jotai"
import { AppFile } from "../state/file/AppFile"
import { FormDefinition } from "../../forms/FormDefinition"
import DeleteIcon from '@mui/icons-material/Delete'
import DownloadIcon from '@mui/icons-material/Download'
import * as fileStore from "../state/fileStore"
import moment from "moment"

import packageJson from "../../package.json"
const VERSION = packageJson.version

export function WelcomeBody(props) {
  const {
    isOpen,
  } = props

  const [fileList] = useAtom(fileStore.fileListAtom)
  const [,createNewFile] = useAtom(fileStore.createNewFileAtom)
  const [,openFile] = useAtom(fileStore.openFileAtom)
  const [,deleteFile] = useAtom(fileStore.deleteFileAtom)
  const [,downloadFile] = useAtom(fileStore.downloadFileAtom)

  const [recordToDelete, setRecordToDelete] = useState(null)

  async function uploadFile(input) {
    if (input.files.length === 0)
      return

    const json = await input.files[0].text()
    input.value = null

    const body = JSON.parse(json)
    const file = new AppFile(body)
    // applicationOpenFile(file)
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
              onClick={() => createNewFile(FormDefinition.DEFAULT_FORM_ID)}
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
                    <TableCell>Created at</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fileList.map(record =>
                    <TableRow key={ record.uuid }>
                      <TableCell>
                        <Tooltip title="Open file" disableInteractive>
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
                        <Tooltip title={moment(record.updatedAt).toString()} disableInteractive>
                          <span>{ moment(record.updatedAt).calendar() }</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={moment(record.createdAt).toString()} disableInteractive>
                          <span>{ moment(record.createdAt).calendar() }</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Delete from browser" disableInteractive>
                          <IconButton
                            size="small"
                            className={styles["file-list__action-button"]}
                            onClick={() => setRecordToDelete(record)}
                          >
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download" disableInteractive>
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

          <Dialog open={recordToDelete !== null} onClose={() => setRecordToDelete(null)}>
            <DialogTitle>Delete file from browser</DialogTitle>
            <DialogContent>
              <DialogContentText gutterBottom>
                Are you sure you want to delete the following file from this web browser?
                If you have the file downloaded, you can always upload it back again.
              </DialogContentText>
              <Typography variant="button" gutterBottom>
                { recordToDelete ? recordToDelete.constructFileName() : "" }
              </Typography>
              <Typography variant="body2" gutterBottom>
                Last modified:&nbsp;
                { recordToDelete ? moment(recordToDelete.updatedAt).calendar() : "" }
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                variant="outlined" color="error"
                onClick={() => setRecordToDelete(null)}
              >Cancel</Button>
              <Button
                variant="contained" color="error"
                onClick={() => {
                  deleteFile(recordToDelete.uuid)
                  setRecordToDelete(null)
                }}
              >Delete</Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </div>
    </div>
  )
}