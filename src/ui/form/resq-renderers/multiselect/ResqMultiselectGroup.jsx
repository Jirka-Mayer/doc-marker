import { rankWith, toDataPath, toDataPathSegments } from '@jsonforms/core'
import { JsonFormsDispatch, withJsonFormsLayoutProps, withTranslateProps } from '@jsonforms/react'
import { isMultiselectGroup } from './isMultiselectGroup'
import * as styles from "../renderers.module.scss"
import { Divider, FormHelperText, InputLabel, Paper } from '@mui/material'
import LeaderControl, { leaderControlTester } from "./LeaderControl"
import BodyVerticalLayout, { bodyVerticalLayoutTester } from './BodyVerticalLayout'
import BodyGroupLayout, { bodyGroupLayoutTester } from './BodyGroupLayout'
import BodyCheckboxControl, { bodyCheckboxControlTester } from './BodyCheckboxControl'
import { MultiselectGroupContext } from "./MultiselectGroupContext"
import _ from "lodash"
import { useMemo } from 'react'

function leaderScopeToGroupPath(scope) {
  const segments = toDataPathSegments(scope)
  segments.pop()
  return segments.join(".")
}

function leaderScopeToLeaderKey(scope) {
  const segments = toDataPathSegments(scope)
  return segments.pop()
}

function allCheckboxesAreFalse(data, groupPath, leaderKey) {
  const groupData = _.get(data, groupPath)
  
  for (const key in groupData) {
    if (key === leaderKey)
      continue

    if (typeof groupData[key] === "object") {
      if (!allCheckboxesAreFalse(data, groupPath + "." + key, null))
        return false
    } else {
      if (groupData[key] === true)
        return false
    }
  }

  return true
}

function ResqMultiselectGroup(props) {
  const {
    enabled,
    schema,
    uischema,
    visible,
    data,
    t,
  } = props

  const leaderUischema = uischema.elements[0]
  const leaderPath = toDataPath(leaderUischema.scope) // foo.bar.medication_any
  const leaderKey = leaderScopeToLeaderKey(leaderUischema.scope) // medication_any
  const groupPath = leaderScopeToGroupPath(leaderUischema.scope) // foo.bar
  const leaderValue = _.get(data, leaderPath)

  const bodyUischema = uischema.elements[1]
  

  ///////////////
  // Rendering //
  ///////////////
  
  let errors = ""

  const atLeastOneError = useMemo(() => t(
    leaderPath + ".error.multiselect",
    "Select at least one of following",
    { schema, leaderUischema, leaderPath}
  ), [t, schema, leaderUischema, leaderPath])

  if (leaderValue === true && allCheckboxesAreFalse(data, groupPath, leaderKey)) {
    errors = atLeastOneError
  }

  return (
    <MultiselectGroupContext.Provider value={{ leaderValue }}>
      <Paper sx={{ display: visible ? "block" : "none" }}>
        <JsonFormsDispatch
          uischema={leaderUischema}
          schema={schema}
          enabled={enabled}
          renderers={[
            { tester: leaderControlTester, renderer: LeaderControl }
          ]}
          cells={[]}
        />

        { leaderValue === true ? <Divider /> : null }

        <JsonFormsDispatch
          uischema={bodyUischema}
          schema={schema}
          enabled={enabled}
          renderers={[
            { tester: bodyVerticalLayoutTester, renderer: BodyVerticalLayout },
            { tester: bodyGroupLayoutTester, renderer: BodyGroupLayout },
            { tester: bodyCheckboxControlTester, renderer: BodyCheckboxControl }
          ]}
          cells={[]}
        />
        
        {/* <pre>{ JSON.stringify(_.get(data, groupPath), null, 2) }</pre> */}

        { errors === "" ? "" : (
          <FormHelperText
            className={styles["field-error-message"]}
            error={true}
          >{errors}</FormHelperText>
        )}
      </Paper>
    </MultiselectGroupContext.Provider>
  )
}

export const resqMultiselectGroupTester = rankWith(
  10, isMultiselectGroup
)

export default withJsonFormsLayoutProps(
  withTranslateProps(ResqMultiselectGroup)
)
