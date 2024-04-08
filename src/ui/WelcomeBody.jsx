import * as styles from "./WelcomeBody.module.scss"
import Typography from '@mui/material/Typography'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, Paper, Stack, Table, TableBody, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Link } from "@mui/material"
import { useEffect, useState } from "react"
import { useAtom } from "jotai"
import { AppFilem, FileStorage, fileStore } from "../state"
import { FormDefinition } from "../../forms/FormDefinition"
import DeleteIcon from '@mui/icons-material/Delete'
import DownloadIcon from '@mui/icons-material/Download'
import moment from "moment"
import { currentOptions } from "../options"
import { useTranslation } from "react-i18next"
import { isOpenAtom as isCreateFileDialogOpenAtom } from "./dialogs/CreateFileDialog"

import packageJson from "../../package.json"
const VERSION = packageJson.version

export function WelcomeBody(props) {
  const {
    isOpen,
  } = props

  const { t } = useTranslation("welcomeBody")

  const [fileList] = useAtom(fileStore.fileListAtom)
  const [,setCreateFileDialogOpenAtom] = useAtom(isCreateFileDialogOpenAtom)

  // deleting state
  const [recordToDelete, setRecordToDelete] = useState(null)
  
  // uploading state
  const [fileToUpload, setFileToUpload] = useState(null)
  const [fileToOverwrite, setFileToOverwrite] = useState(null)

  async function handleFileUpload(input) {
    // get the uploaded file as an AppFile instance
    if (input.files.length === 0)
      return
    const uploadedJson = await input.files[0].text()
    input.value = null
    const uploadedAppFile = new AppFile(JSON.parse(uploadedJson))

    // check if there is the same file already uploaded
    const existingAppFile = FileStorage.loadFile(uploadedAppFile.uuid)
    if (existingAppFile !== null
      && existingAppFile.updatedAtString !== uploadedAppFile.updatedAtString
    ) {
      // open the dialog
      setFileToUpload(uploadedAppFile)
      setFileToOverwrite(existingAppFile)
    } else {
      // store and open
      fileStore.storeFile(uploadedAppFile)
      fileStore.openFile(uploadedAppFile.uuid)
    }
  }

  function closeUploadFileDialog() {
    setFileToUpload(null)
    setFileToOverwrite(null)
  }

  function finishFileUpload() {
    // store and open
    fileStore.storeFile(fileToUpload)
    fileStore.openFile(fileToUpload.uuid)
    
    closeUploadFileDialog()
  }

  // set page title
  useEffect(() => {
    document.head.getElementsByTagName("title")[0].innerText = t("title")
  }, [t])

  // this removes the content from DOM, which makes sure the tooltips
  // don't complain warnings about their anchor not being in DOM and visible
  if (!isOpen) {
    return (
      <div className={`${styles["welcome-body"]} ${isOpen ? "" : styles["welcome-body--closed"]}`}></div>
    )
  }

  return (
    <div className={`${styles["welcome-body"]} ${isOpen ? "" : styles["welcome-body--closed"]}`}>
      <div className={styles["centering-container"]}>
        <Paper className={styles["paper"]} square>

          <Typography variant="h3">{ t("title") }</Typography>

          <Typography variant="h5" gutterBottom>
            { t("browserFiles.title") }
          </Typography>

          { fileList.length === 0 ? (
            <Typography variant="body1" gutterBottom>
              { t("browserFiles.emptyMessage") }
            </Typography>
          ) : (
            <TableContainer component="div" className={styles["file-list"]}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{ t("browserFiles.column.file") }</TableCell>
                    <TableCell>{ t("browserFiles.column.lastModified") }</TableCell>
                    <TableCell>{ t("browserFiles.column.createdAt") }</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fileList.map(record =>
                    <TableRow key={ record.uuid }>
                      <TableCell>
                        <Tooltip title={t("browserFiles.tip.open")} disableInteractive>
                          <Link
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              fileStore.openFile(record.uuid)
                            }}
                          >
                            { record.constructFileName() }
                          </Link>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip
                          title={t("browserFiles.tip.lastModified", { timestamp: record.updatedAt })}
                          disableInteractive
                        >
                          <span>{ t("browserFiles.row.lastModified", { timestamp: record.updatedAt }) }</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip
                          title={t("browserFiles.tip.createdAt", { timestamp: record.createdAt })}
                          disableInteractive
                        >
                          <span>{ t("browserFiles.row.createdAt", { timestamp: record.createdAt }) }</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title={t("browserFiles.tip.delete")} disableInteractive>
                          <IconButton
                            size="small"
                            className={styles["file-list__action-button"]}
                            onClick={() => setRecordToDelete(record)}
                          >
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t("browserFiles.tip.download")} disableInteractive>
                          <IconButton
                            size="small"
                            className={styles["file-list__action-button"]}
                            onClick={() => fileStore.downloadFile(record.uuid)}
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

          <Stack direction="row" spacing={2} className={styles["new-file-actions"]}>
            <Button
              variant="contained"
              onClick={() => setCreateFileDialogOpenAtom(true)}
            >{ t("createNewFile") }</Button>
            <Button
              variant="outlined"
              component="label"
            >
              { t("uploadFile") }
              <input
                hidden
                accept="application/json"
                type="file"
                onChange={e => handleFileUpload(e.target)}
              />
            </Button>
          </Stack>

          {/* Footer with the version string */}
          <Typography variant="body2" gutterBottom sx={{ color: "#888", paddingTop: 1 }}>
            {currentOptions.customization.name} v{currentOptions.customization.version}<br/>
            DocMarker v{VERSION}
          </Typography>

          {/* Delete file dialog */}
          <Dialog open={recordToDelete !== null} onClose={() => setRecordToDelete(null)}>
            <DialogTitle>{ t("deleteDialog.title") }</DialogTitle>
            <DialogContent>
              <DialogContentText gutterBottom>
                { t("deleteDialog.confirmationText") }
              </DialogContentText>
              <Typography variant="button" gutterBottom>
                { recordToDelete ? recordToDelete.constructFileName() : "" }
              </Typography>
              <Typography variant="body2" gutterBottom>
                { recordToDelete ?
                  t("deleteDialog.lastModified", { timestamp: recordToDelete.updatedAt })
                : "" }
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                variant="outlined" color="error"
                onClick={() => setRecordToDelete(null)}
              >{ t("deleteDialog.cancel") }</Button>
              <Button
                variant="contained" color="error"
                onClick={() => {
                  fileStore.deleteFile(recordToDelete.uuid)
                  setRecordToDelete(null)
                }}
              >{ t("deleteDialog.delete") }</Button>
            </DialogActions>
          </Dialog>

          {/* Upload file dialog */}
          <Dialog open={fileToUpload !== null} onClose={closeUploadFileDialog}>
            <DialogTitle>{ t("uploadDialog.title") }</DialogTitle>
            <DialogContent>
              <DialogContentText gutterBottom>
                { t("uploadDialog.explanation") }
              </DialogContentText>
              <div style={{height: "20px"}}></div>
              <Typography variant="button" gutterBottom>
                { t("uploadDialog.uploadedFile") }
              </Typography>
              <Typography variant="body2" gutterBottom>
                { fileToUpload ?
                  t("uploadDialog.lastModified", { timestamp: fileToUpload.updatedAtString })
                : "" }
              </Typography>
              <div style={{height: "20px"}}></div>
              <Typography variant="button" gutterBottom>
                { t("uploadDialog.existingFile") }
              </Typography>
              <Typography variant="body2" gutterBottom>
                { fileToOverwrite ?
                  t("uploadDialog.lastModified", { timestamp: fileToOverwrite.updatedAtString })
                : "" }
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                variant="outlined"
                onClick={closeUploadFileDialog}
              >{ t("uploadDialog.cancel") }</Button>
              <Button
                variant="outlined" color="error"
                onClick={finishFileUpload}
              >{ t("uploadDialog.overwrite") }</Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </div>
    </div>
  )
}