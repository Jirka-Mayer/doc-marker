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
import { useTranslation } from "react-i18next"
const VERSION = packageJson.version

export function WelcomeBody(props) {
  const {
    isOpen,
  } = props

  const { t } = useTranslation("welcomeBody")

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

    // TODO: handle UUID collisions
    const body = JSON.parse(json)
    const file = new AppFile(body)
    // applicationOpenFile(file)
  }

  return (
    <div className={`${styles["welcome-body"]} ${isOpen ? "" : styles["welcome-body--closed"]}`}>
      <div className={styles["centering-container"]}>
        <Paper className={styles["paper"]} square>

          <Typography variant="h3">{ t("title") }</Typography>
          <Typography variant="h5" gutterBottom sx={{ opacity: 0.5 }}>[v{VERSION}]</Typography>
          
          {/* <Typography variant="h5" gutterBottom>&nbsp;</Typography> */}


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

          <Stack direction="row" spacing={2} className={styles["new-file-actions"]}>
            <Button
              variant="contained"
              onClick={() => createNewFile(FormDefinition.DEFAULT_FORM_ID)}
            >{ t("createNewFile") }</Button>
            <Button
              variant="outlined"
              component="label"
              disabled={true}
            >
              { t("uploadFile") }
              <input
                hidden
                accept="application/json"
                type="file"
                onChange={e => uploadFile(e.target)}
              />
            </Button>
          </Stack>

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
                  deleteFile(recordToDelete.uuid)
                  setRecordToDelete(null)
                }}
              >{ t("deleteDialog.delete") }</Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </div>
    </div>
  )
}