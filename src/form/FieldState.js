export class FieldState {
  /**
   * The field has not been touched yet
   */
  static EMPTY = "empty"

  /**
   * The field was filled out by a robot and not seen by a human yet
   */
  static ROBOT_VALUE = "robotValue"

  /**
   * The field was filled out by a robot and verified by a human
   */
  static ROBOT_VALUE_VERIFIED = "robotValueVerified"

  /**
   * Human entered (or corrected) the value in the field
   */
  static HUMAN_VALUE = "humanValue"
}