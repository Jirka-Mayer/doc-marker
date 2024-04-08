import _ from "lodash"

import { stateApi } from "./stateApi"
import { formApi } from "./formApi"

import * as _stateApi from "./state"
import * as _formApi from "./ui/form"

// can't just set it, we need to keep the original object reference
_.merge(stateApi, _stateApi)
_.merge(formApi, _formApi)
