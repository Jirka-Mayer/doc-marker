/*
  Take inspiration here:
  https://github.com/eclipsesource/jsonforms/blob/master/packages/material-renderers/src
*/

import { materialHorizontalLayoutTester, MaterialHorizontalLayout } from "@jsonforms/material-renderers"

import { resqVerticalLayoutTester, ResqVerticalLayout } from "./resq-renderers"
import { resqGroupTester, ResqGroupLayout } from "./resq-renderers"
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
  { tester: resqGroupTester, renderer: ResqGroupLayout },
  { tester: materialHorizontalLayoutTester, renderer: MaterialHorizontalLayout },
  { tester: resqVerticalLayoutTester, renderer: ResqVerticalLayout },
]

export const formCells = []
