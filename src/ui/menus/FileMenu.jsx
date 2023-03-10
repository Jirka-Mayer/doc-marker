import { Button, Menu, MenuList, MenuItem, ListItemIcon, Typography, Divider } from "@mui/material";
import { useState } from "react";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import LanguageIcon from '@mui/icons-material/Language';
import { useAtom } from "jotai"
import { openFileAtom, closeFileAtom, isFileOpenAtom, downloadFileAtom } from "../../state/fileStore";
import { AppFile } from "../../state/file/AppFile";

export function FileMenu() {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  function onMenuClick(e) {
    setAnchorEl(e.target)
  }
  function closeMenu() {
    setAnchorEl(null)
  }

  // === used state ===

  const [isFileOpen] = useAtom(isFileOpenAtom)

  const [,openFile] = useAtom(openFileAtom)
  const [,closeFile] = useAtom(closeFileAtom)
  const [,downloadFile] = useAtom(downloadFileAtom)

  // === click handlers ===

  function onNewEmptyFileClick() {
    // let patientId = ?
    // const file = AppFile.newEmpty(patientId)
    // openFile(file)
    alert("Not implemented.")
    closeMenu()
  }

  function onDownloadFileClick() {
    downloadFile()
    closeMenu()
  }

  function onCloseFileClick() {
    closeFile()
    closeMenu()
  }

  return (
    <>
      <Button
        size="small"
        onClick={onMenuClick}
      >File</Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
      >
        <MenuList>
          <MenuItem onClick={onNewEmptyFileClick}>
            <ListItemIcon>
              <NoteAddIcon />
            </ListItemIcon>
            <Typography variant="inherit">New empty file</Typography>
          </MenuItem>
          <MenuItem disabled={true}>
            <ListItemIcon>
              <UploadFileIcon />
            </ListItemIcon>
            <Typography variant="inherit">New from uploaded document</Typography>
          </MenuItem>
          
          <Divider/>

          <MenuItem onClick={onDownloadFileClick} disabled={!isFileOpen}>
            <ListItemIcon>
              <DownloadIcon />
            </ListItemIcon>
            <Typography variant="inherit">Download file</Typography>
          </MenuItem>
          <MenuItem disabled={true}>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <Typography variant="inherit">Details</Typography>
          </MenuItem>
          <MenuItem disabled={true}>
            <ListItemIcon>
              <LanguageIcon />
            </ListItemIcon>
            <Typography variant="inherit">Language</Typography>
          </MenuItem>

          <Divider/>
          
          <MenuItem onClick={onCloseFileClick} disabled={!isFileOpen}>
            <ListItemIcon>
              <CloseIcon />
            </ListItemIcon>
            <Typography variant="inherit">Close file</Typography>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  )
}