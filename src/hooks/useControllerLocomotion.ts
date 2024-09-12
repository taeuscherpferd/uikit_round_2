import { useFrame } from "@react-three/fiber"
import { useXRInputSourceState } from "@react-three/xr"
import { useRef } from "react"
import { Group, MathUtils, Quaternion, Vector3 } from "three"

export interface ControllerLocomotionOptions {
  movementController?: XRHandedness
  translationOptions?: {
    speed?: number
    disableRefTranslation?: boolean
    motionCallback?: (inputVector: Vector3) => void
  }
  rotationOptions?: {
    numberOfDegreesToSnapBy?: number
    viewControlDeadZone?: number
    disableSnapTurning?: boolean
    enableSmoothTurning?: boolean
    smoothTurningSpeed?: number
  }
}

/**
 * A hook for handling basic locomotion in VR
 * @param options Options that can be provided to customize the locomotion behavior
 * @returns A ref to be assigned to the <XROrigin> component (i.e. <XROrigin ref={locomotionRef}>)
 */
export function useControllerLocomotion(options?: ControllerLocomotionOptions) {
  const defaultSpeed = 2
  const defaultSmoothTurningSpeed = 2
  const defaultEnableSmoothTurning = false
  const defaultDisableSnapTurning = false
  const defaultDisableRefTranslation = false
  const defaultMotionCallback = undefined
  const defaultNumberOfDegreesToSnapTurnBy = 45
  const defaultHandControllingMovement = 'left'
  const defaultViewControlDeadZone = 0.5
  const thumbstickPropName = 'xr-standard-thumbstick'
  const cameraQuaternion = new Quaternion()

  // Assign default values to options that are not provided
  const {
    movementController = defaultHandControllingMovement,
    translationOptions: {
      speed = defaultSpeed,
      disableRefTranslation = defaultDisableRefTranslation,
      motionCallback = defaultMotionCallback,
    } = {},
    rotationOptions: {
      numberOfDegreesToSnapBy = defaultNumberOfDegreesToSnapTurnBy,
      viewControlDeadZone = defaultViewControlDeadZone,
      disableSnapTurning = defaultDisableSnapTurning,
      enableSmoothTurning = defaultEnableSmoothTurning,
      smoothTurningSpeed = defaultSmoothTurningSpeed,
    } = {},
  } = options || {}

  const positionInfo = useRef<Group>(null)
  const canRotate = useRef(true)

  const l_controller = useXRInputSourceState("controller", "left");
  const r_controller = useXRInputSourceState("controller", "right");

  const resolvedMovementController = movementController === 'left' ? l_controller : r_controller
  const viewController = movementController === 'left' ? r_controller : l_controller

  const upVector = new Vector3(0, 1, 0)
  const inputVector = new Vector3()
  const rotationQuaternion: Quaternion = new Quaternion();
  useFrame((state, delta) => {
    if (movementController === 'none') return
    if (positionInfo.current == null || resolvedMovementController == null || viewController == null) return

    const movementThumbstickState = resolvedMovementController.gamepad[thumbstickPropName]

    const movementXAxisOrDefault = movementThumbstickState?.xAxis ?? 0
    const movementYAxisOrDefault = movementThumbstickState?.yAxis ?? 0

    const viewThumbstickState = viewController.gamepad[thumbstickPropName]
    const viewXAxisOrDefault = viewThumbstickState?.xAxis ?? 0

    // If no joystick input, return
    if (movementXAxisOrDefault === 0 && movementYAxisOrDefault === 0 && viewXAxisOrDefault === 0) return

    // Handle snapping rotation using the viewController
    let rotationQuaternionUpdated = null
    if (!disableSnapTurning && !enableSmoothTurning) {
      if (viewXAxisOrDefault < -viewControlDeadZone && canRotate.current) {
        canRotate.current = false
        rotationQuaternion.identity().setFromAxisAngle(upVector, MathUtils.degToRad(numberOfDegreesToSnapBy))
        positionInfo.current.quaternion.multiply(rotationQuaternion)
        rotationQuaternionUpdated = true
      } else if (viewXAxisOrDefault > viewControlDeadZone && canRotate.current) {
        canRotate.current = false
        rotationQuaternion.identity().setFromAxisAngle(upVector, -MathUtils.degToRad(numberOfDegreesToSnapBy))
        positionInfo.current.quaternion.multiply(rotationQuaternion)
        rotationQuaternionUpdated = true
      } else if (viewXAxisOrDefault > -viewControlDeadZone && viewXAxisOrDefault < viewControlDeadZone) {
        canRotate.current = true
      }
    } else if (enableSmoothTurning) {
      if (Math.abs(viewXAxisOrDefault) > viewControlDeadZone) {
        positionInfo.current.rotateY((viewXAxisOrDefault < 0 ? 1 : -1) * delta * smoothTurningSpeed)
      }
    }

    // Handle movement using the movementController
    inputVector.set(movementXAxisOrDefault * speed, 0, movementYAxisOrDefault * speed)
    state.camera.getWorldQuaternion(cameraQuaternion)
    inputVector.applyQuaternion(cameraQuaternion)

    if (rotationQuaternionUpdated) {
      inputVector.applyQuaternion(rotationQuaternion)
    }

    motionCallback && motionCallback(inputVector)
    if (disableRefTranslation) return

    let xChange = positionInfo.current.position.x
    let zChange = positionInfo.current.position.z

    if (inputVector.x !== 0) {
      xChange += inputVector.x * delta
    }

    if (inputVector.z !== 0) {
      zChange += inputVector.z * delta
    }

    if (xChange !== positionInfo.current.position.x || zChange !== positionInfo.current.position.z) {
      positionInfo.current.position.x = xChange
      positionInfo.current.position.z = zChange
    }
  })

  return positionInfo
}