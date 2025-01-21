import { HandleStore } from "@pmndrs/handle"
import { useFrame } from "@react-three/fiber"
import { Handle } from "@react-three/handle"
import { RigidBody } from "@react-three/rapier"
import { useRef } from "react"

interface HandleWithPhysicsAndTriggersProps {
  children?: React.ReactNode
}

export const HandleWithPhysicsAndTriggers = (props: HandleWithPhysicsAndTriggersProps) => {
  const { children } = props
  const handleRef = useRef<HandleStore<unknown>>(null)

  useFrame(() => {
    if (!handleRef.current) return
    handleRef.current.getState()?.current.position

  })

  return (
    <>
    <Handle/>
      <Handle ref={handleRef}>
        <RigidBody>
          {children}

        </RigidBody>
      </Handle>
    </>
  )
}