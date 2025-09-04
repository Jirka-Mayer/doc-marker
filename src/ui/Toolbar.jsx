import { Divider, IconButton, Tooltip, ToggleButton, ToggleButtonGroup, Select, MenuItem } from "@mui/material"
import { useAtomValue } from "jotai"
import { useTranslation } from "react-i18next"
import { reportStore } from "../state"
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import { useContext } from "react";
import { DocMarkerContext } from "./DocMarkerContext";

export function Toolbar() {
  const { t } = useTranslation("toolbar")

  const { historyStore } = useContext(DocMarkerContext)

  const canUndo = useAtomValue(historyStore.canUndoAtom)
  const canRedo = useAtomValue(historyStore.canRedoAtom)

  const selectionFormats = useAtomValue(reportStore.selectionFormatsAtom)

  function toggleSelectionFormat(name, value = true) {
    if (selectionFormats[name] !== value)
      reportStore.quillExtended.format(name, value)
    else
      reportStore.quillExtended.format(name, false)
  }

  return (
    <>
      <Tooltip title={t("undo") + " (Ctrl + Z)"} disableInteractive>
        <span>
          <IconButton
            color="default"
            sx={{ p: '10px' }}
            disabled={!canUndo}
            onClick={() => historyStore.performUndo()}
          >
            <UndoIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title={t("redo") + " (Ctrl + Y)"} disableInteractive>
        <span>
          <IconButton
            color="default"
            sx={{ p: '10px' }}
            disabled={!canRedo}
            onClick={() => historyStore.performRedo()}
          >
            <RedoIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical"/>

      <div style={{minWidth: "150px", padding: "0 16px"}}>
        <Select
          value={selectionFormats["header"] || "false"}
          onChange={e => toggleSelectionFormat("header", JSON.parse(e.target.value))}
          fullWidth={true}
          variant="standard"
        >
          <MenuItem
            value={"false"}
            key={"false"}
          >{t("normalText")}</MenuItem>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <MenuItem
              value={"" + i}
              key={"" + i}
            >
              {t("header") + " " + i}
            </MenuItem>
          ))}
        </Select>
      </div>

      <ToggleButtonGroup size="small">
        <Tooltip title={t("bold") + " (Ctrl + B)"} disableInteractive>
          <ToggleButton
            value="bold"
            selected={selectionFormats["bold"]}
            onClick={() => toggleSelectionFormat("bold")}
          >
            <FormatBoldIcon />
          </ToggleButton>
        </Tooltip>
        <Tooltip title={t("italic") + " (Ctrl + I)"} disableInteractive>
          <ToggleButton
            value="italic"
            selected={selectionFormats["italic"]}
            onClick={() => toggleSelectionFormat("italic")}
          >
            <FormatItalicIcon />
          </ToggleButton>
        </Tooltip>
        <Tooltip title={t("underline") + " (Ctrl + U)"} disableInteractive>
          <ToggleButton
            value="underline"
            selected={selectionFormats["underline"]}
            onClick={() => toggleSelectionFormat("underline")}
          >
            <FormatUnderlinedIcon />
          </ToggleButton>
        </Tooltip>
        <Tooltip title={t("strikethrough")} disableInteractive>
          <ToggleButton
            value="strike"
            selected={selectionFormats["strike"]}
            onClick={() => toggleSelectionFormat("strike")}
          >
            <FormatStrikethroughIcon />
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>

      <Tooltip title={t("clearFormat")} disableInteractive>
        <span>
          <IconButton
            color="default"
            sx={{ p: '10px' }}
            onClick={() => reportStore.quillExtended.removeFormat()}
          >
            <FormatClearIcon />
          </IconButton>
        </span>
      </Tooltip>

    </>
  )
}