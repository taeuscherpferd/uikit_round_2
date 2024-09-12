import { XROrigin } from "@react-three/xr"
import { ControllerLocomotionOptions, useControllerLocomotion } from "../hooks/useControllerLocomotion"

const locomotionOptions: ControllerLocomotionOptions = {
  movementController: "left",
  translationOptions: {
    speed: 2,
  }
}

export const LocomotionWrapper = () => {
  const positionRef = useControllerLocomotion(locomotionOptions)
  return <XROrigin ref={positionRef} position={[0, -1.25, 0]} />
}