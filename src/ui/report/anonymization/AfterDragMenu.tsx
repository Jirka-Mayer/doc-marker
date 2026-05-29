import {
  Menu,
  MenuList,
  MenuItem,
  ListItemIcon,
  Typography,
  Divider,
} from "@mui/material";
import { useAtomValue } from "jotai";
import PersonIcon from "@mui/icons-material/Person";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CallIcon from "@mui/icons-material/Call";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import StarIcon from "@mui/icons-material/Star";
import { useContext } from "react";
import { DocMarkerContext } from "../../DocMarkerContext";
import { ContextMenuController } from "../ContextMenuController";

export function AfterDragMenu(props: { cmc: ContextMenuController }) {
  const { cmc } = props;
  const { quillExtended } = useContext(DocMarkerContext);

  const anchorTextRange = useAtomValue(cmc.anchorTextRangeAtom);
  const anchorPosition = useAtomValue(cmc.anchorPositionAtom);

  function kindSelected(kindId) {
    if (anchorTextRange !== null) {
      quillExtended.anonymizeText(
        anchorTextRange.index,
        anchorTextRange.length,
        kindId,
      );
    }

    cmc.closeMenu();
  }

  return (
    <>
      <Menu
        id="anonymization-after-drag-context-menu"
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition || undefined}
        open={anchorPosition !== null}
        onClose={() => cmc.closeMenu()}
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
  );
}
