import { useFrame } from "@react-three/fiber";
import { useXRControllerState } from "@react-three/xr";
import { useRef } from "react";
import { Group, MathUtils, Quaternion, Vector3 } from "three";

export interface LocomotionOptions {
  handControllingMovement?: 'left' | 'right'
  speed?: number
  numberOfDegreesToSnapTurnBy?: number
  viewControlDeadZone?: number
  disableSnapTurning?: boolean
  disableRefMovement?: boolean
  enableSmoothTurning?: boolean
  smoothTurningSpeed?: number
  motionCallback?: (inputVector: Vector3) => void
}

const defaultSpeed = 2;
const defaultSmoothTurningSpeed = 1;
const defaultEnableSmoothTurning = false;
const defaultNumberOfDegreesToSnapTurnBy = 45;
const defaultHandControllingMovement = 'left';
const defaultViewControlDeadZone = 0.5;
const thumbstickPropName = 'xr-standard-thumbstick';
const cameraQuaternion = new Quaternion();

export const useLocomotion = (options: LocomotionOptions) => {
  const { handControllingMovement = defaultHandControllingMovement, speed = defaultSpeed, numberOfDegreesToSnapTurnBy = defaultNumberOfDegreesToSnapTurnBy,
    viewControlDeadZone = defaultViewControlDeadZone, smoothTurningSpeed = defaultSmoothTurningSpeed, enableSmoothTurning = defaultEnableSmoothTurning,
    disableSnapTurning, disableRefMovement, motionCallback } = options;

  const positionRef = useRef<Group>(null);
  const canRotate = useRef(true);

  const l_controller = useXRControllerState("left");
  const r_controller = useXRControllerState("right");
  const movementController = handControllingMovement === 'left' ? l_controller : r_controller;
  const viewController = handControllingMovement === 'left' ? r_controller : l_controller;

  useFrame((state, delta) => {
    if (positionRef.current == null || movementController == null || viewController == null) return;

    const movementThumbstickState = movementController.gamepad[thumbstickPropName];

    const movementXAxisOrDefault = movementThumbstickState?.xAxis ?? 0;
    const movementYAxisOrDefault = movementThumbstickState?.yAxis ?? 0;

    const viewThumbstickState = viewController.gamepad[thumbstickPropName];
    const viewXAxisOrDefault = viewThumbstickState?.xAxis ?? 0;

    // If no joystick input, return
    if (movementXAxisOrDefault === 0 && movementYAxisOrDefault === 0 && viewXAxisOrDefault === 0) return

    // Handle snapping rotation using the viewController
    let rotationQuaternion = null;
    if (!disableSnapTurning && !enableSmoothTurning) {
      if (viewXAxisOrDefault < -viewControlDeadZone && canRotate.current) {
        canRotate.current = false;
        rotationQuaternion = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), MathUtils.degToRad(numberOfDegreesToSnapTurnBy));
        positionRef.current.quaternion.multiply(rotationQuaternion);
      }
      else if (viewXAxisOrDefault > viewControlDeadZone && canRotate.current) {
        canRotate.current = false;
        rotationQuaternion = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), -MathUtils.degToRad(numberOfDegreesToSnapTurnBy));
        positionRef.current.quaternion.multiply(rotationQuaternion);
      }
      else if (viewXAxisOrDefault > -viewControlDeadZone && viewXAxisOrDefault < viewControlDeadZone) {
        canRotate.current = true;
      }
    }
    else if (enableSmoothTurning) {
      if (Math.abs(viewXAxisOrDefault) > viewControlDeadZone) {
        positionRef.current.rotateY((viewXAxisOrDefault < 0 ? 1 : -1) * delta * smoothTurningSpeed);
      }
    }

    // Handle movement using the movementController
    const inputVector = new Vector3(movementXAxisOrDefault, 0, movementYAxisOrDefault)
    state.camera.getWorldQuaternion(cameraQuaternion);
    inputVector.applyQuaternion(cameraQuaternion);

    if (rotationQuaternion) {
      inputVector.applyQuaternion(rotationQuaternion);
    }

    motionCallback && motionCallback(inputVector);

    if (disableRefMovement) return;

    let xChange = positionRef.current.position.x;
    let zChange = positionRef.current.position.z;

    if (inputVector.x !== 0) {
      xChange += (inputVector.x) * delta * speed;
    }

    if (inputVector.z !== 0) {
      zChange += (inputVector.z) * delta * speed;
    }

    if (xChange !== positionRef.current.position.x || zChange !== positionRef.current.position.z) {
      positionRef.current.position.x = xChange;
      positionRef.current.position.z = zChange;
    }
  })

  return positionRef;
}