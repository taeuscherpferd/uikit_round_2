import { useFrame, useThree } from "@react-three/fiber";
import { useXRControllerState } from "@react-three/xr";
import { useRef } from "react";
import { Group, MathUtils, Quaternion, Vector3 } from "three";

export interface LocomotionOptions {
  handControllingMovement: 'left' | 'right'
}

const thumbstickPropName = 'xr-standard-thumbstick'
const defaultSpeed = 60

export const useLocomotion = (options: LocomotionOptions) => {
  const { handControllingMovement } = options;
  const positionInfo = useRef<Group>(null);
  const canRotate = useRef(true);
  const camera = useThree().gl.xr.getCamera();

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

    if (movementThumbstickState == null) return
    // positionInfo.current.position.x += movementThumbstickState.xAxis ?? 0 * delta
    // positionInfo.current.position.z += movementThumbstickState.yAxis ?? 0 * delta

    // Handle snapping rotation using the viewController
    let rotationQuaternion = null
    if (viewXAxisOrDefault < -0.5 && canRotate.current) {
      canRotate.current = false
      rotationQuaternion = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), MathUtils.degToRad(45));
      positionInfo.current.quaternion.multiply(rotationQuaternion);
    }
    else if (viewXAxisOrDefault > 0.5 && canRotate.current) {
      canRotate.current = false
      rotationQuaternion = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), -MathUtils.degToRad(45));
      positionInfo.current.quaternion.multiply(rotationQuaternion);
    }
    else if (viewXAxisOrDefault > -0.5 && viewXAxisOrDefault < 0.5) {
      canRotate.current = true
    }

    // Handle the movement
    const inputVector = new Vector3(movementXAxisOrDefault, 0, movementYAxisOrDefault)

    const cameraQuaternion = camera.quaternion.clone()
    const positionQuaternion = positionInfo.current.quaternion.clone()

    inputVector.applyQuaternion(cameraQuaternion)
    inputVector.applyQuaternion(positionQuaternion)

    if (rotationQuaternion) {
      inputVector.applyQuaternion(rotationQuaternion)
    }

    let xChange = positionInfo.current.position.x
    let zChange = positionInfo.current.position.z

    if (inputVector.x !== 0) {
      xChange += (inputVector.x) * delta;
    }

    if (inputVector.z !== 0) {
      zChange += (inputVector.z) * delta
    }

    if (xChange !== positionInfo.current.position.x || zChange !== positionInfo.current.position.z) {
      positionInfo.current.position.x = xChange
      positionInfo.current.position.z = zChange
    }
  })

  return positionInfo;
}