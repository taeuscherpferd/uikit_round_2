import { useFrame, useThree } from "@react-three/fiber";
import { useXRControllerState } from "@react-three/xr";
import { useEffect, useRef } from "react";
import { BufferGeometry, Group, Line, LineBasicMaterial, MathUtils, Quaternion, Vector3 } from "three";

export interface LocomotionOptions {
  handControllingMovement: 'left' | 'right'
}

const defaultSpeed = 60
const thumbstickPropName = 'xr-standard-thumbstick'
const geometry = new BufferGeometry();
const material = new LineBasicMaterial({ color: 0xff0000, linewidth: 3 }); // Red color
const line = new Line(geometry, material);
const cameraQuaternion = new Quaternion()

export const useLocomotion = (options: LocomotionOptions) => {
  const { handControllingMovement } = options;
  const positionInfo = useRef<Group>(null);
  const canRotate = useRef(true);
  const camera = useThree((s) => s.camera)
  const scene = useThree((s) => s.scene)

  const l_controller = useXRControllerState("left");
  const r_controller = useXRControllerState("right");
  const movementController = handControllingMovement === 'left' ? l_controller : r_controller;
  const viewController = handControllingMovement === 'left' ? r_controller : l_controller;

  useEffect(() => {
    scene.add(line)
    return () => {
      scene.remove(line)
    }
  });

  useFrame((_, delta) => {
    if (positionInfo.current == null || movementController == null || viewController == null) return;

    const movementThumbstickState = movementController.gamepad[thumbstickPropName];
    const movementXAxisOrDefault = movementThumbstickState?.xAxis ?? 0;
    const movementYAxisOrDefault = movementThumbstickState?.yAxis ?? 0;

    const viewThumbstickState = viewController.gamepad[thumbstickPropName];
    const viewXAxisOrDefault = viewThumbstickState?.xAxis ?? 0;

    if (movementThumbstickState == null) return

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

    const inputVector = new Vector3(movementXAxisOrDefault, 0, movementYAxisOrDefault)
    camera.getWorldQuaternion(cameraQuaternion)

    inputVector.applyQuaternion(cameraQuaternion)

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