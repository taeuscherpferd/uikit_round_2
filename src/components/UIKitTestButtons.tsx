import { Container, Root } from "@react-three/uikit"

interface UIKitTestButtonsProps {
  setLeftSquareColor: React.Dispatch<React.SetStateAction<string>>
  setRightSquareColor: React.Dispatch<React.SetStateAction<string>>
  leftSquareColor: string
  rightSquareColor: string
}

export const UIKitTestButtons = (props: UIKitTestButtonsProps) => {
  const { setLeftSquareColor, setRightSquareColor, leftSquareColor, rightSquareColor } = props

  // NOTE: Did this as an answer to a question on Discord, but it's not used in the code. Consider a blog post or a tutorial on how to use the vibration API in React Three Fiber.
  // const onButtonHover = () => {
  //   three.gl.xr.getSession()?.inputSources[0]?.gamepad?.vibrationActuator?.playEffect("dual-rumble", {
  //     duration: 1000,
  //     strongMagnitude: 1,
  //     weakMagnitude: 0.5
  //   })
  //   three.gl.xr.getSession()?.inputSources[1]?.gamepad?.vibrationActuator?.playEffect("dual-rumble", {
  //     duration: 1000,
  //     strongMagnitude: 1,
  //     weakMagnitude: 0.5
  //   })
  // }

  return (<group position={[0, 2, -4]}>
    <Root backgroundColor={"#9900ff"} sizeX={2} sizeY={1} flexDirection={'row'}>
      <Container onClick={() => setLeftSquareColor((p) => p === "green" ? "red" : "green")} flexGrow={1} margin={8} backgroundColor={leftSquareColor} />
      <Container onClick={() => setRightSquareColor((p) => p === "blue" ? "orange" : "blue")} flexGrow={1} margin={8} backgroundColor={rightSquareColor} />
    </Root>
  </group>)
}