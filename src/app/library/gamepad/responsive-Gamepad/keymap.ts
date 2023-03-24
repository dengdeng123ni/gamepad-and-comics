// Keymaps should all be using: KeyboardEvent.code
// As it represents physical location relative to a US QWERTY Layout.
// And not the value of the key pressed.
// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code

// For KeyCodes Table, see: https://www.w3.org/TR/uievents-code/#code-value-tables
// KeyCode Tester: http://keycode.info/

import {RESPONSIVE_GAMEPAD_INPUTS} from './constants';

export default function setDefaultKeymap(ResponsiveGamepad) {
  // Up
  ResponsiveGamepad.Gamepad.setGamepadButtonsToResponsiveGamepadInput(
    [12],
    RESPONSIVE_GAMEPAD_INPUTS.DPAD_UP
  );
  ResponsiveGamepad.Gamepad.setGamepadButtonsToResponsiveGamepadInput(
    [13],
    RESPONSIVE_GAMEPAD_INPUTS.DPAD_DOWN
  );
  ResponsiveGamepad.Gamepad.setGamepadButtonsToResponsiveGamepadInput(
    [14],
    RESPONSIVE_GAMEPAD_INPUTS.DPAD_LEFT
  );
  ResponsiveGamepad.Gamepad.setGamepadButtonsToResponsiveGamepadInput(
    [15],
    RESPONSIVE_GAMEPAD_INPUTS.DPAD_RIGHT
  );

  // Left Analog Axis
  ResponsiveGamepad.Gamepad.setGamepadAxisToResponsiveGamepadInput(
    [0],
    RESPONSIVE_GAMEPAD_INPUTS.LEFT_ANALOG_HORIZONTAL_AXIS
  );
  ResponsiveGamepad.Gamepad.setGamepadAxisToResponsiveGamepadInput(
    [1],
    RESPONSIVE_GAMEPAD_INPUTS.LEFT_ANALOG_VERTICAL_AXIS
  );

  // Right Analog Axis
  ResponsiveGamepad.Gamepad.setGamepadAxisToResponsiveGamepadInput(
    [2],
    RESPONSIVE_GAMEPAD_INPUTS.RIGHT_ANALOG_HORIZONTAL_AXIS
  );
  ResponsiveGamepad.Gamepad.setGamepadAxisToResponsiveGamepadInput(
    [3],
    RESPONSIVE_GAMEPAD_INPUTS.RIGHT_ANALOG_VERTICAL_AXIS
  );

  // Left Analog Press
  ResponsiveGamepad.Gamepad.setGamepadButtonsToResponsiveGamepadInput(
    [10],
    RESPONSIVE_GAMEPAD_INPUTS.LEFT_ANALOG_PRESS
  );

  // Right Analog Press
  ResponsiveGamepad.Gamepad.setGamepadButtonsToResponsiveGamepadInput(
    [11],
    RESPONSIVE_GAMEPAD_INPUTS.RIGHT_ANALOG_PRESS
  );

  // A
  ResponsiveGamepad.Gamepad.setGamepadButtonsToResponsiveGamepadInput(
    [0],
    RESPONSIVE_GAMEPAD_INPUTS.A
  );

  ResponsiveGamepad.Gamepad.setGamepadButtonsToResponsiveGamepadInput(
    [1],
    RESPONSIVE_GAMEPAD_INPUTS.B
  );

  ResponsiveGamepad.Gamepad.setGamepadButtonsToResponsiveGamepadInput(
    [2],
    RESPONSIVE_GAMEPAD_INPUTS.X
  );

  // Y

  ResponsiveGamepad.Gamepad.setGamepadButtonsToResponsiveGamepadInput(
    [3],
    RESPONSIVE_GAMEPAD_INPUTS.Y
  );

  // Left Trigger
  ResponsiveGamepad.Gamepad.setGamepadButtonsToResponsiveGamepadInput(
    [6],
    RESPONSIVE_GAMEPAD_INPUTS.LEFT_TRIGGER
  );

  // Left Bumper
  ResponsiveGamepad.Gamepad.setGamepadButtonsToResponsiveGamepadInput(
    [4],
    RESPONSIVE_GAMEPAD_INPUTS.LEFT_BUMPER
  );

  // Right Trigger
  ResponsiveGamepad.Gamepad.setGamepadButtonsToResponsiveGamepadInput(
    [7],
    RESPONSIVE_GAMEPAD_INPUTS.RIGHT_TRIGGER
  );

  // Right Bumper
  ResponsiveGamepad.Gamepad.setGamepadButtonsToResponsiveGamepadInput(
    [5],
    RESPONSIVE_GAMEPAD_INPUTS.RIGHT_BUMPER
  );

  // Start
  ResponsiveGamepad.Gamepad.setGamepadButtonsToResponsiveGamepadInput(
    [9],
    RESPONSIVE_GAMEPAD_INPUTS.START
  );

  // Select
  ResponsiveGamepad.Gamepad.setGamepadButtonsToResponsiveGamepadInput(
    [8],
    RESPONSIVE_GAMEPAD_INPUTS.SELECT
  );

  // Special
  ResponsiveGamepad.Gamepad.setGamepadButtonsToResponsiveGamepadInput(
    [16],
    RESPONSIVE_GAMEPAD_INPUTS.SPECIAL
  );
}

