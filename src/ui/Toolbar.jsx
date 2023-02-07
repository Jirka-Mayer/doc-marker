import { Divider, IconButton } from "@mui/material"
import { useAtom } from "jotai"
import { displayDebugInfoAtom } from "../state/userPreferencesStore"
import DownloadIcon from '@mui/icons-material/Download'
import BugReportIcon from '@mui/icons-material/BugReport'
import { downloadFileAtom } from "../state/fileStore"

export function Toolbar() {
  const [displayDebugInfo, setDisplayDebugInfo] = useAtom(displayDebugInfoAtom)
  const [,downloadFile] = useAtom(downloadFileAtom)

  return (
    <>
      <IconButton
        color="default"
        sx={{ p: '10px' }}
        onClick={() => downloadFile()}
      >
        <DownloadIcon />
      </IconButton>

      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical"/>

      <IconButton
        color={displayDebugInfo ? "primary" : "default"}
        sx={{ p: '10px' }}
        onClick={() => setDisplayDebugInfo(!displayDebugInfo)}
      >
        <BugReportIcon />
      </IconButton>
    </>
  )
}