/*
  Take inspiration here:
  https://github.com/eclipsesource/jsonforms/blob/master/packages/material-renderers/src
*/

import { dmLinearLayoutTester, DmLinearLayout } from "./renderers"
import { dmGroupLayoutTester, DmGroupLayout } from "./renderers"
import { dmTextControlTester, DmTextControl } from "./renderers"
import { dmIntegerControlTester, DmIntegerControl } from "./renderers"
import { dmNumberControlTester, DmNumberControl } from "./renderers"
import { dmBooleanControlTester, DmBooleanControl } from "./renderers"
import { dmEnumControlTester, DmEnumControl } from "./renderers"
import { dmDateTimeControlTester, DmDateTimeControl } from "./renderers"

export const formRenderers = [
  
  // DocMarker controls
  { tester: dmTextControlTester, renderer: DmTextControl },
  { tester: dmIntegerControlTester, renderer: DmIntegerControl },
  { tester: dmNumberControlTester, renderer: DmNumberControl },
  { tester: dmBooleanControlTester, renderer: DmBooleanControl },
  { tester: dmEnumControlTester, renderer: DmEnumControl },
  { tester: dmDateTimeControlTester, renderer: DmDateTimeControl },

  // DocMarker layouts
  { tester: dmGroupLayoutTester, renderer: DmGroupLayout },
  { tester: dmLinearLayoutTester, renderer: DmLinearLayout },

]

export const formCells = []
