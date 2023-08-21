import { useEffect, useRef } from "react"
import * as styles from "./QuillBinder.module.scss"
import { quillExtended } from "../../state/reportStore"
import { useAtom } from "jotai"
import { activeFieldIdAtom, appModeAtom } from "../../state/editorStore"
import { displayDebugInfoAtom } from "../../state/userPreferencesStore"
import { useAnnotationController } from "./useAnnotationController"
import { useAnonymizationController } from "./useAnonymizationController"
import { useTranslation } from "react-i18next";
import {
  AfterClickMenu as AnonymizationAfterClickMenu
} from "./anonymization/AfterClickMenu"
import {
  AfterDragMenu as AnonymizationAfterDragMenu
} from "./anonymization/AfterDragMenu"
import {
  AfterClickMenu as AnnotationAfterClickMenu
} from "./annotation/AfterClickMenu"
import {
  AfterDragMenu as AnnotationAfterDragMenu
} from "./annotation/AfterDragMenu"
import { useTheme } from "@emotion/react"
import { alpha } from "@mui/material"

/**
 * Binds the quill instance with the DOM as a react component
 */
export function QuillBinder() {
  const { t } = useTranslation("quill")

  const theme = useTheme()

  const [appMode] = useAtom(appModeAtom)
  const [activeFieldId] = useAtom(activeFieldIdAtom)
  const [displayDebugInfo] = useAtom(displayDebugInfoAtom)
  
  const bindingContainerRef = useRef(null)
  
  // quill element attachment to DOM
  useEffect(() => {
    quillExtended.attachTo(bindingContainerRef.current)
    return () => {
      quillExtended.detach()
    }
  }, [])

  // app mode rendering
  useEffect(() => {
    quillExtended.renderAppMode(appMode)
  }, [appMode])

  // active field rendering
  useEffect(() => {
    quillExtended.renderFieldActivity(activeFieldId)
  }, [activeFieldId])

  // placeholder text according to the language
  useEffect(() => {
    quillExtended.quill.root.dataset.placeholder = t("placeholder")
  }, [t])

  // themed colors
  useEffect(() => {
    // color for the selected text
    document.body.style.setProperty(
      "--dm-report-selection-color",
      alpha(theme.palette.primary.light, 0.78)
    )

    // regular highlight
    document.body.style.setProperty(
      "--dm-regular-highlight-border",
      theme.palette.primary.main
    )
    
    // active highlight
    document.body.style.setProperty(
      "--dm-active-highlight-border",
      theme.palette.primary.main
    )
    document.body.style.setProperty(
      "--dm-active-highlight-background",
      alpha(theme.palette.primary.main, 0.15)
    )
  })

  // app mode controllers
  useAnonymizationController()
  useAnnotationController()

  // debug rendering
  // TODO: remove from here and put into the report column instead
  const debugRef = useRef(null)
  useEffect(() => {
    let text = ""
    let m = quillExtended.highlightsAllocator.idToNumber
    if (displayDebugInfo) {
      for (let k of m.keys()) {
        text += k + " => " + m.get(k) + "\n"
      }
    }
    debugRef.current.innerText = text
  }, [displayDebugInfo])
  
  return (
    <>
      {/* <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet"></link> */}
      
      <div ref={bindingContainerRef}></div>

      <AnonymizationAfterClickMenu />
      <AnonymizationAfterDragMenu />
      <AnnotationAfterClickMenu />
      <AnnotationAfterDragMenu />

      <pre ref={debugRef}></pre>
    </>
  )
}