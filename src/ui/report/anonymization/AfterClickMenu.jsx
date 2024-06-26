import { Menu, MenuList, MenuItem, ListItemIcon, Typography, ListSubheader, Divider } from "@mui/material";
import { useAtom } from "jotai";
import { reportStore } from "../../../state";
import { createContextMenuAtoms } from "../utils/createContextMenuAtoms";
import WrongLocationIcon from '@mui/icons-material/WrongLocation';
import PasswordIcon from '@mui/icons-material/Password';

const quillExtended = reportStore.quillExtended

const {
  anchorTextRangeAtom,
  anchorPositionAtom,
  closeMenuAtom,
  openMenuAtom
} = createContextMenuAtoms()

export { openMenuAtom }

export function AfterClickMenu() {
  const [anchorTextRange] = useAtom(anchorTextRangeAtom)
  const [anchorPosition] = useAtom(anchorPositionAtom)
  const [,closeMenu] = useAtom(closeMenuAtom)

  const kindId = anchorTextRange ? quillExtended.getAnonymization(
    anchorTextRange.index,
    anchorTextRange.length
  ) : null

  function removeAnonymizationMarking() {
    quillExtended.anonymizeText(
      anchorTextRange.index,
      anchorTextRange.length,
      ""
    )
    
    closeMenu()
  }

  // function forgetText() {
  //   // TODO: add the text forgetting logic to quill

  //   closeMenu()
  // }
  
  return (
    <>
      <Menu
        id="anonymization-after-click-context-menu"
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition}
        open={anchorPosition !== null}
        onClose={closeMenu}
        MenuListProps={{
          subheader: <ListSubheader>{ kindId }</ListSubheader>
        }}
      >
        <MenuItem onClick={removeAnonymizationMarking}>
          <ListItemIcon>
            <WrongLocationIcon />
          </ListItemIcon>
          <Typography variant="inherit">Remove anonymization marking</Typography>
        </MenuItem>

        {/* <MenuItem onClick={forgetText}>
          <ListItemIcon>
            <PasswordIcon />
          </ListItemIcon>
          <Typography variant="inherit">Forget text now</Typography>
        </MenuItem> */}

      </Menu>
    </>
  )
}