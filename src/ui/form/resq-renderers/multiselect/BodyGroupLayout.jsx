import React from "react"
import { rankWith, toDataPath, uiTypeIs } from '@jsonforms/core'
import { JsonFormsDispatch, withJsonFormsLayoutProps } from '@jsonforms/react'
import * as multiselectStyles from "./multiselect.module.scss"
import _ from "lodash"
import { MultiselectGroupContext } from './MultiselectGroupContext'
import { useGetExportedValue } from '../../../../state/form/formDataStore'

function BodyGroupLayout(props) {
  const {
    uischema,
    schema,
    path,
    renderers,
    cells,
    data
  } = props

  const elements = uischema.elements

  if (elements.length === 0)
    return null

  const leaderScope = uischema?.rule?.condition?.scope
  const leaderPath = toDataPath(leaderScope)
  const leaderValue = useGetExportedValue(leaderPath)


  // === visible ===

  let visible = false

  if (leaderValue === true) {
    visible = true
  }


  // === rendering ===

  return (
    <MultiselectGroupContext.Provider value={{
      leaderValue: leaderValue,
      leaderPath: leaderPath,
      inSubGroup: true
    }}>
      { elements.map((child, index) => (
        <div
          key={`${path}-${index}`}
          style={{ display: visible ? "block" : "none" }}
          className={multiselectStyles["group-item"]}
        >
          <JsonFormsDispatch
            uischema={child}
            schema={schema}
            path={path}
            enabled={true} // checkboxes handle that on their own
            renderers={renderers}
            cells={cells}
          />
        </div>
      )) }
    </MultiselectGroupContext.Provider>
  )
}

export const bodyGroupLayoutTester = rankWith(
  1, uiTypeIs("Group")
)

export default withJsonFormsLayoutProps(
  React.memo(BodyGroupLayout)
)
