import { Button, Menu, MenuList, MenuItem, ListItemIcon, Typography, Divider } from "@mui/material";
import { useState } from "react";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import LanguageIcon from '@mui/icons-material/Language';
import SaveIcon from '@mui/icons-material/Save';
import { useAtom } from "jotai"
import * as fileStore from "../../state/fileStore"
import { AppFile } from "../../state/file/AppFile";
import { isOpenAtom as isLocaleDialogOpenAtom } from "../dialogs/ChangeLocaleDialog"
import { FormDefinition } from "../../../forms/FormDefinition";
import { useTranslation } from "react-i18next";

export function FileMenu() {
  const { t } = useTranslation("menus")

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  function onMenuClick(e) {
    setAnchorEl(e.target)
  }
  function closeMenu() {
    setAnchorEl(null)
  }

  // === used state ===

  const [isFileOpen] = useAtom(fileStore.isFileOpenAtom)

  const [,createNewFile] = useAtom(fileStore.createNewFileAtom)
  const [,saveCurrentFile] = useAtom(fileStore.saveCurrentFileAtom)
  const [,closeFile] = useAtom(fileStore.closeFileAtom)
  const [,downloadCurrentFile] = useAtom(fileStore.downloadCurrentFileAtom)

  const [,setLocaleDialogOpen] = useAtom(isLocaleDialogOpenAtom)

  // === click handlers ===

  function onNewEmptyFileClick() {
    createNewFile(FormDefinition.DEFAULT_FORM_ID)
    closeMenu()
  }

  function onSaveFileClick() {
    saveCurrentFile()
    closeMenu()
  }

  function onDownloadFileClick() {
    downloadCurrentFile()
    closeMenu()
  }

  function onCloseFileClick() {
    closeFile()
    closeMenu()
  }

  function onChangeLanguageClick() {
    setLocaleDialogOpen(true)
    closeMenu()
  }

  return (
    <>
      <Button
        size="small"
        onClick={onMenuClick}
      >{ t("file.headButton") }</Button>
      <Menu
        id="file-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
        variant="menu"
      >
        <MenuItem onClick={onNewEmptyFileClick}>
          <ListItemIcon>
            <NoteAddIcon />
          </ListItemIcon>
          <Typography variant="inherit">
            { t("file.newEmptyFile") }
          </Typography>
        </MenuItem>
        <MenuItem disabled={true}>
          <ListItemIcon>
            <UploadFileIcon />
          </ListItemIcon>
          <Typography variant="inherit">
            { t("file.newFileFromUploaded") }
          </Typography>
        </MenuItem>
        <MenuItem onClick={onSaveFileClick} disabled={!isFileOpen}>
          <ListItemIcon>
            <SaveIcon />
          </ListItemIcon>
          <Typography variant="inherit">
            { t("file.saveFile") }
          </Typography>
        </MenuItem>
        
        <Divider/>

        <MenuItem onClick={onDownloadFileClick} disabled={!isFileOpen}>
          <ListItemIcon>
            <DownloadIcon />
          </ListItemIcon>
          <Typography variant="inherit">
            { t("file.downloadFile") }
          </Typography>
        </MenuItem>
        <MenuItem disabled={true}>
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <Typography variant="inherit">
            { t("file.details") }
          </Typography>
        </MenuItem>
        <MenuItem onClick={onChangeLanguageClick}>
          <ListItemIcon>
            <LanguageIcon />
          </ListItemIcon>
          <Typography variant="inherit">
            { t("file.language") }
          </Typography>
        </MenuItem>

        <Divider/>
        
        <MenuItem onClick={onCloseFileClick} disabled={!isFileOpen}>
          <ListItemIcon>
            <CloseIcon />
          </ListItemIcon>
          <Typography variant="inherit">
            { t("file.closeFile") }
          </Typography>
        </MenuItem>
      </Menu>
    </>
  )
}