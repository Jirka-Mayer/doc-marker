/*
  Take inspiration here:
  https://github.com/eclipsesource/jsonforms/blob/master/packages/material-renderers/src
*/

import { resqLinearLayoutTester, ResqLinearLayout } from "./resq-renderers"
import { resqGroupTester, ResqGroupLayout } from "./resq-renderers"
import { resqTextControlTester, ResqTextControl } from "./resq-renderers"
import { resqIntegerControlTester, ResqIntegerControl } from "./resq-renderers"
import { resqNumberControlTester, ResqNumberControl } from "./resq-renderers"
import { resqBooleanControlTester, ResqBooleanControl } from "./resq-renderers"
import { resqEnumControlTester, ResqEnumControl } from "./resq-renderers"
import { resqDateTimeControlTester, ResqDateTimeControl } from "./resq-renderers"
import { resqMultiselectGroupTester, ResqMultiselectGroup } from "./resq-renderers"
import { resqPostAcuteFindingsGroupTester, ResqPostAcuteFindingsGroup } from "./resq-renderers"

export const formRenderers = [
  // controls
  //{ tester: materialTextControlTester, renderer: MaterialTextControl },
  //{ tester: materialIntegerControlTester, renderer: MaterialIntegerControl },

  // resq controls
  { tester: resqTextControlTester, renderer: ResqTextControl },
  { tester: resqIntegerControlTester, renderer: ResqIntegerControl },
  { tester: resqNumberControlTester, renderer: ResqNumberControl },
  { tester: resqBooleanControlTester, renderer: ResqBooleanControl },
  { tester: resqEnumControlTester, renderer: ResqEnumControl },
  { tester: resqDateTimeControlTester, renderer: ResqDateTimeControl },
  { tester: resqMultiselectGroupTester, renderer: ResqMultiselectGroup },
  { tester: resqPostAcuteFindingsGroupTester, renderer: ResqPostAcuteFindingsGroup },

  // layouts
  { tester: resqGroupTester, renderer: ResqGroupLayout },
  { tester: resqLinearLayoutTester, renderer: ResqLinearLayout },
]

export const formCells = []
