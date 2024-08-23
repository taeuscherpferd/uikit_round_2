import { OrbitControls } from "@react-three/drei"
import { IfInSessionMode } from "@react-three/xr"

export const OrbitControlsWrapper = () => {
  return (
    <IfInSessionMode deny={['immersive-ar', 'immersive-vr']} >
        <OrbitControls />
    </IfInSessionMode>
  )
}