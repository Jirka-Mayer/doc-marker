import { rankWith, toDataPath, uiTypeIs } from '@jsonforms/core'
import { JsonFormsDispatch, withJsonFormsLayoutProps } from '@jsonforms/react'
import * as multiselectStyles from "./multiselect.module.scss"
import _ from "lodash"
import { MultiselectGroupContext } from './MultiselectGroupContext'

function BodyGroupLayout(props) {
  const {
    uischema,
    schema,
    path,
    enabled,
    renderers,
    cells,
    visible,
    data
  } = props

  const elements = uischema.elements

  if (elements.length === 0)
    return null

  const leaderScope = uischema?.rule?.condition?.scope
  const leaderPath = toDataPath(leaderScope)
  const leaderValue = _.get(data, leaderPath)

  return (<>
    <MultiselectGroupContext.Provider value={{ leaderValue }}>
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
            enabled={enabled}
            renderers={renderers}
            cells={cells}
          />
        </div>
      )) }
    </MultiselectGroupContext.Provider>
  </>)
}

export const bodyGroupLayoutTester = rankWith(
  1, uiTypeIs("Group")
)

export default withJsonFormsLayoutProps(BodyGroupLayout)
