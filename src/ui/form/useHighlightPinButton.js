import { IconButton, Tooltip } from "@mui/material"
import * as reportStore from "../../state/reportStore"
import { useFieldHighlights } from "./useFieldHighlights"
import LocationOnIcon from '@mui/icons-material/LocationOn'
import * as styles from "./FormColumn.module.scss"
import { useMemo } from "react"

export function useHighlightPinButton(props) {
  const {
    fieldId,
    t, schema, uischema, path
  } = props

  const {
    highlightsRanges,
    hasHighlights
  } = useFieldHighlights(fieldId)

  function onHighlightPinClick() {
    reportStore.quillExtended.scrollHighlightIntoView(fieldId)
  }

  function HighlightPinButton() {
    if (!hasHighlights)
      return null
    
    const tooltipLabel = useMemo(() => t(
      "highlightPin.tooltip",
      "Show link",
      { schema, uischema, path}
    ), [t, schema, uischema, path])
    
    return (
      <Tooltip
        title={tooltipLabel}
        disableInteractive
      >
        <IconButton
          className={styles["highlight-pin"]}
          onClick={onHighlightPinClick}
          sx={{ p: '10px' }}
          tabIndex={-1}
        >
          <LocationOnIcon />
          { (highlightsRanges.length >= 2) &&
            <span className={styles["highlight-pin__number-badge"]}>
              { highlightsRanges.length }
            </span>
          }
        </IconButton>
      </Tooltip>
    )
  }
  
  return {
    highlightsRanges,
    hasHighlights,
    HighlightPinButton
  }
}