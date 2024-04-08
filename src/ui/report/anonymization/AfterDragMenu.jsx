import { Menu, MenuList, MenuItem, ListItemIcon, Typography, Divider } from "@mui/material";
import { useAtom } from "jotai";
import { reportStore } from "../../../state";
import { createContextMenuAtoms } from "../utils/createContextMenuAtoms";
import PersonIcon from '@mui/icons-material/Person';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CallIcon from '@mui/icons-material/Call';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import StarIcon from '@mui/icons-material/Star';

const {
  anchorTextRangeAtom,
  anchorPositionAtom,
  closeMenuAtom,
  openMenuAtom
} = createContextMenuAtoms()

export { openMenuAtom }

export function AfterDragMenu() {
  const [anchorTextRange] = useAtom(anchorTextRangeAtom)
  const [anchorPosition] = useAtom(anchorPositionAtom)
  const [,closeMenu] = useAtom(closeMenuAtom)

  function kindSelected(kindId) {
    reportStore.quillExtended.anonymizeText(
      anchorTextRange.index,
      anchorTextRange.length,
      kindId
    )
    
    closeMenu()
  }
  
  return (
    <>
      <Menu
        id="anonymization-after-drag-context-menu"
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition}
        open={anchorPosition !== null}
        onClose={closeMenu}
      >
        <MenuItem onClick={() => kindSelected("name-person")}>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <Typography variant="inherit">Person name</Typography>
        </MenuItem>

        <MenuItem onClick={() => kindSelected("name-organization")}>
          <ListItemIcon>
            <AccountBalanceIcon />
          </ListItemIcon>
          <Typography variant="inherit">Organization name</Typography>
        </MenuItem>

        <MenuItem onClick={() => kindSelected("personalInformation")}>
          <ListItemIcon>
            <CreditCardIcon />
          </ListItemIcon>
          <Typography variant="inherit">Personal information</Typography>
        </MenuItem>

        <MenuItem onClick={() => kindSelected("contactInformation")}>
          <ListItemIcon>
            <CallIcon />
          </ListItemIcon>
          <Typography variant="inherit">Contact information</Typography>
        </MenuItem>

        <MenuItem onClick={() => kindSelected("other")}>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <Typography variant="inherit">Other</Typography>
        </MenuItem>
      </Menu>
    </>
  )
}