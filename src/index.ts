/*
  This file contains the public API of the whole DocMarker "library".
*/

import "./parcel.d";

////////////////////////////
// Options & Boostrapping //
////////////////////////////

import * as options from "./options";
import { bootstrapDocMarker as _bootstrapDocMarker } from "./bootstrapDocMarker";

/**
 * Default options for DocMarker
 */
export const defaultOptions = options.defaultOptions;

/**
 * Currently used options
 * (available after the boostrap function has been called)
 */
export const currentOptions = options.currentOptions;

/**
 * Bootstrap function that creates the DocMarker application
 */
export const bootstrapDocMarker = _bootstrapDocMarker;

//////////////////////////////////
// Application State Management //
//////////////////////////////////

import { stateApi as _stateApi } from "./stateApi.js";

/**
 * State API namespace containing stores, types and utils
 */
export let stateApi = _stateApi;

///////////////////
// Form UI Utils //
///////////////////

import { formApi as _formApi } from "./formApi.js";

/**
 * API containing form utils for building custom form controls
 */
export const formApi = _formApi;
