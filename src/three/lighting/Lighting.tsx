export default function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} color="#0a1224" />

      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        color="#22d3ee"
      />

      <pointLight
        position={[-3, 3, 2]}
        intensity={1.5}
        color="#00d4ff"
        distance={12}
        decay={1.5}
      />

      <pointLight
        position={[2, 4, -2]}
        intensity={0.8}
        color="#67e8f9"
        distance={10}
        decay={2}
      />
    </>
  );
}
