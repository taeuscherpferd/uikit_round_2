import { Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { RapierRigidBody } from '@react-three/rapier';
import { useXRControllerState } from '@react-three/xr';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BufferGeometry, Material, MathUtils, Mesh, Quaternion, Vector3 } from 'three';
import { useOculusGamePad } from '../useOculusGamePad';

interface PlayerProps {
  position?: Vector3
}

type GrossThreeFiberObject = Mesh<BufferGeometry, Material | Material[]>

export const Player: React.FC<PlayerProps> = (props) => {
  const { position } = props

  const { gl, scene } = useThree()
  const player = gl.xr.getCamera()
  const isPresenting = gl.xr.isPresenting
  const capsuleRef = useRef<GrossThreeFiberObject>(null);
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const [controllerText, setControllerText] = useState("NoSticks")

  const r_Gamepad = useXRControllerState("right")
  const l_Gamepad = useXRControllerState("left")
  const inputSources = [r_Gamepad, l_Gamepad]

  const canRotate = useRef(true)

  const jump = useCallback(() => {
    rigidBodyRef.current?.applyImpulse(new Vector3(0, 0.2, 0), true)
  }, [])

  useOculusGamePad({
    i_OnADown: () => {
      jump()
    }
  })

  // Computer Emulator controller
  useEffect(() => {
    // call jump when space is pressed
    //subscribe to keydown event
    const onSpace = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        console.log("Space")
        jump()
      }
    }

    window.addEventListener("keydown", onSpace)

    return () => {
      window.removeEventListener("keydown", onSpace)
    }
  })

  useEffect(() => {
    if (isPresenting && player && position) {

      player.position.set(0, .4, 2)
      if (capsuleRef.current) {
        player.add(capsuleRef.current)
      }
    }
  }, [isPresenting, player, position, scene])


  let leftJoyStick: readonly number[]
  let rightJoyStick: readonly number[]
  let logText = "NoControl"


  if (r_Gamepad) {
    rightJoyStick = r_Gamepad.inputSource.gamepad?.axes ?? []
    logText = rightJoyStick.toString()
  }

  if (l_Gamepad) {
    leftJoyStick = l_Gamepad.inputSource.gamepad?.axes ?? []
  }

  // Move the player by updating the capsule position
  useFrame(() => {
    if (!leftJoyStick) return

    const session = gl.xr.getSession()
    if (session) {
      setControllerText("")

      for (let i = 0; i < inputSources.length; i++) {
        const source = inputSources[i]?.inputSource
        if (!source) continue
        const data = {
          handedness: i === 0 ? "right" : "left",
          buttons: source.gamepad?.buttons.map((b) => b.value) ?? [],
          axes: source.gamepad?.axes.slice(0),
        }

        setControllerText((x) => {
          return x += `Handedness: ${source.handedness}\nButtons: ${data.buttons.join(", ")}\nAxes: ${data.axes?.join(", ")}\n`
        })
      }
    }

    let rotationQuaternion = null
    // Check if the right joystick was tapped to the left or right
    if (rightJoyStick[2] < -0.5 && canRotate.current) {
      // Tapped to the left, rotate player to the left
      canRotate.current = false
      rotationQuaternion = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), MathUtils.degToRad(45));
      player.quaternion.multiply(rotationQuaternion);
    } else if (rightJoyStick[2] > 0.5 && canRotate.current) {
      // Tapped to the right, rotate player to the right
      canRotate.current = false
      rotationQuaternion = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), -MathUtils.degToRad(45));
      player.quaternion.multiply(rotationQuaternion);
    }
    else if (rightJoyStick[2] > -0.5 && rightJoyStick[2] < 0.5) {
      canRotate.current = true
    }

    // Locomotion
    if (!player) return
    const inputVector = new Vector3(leftJoyStick[2], 0, leftJoyStick[3])
    const cameraQuaternion = gl.xr.getCamera().quaternion.clone()
    const playerQuaternion = player.quaternion.clone()
    inputVector.applyQuaternion(cameraQuaternion)
    inputVector.applyQuaternion(playerQuaternion)

    if (rotationQuaternion) {
      inputVector.applyQuaternion(rotationQuaternion)
    }

    let xChange = player.position.x
    let zChange = player.position.z

    if (inputVector.x !== 0) {
      xChange += inputVector.x / 60;
    }

    if (inputVector.z !== 0) {
      zChange += inputVector.z / 60
    }

    if (xChange !== player.position.x || zChange !== player.position.z) {
      player.position.x = xChange
      player.position.z = zChange
    }
  })

  return (
    <>
      <Text scale={.1} position={[0, 1.7, -0.4]}>
        {controllerText}
      </Text>
      <Text scale={.1} position={[1, 1.7, -0.4]}>
        {logText}
      </Text>
    </>
  )
}