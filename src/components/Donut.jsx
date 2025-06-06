import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Donut() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);

    const updateCameraPosition = () => {
      if (window.innerWidth < 600) {
        camera.position.z = 10;
      } else {
        camera.position.z = 6;
      }
    };

    updateCameraPosition();
    window.addEventListener('resize', updateCameraPosition);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x111111, 0);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.TorusGeometry(2, 1, 64, 100);

    const colors = [];
    for (let i = 0; i < geometry.attributes.position.count; i++) {
      colors.push(0.88, 0.53, 0.29);
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.2,
      metalness: 0.4,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    let rotation = { x: 0, y: 0 };
    let targetRotation = { x: 0, y: 0 };

    const onMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotation.y = x * Math.PI * 1.2;
      targetRotation.x = y * Math.PI * 1.0;
    };

    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      rotation.x += (targetRotation.x - rotation.x) * 0.07;
      rotation.y += (targetRotation.y - rotation.y) * 0.07;
      mesh.rotation.x = rotation.x;
      mesh.rotation.y = rotation.y;
      renderer.render(scene, camera);
    };
    animate();

    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      updateCameraPosition();
    });
    resizeObserver.observe(container);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', updateCameraPosition);
      resizeObserver.disconnect();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        overflow: 'hidden',
      }}
    />
  );
}