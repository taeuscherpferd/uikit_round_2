import { useFrame, useThree } from "@react-three/fiber";
import { useXRControllerState } from "@react-three/xr";
import { useRef } from "react";
import { Group, MathUtils, Quaternion, Vector3 } from "three";

export interface LocomotionOptions {
  handControllingMovement?: 'left' | 'right'
  speed?: number
  numberOfDegreesToSnapTurnBy?: number
  snapTurningDeadZone?: number
  disableSnapTurning?: boolean
}

const defaultSpeed = 1;
const defaultNumberOfDegreesToSnapTurnBy = 45;
const defaultHandControllingMovement = 'left';
const defaultSnapTurningDeadZone = 0.5;
const thumbstickPropName = 'xr-standard-thumbstick';
const cameraQuaternion = new Quaternion();

export const useLocomotion = (options: LocomotionOptions) => {
  const { handControllingMovement = defaultHandControllingMovement, speed = defaultSpeed, numberOfDegreesToSnapTurnBy = defaultNumberOfDegreesToSnapTurnBy,
    snapTurningDeadZone = defaultSnapTurningDeadZone, disableSnapTurning } = options;

  const positionInfo = useRef<Group>(null);
  const canRotate = useRef(true);
  const camera = useThree((s) => s.camera);

  const l_controller = useXRControllerState("left");
  const r_controller = useXRControllerState("right");
  const movementController = handControllingMovement === 'left' ? l_controller : r_controller;
  const viewController = handControllingMovement === 'left' ? r_controller : l_controller;

  useFrame((_, delta) => {
    if (positionInfo.current == null || movementController == null || viewController == null) return;

    const movementThumbstickState = movementController.gamepad[thumbstickPropName];

    const movementXAxisOrDefault = movementThumbstickState?.xAxis ?? 0;
    const movementYAxisOrDefault = movementThumbstickState?.yAxis ?? 0;

    const viewThumbstickState = viewController.gamepad[thumbstickPropName];
    const viewXAxisOrDefault = viewThumbstickState?.xAxis ?? 0;

    // If no joystick input, return
    if (movementXAxisOrDefault === 0 && movementYAxisOrDefault === 0 && viewXAxisOrDefault === 0) return

    // Handle snapping rotation using the viewController
    let rotationQuaternion = null;
    if (!disableSnapTurning) {
      if (viewXAxisOrDefault < -snapTurningDeadZone && canRotate.current) {
        canRotate.current = false;
        rotationQuaternion = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), MathUtils.degToRad(numberOfDegreesToSnapTurnBy));
        positionInfo.current.quaternion.multiply(rotationQuaternion);
      }
      else if (viewXAxisOrDefault > snapTurningDeadZone && canRotate.current) {
        canRotate.current = false;
        rotationQuaternion = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), -MathUtils.degToRad(numberOfDegreesToSnapTurnBy));
        positionInfo.current.quaternion.multiply(rotationQuaternion);
      }
      else if (viewXAxisOrDefault > -snapTurningDeadZone && viewXAxisOrDefault < snapTurningDeadZone) {
        canRotate.current = true;
      }
    }

    // Handle movement using the movementController
    const inputVector = new Vector3(movementXAxisOrDefault, 0, movementYAxisOrDefault)
    camera.getWorldQuaternion(cameraQuaternion);
    inputVector.applyQuaternion(cameraQuaternion);

    if (rotationQuaternion) {
      inputVector.applyQuaternion(rotationQuaternion);
    }

    let xChange = positionInfo.current.position.x;
    let zChange = positionInfo.current.position.z;

    if (inputVector.x !== 0) {
      xChange += (inputVector.x) * delta * speed;
    }

    if (inputVector.z !== 0) {
      zChange += (inputVector.z) * delta * speed;
    }

    if (xChange !== positionInfo.current.position.x || zChange !== positionInfo.current.position.z) {
      positionInfo.current.position.x = xChange;
      positionInfo.current.position.z = zChange;
    }
  })

  return positionInfo;
}