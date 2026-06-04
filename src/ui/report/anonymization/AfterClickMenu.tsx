import {
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  ListSubheader,
} from "@mui/material";
import { useAtomValue } from "jotai";
import WrongLocationIcon from "@mui/icons-material/WrongLocation";
import PasswordIcon from "@mui/icons-material/Password";
import { ContextMenuController } from "../ContextMenuController";
import { useContext } from "react";
import { DocMarkerContext } from "../../DocMarkerContext";

export function AfterClickMenu(props: { cmc: ContextMenuController }) {
  const { cmc } = props;
  const { quillExtended } = useContext(DocMarkerContext);

  const anchorTextRange = useAtomValue(cmc.anchorTextRangeAtom);
  const anchorPosition = useAtomValue(cmc.anchorPositionAtom);

  const kindId = anchorTextRange
    ? quillExtended.getAnonymization(
        anchorTextRange.index,
        anchorTextRange.length,
      )
    : null;

  function removeAnonymizationMarking() {
    if (anchorTextRange !== null) {
      quillExtended.anonymizeText(
        anchorTextRange.index,
        anchorTextRange.length,
        "",
      );
    }

    cmc.closeMenu();
  }

  function forgetText() {
    if (anchorTextRange !== null) {
      quillExtended.forgetTextAt(anchorTextRange);
    }

    cmc.closeMenu();
  }

  return (
    <>
      <Menu
        id="anonymization-after-click-context-menu"
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition || undefined}
        open={anchorPosition !== null}
        onClose={() => cmc.closeMenu()}
        MenuListProps={{
          subheader: <ListSubheader>{kindId}</ListSubheader>,
        }}
      >
        <MenuItem onClick={removeAnonymizationMarking}>
          <ListItemIcon>
            <WrongLocationIcon />
          </ListItemIcon>
          <Typography variant="inherit">
            Remove anonymization marking
          </Typography>
        </MenuItem>

        <MenuItem onClick={forgetText}>
          <ListItemIcon>
            <PasswordIcon />
          </ListItemIcon>
          <Typography variant="inherit">Forget text now</Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
