import { XROrigin } from "@react-three/xr"
import { LocomotionOptions, useLocomotion } from "../hooks/useLocomotion"

const locomotionOptions: LocomotionOptions = {
  handControllingMovement: "left",
  speed: 2,
}
export const LocomotionWrapper = () => {
  const positionRef = useLocomotion(locomotionOptions)
  return <XROrigin ref={positionRef} position={[0, -1.25, 0]} />
}