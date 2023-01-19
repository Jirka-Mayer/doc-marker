/*
  Take inspiration here:
  https://github.com/eclipsesource/jsonforms/blob/master/packages/material-renderers/src
*/

import { materialTextControlTester, MaterialTextControl } from "@jsonforms/material-renderers"
import { materialIntegerControlTester, MaterialIntegerControl } from "@jsonforms/material-renderers"
import { materialGroupTester, MaterialGroupLayout } from "@jsonforms/material-renderers"
import { materialHorizontalLayoutTester, MaterialHorizontalLayout } from "@jsonforms/material-renderers"
import { materialVerticalLayoutTester, MaterialVerticalLayout } from "@jsonforms/material-renderers"

import { resqTextControlTester, ResqTextControl } from "./resq-renderers"
import { resqIntegerControlTester, ResqIntegerControl } from "./resq-renderers"

export const formRenderers = [
  // controls
  //{ tester: materialTextControlTester, renderer: MaterialTextControl },
  //{ tester: materialIntegerControlTester, renderer: MaterialIntegerControl },

  // resq controls
  { tester: resqTextControlTester, renderer: ResqTextControl },
  { tester: resqIntegerControlTester, renderer: ResqIntegerControl },

  // layouts
  { tester: materialGroupTester, renderer: MaterialGroupLayout },
  { tester: materialHorizontalLayoutTester, renderer: MaterialHorizontalLayout },
  { tester: materialVerticalLayoutTester, renderer: MaterialVerticalLayout },
]

export const formCells = []
