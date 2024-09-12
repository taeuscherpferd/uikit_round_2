import { useGLTF } from "@react-three/drei";
import { Vector3, useThree } from "@react-three/fiber";
import { useState } from "react";
import * as THREE from 'three';
import waterGunGlb from "./../assets/Models/WaterGun.glb";
// import { Grabable, GrabableProps } from "../WebVrGameDevFramework/Grabable/Grabable";

interface WaterGunProps {
  position: Vector3
  rotation?: THREE.Euler
  scale?: Vector3
  // grabableProps?: GrabableProps
}

type GLTFResult = {
  nodes: {
    Cube: THREE.Mesh
  }
  materials: {
    Material: THREE.MeshStandardMaterial
  }
}

const snapToRotation: THREE.Euler = new THREE.Euler(Math.PI + Math.PI / 8, Math.PI * 2, Math.PI * 1.5)

export const WaterGun: React.FC<WaterGunProps> = (WaterGunProps) => {
  const { scene } = useThree()
  // const { grabableProps } = WaterGunProps
  const [spheres, setSpheres] = useState<JSX.Element[]>([]);

  const { nodes, materials } = useGLTF(waterGunGlb) as unknown as GLTFResult;

  const spawnSphere = () => {
    // const bullet = new Bullet(new OgVector3(0, 2, 0), new OgVector3(0, 0, 0))
    // scene.add(bullet.mesh)
  };

  /* TODO: Make Grabable components respect left and right grabs when calling trigger functions */
  const grabFunctions = {
    i_OnLTriggerDown: () => {
      console.log("LTriggerDown")
    },
    i_OnRTriggerDown: () => {
      console.log("RTriggerDown")
      spawnSphere();
    },
  }

  return (
    // TODO: Reimplement Grabable component but do it better this time
    // <Grabable colliderOptions={{ colliders: 'cuboid' }} position={WaterGunProps.position} snapToRotation={snapToRotation} oculusGamePadFunctions={grabFunctions}>
    <group scale={WaterGunProps.scale} rotation={WaterGunProps.rotation} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Cube as any).geometry}
        material={materials.Material}
      />
    </group>
    // </Grabable >
  );
}

useGLTF.preload("/WaterGun.gltf");
