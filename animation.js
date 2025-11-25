// animation.js
import * as THREE from 'three';
import { STATE, playerStats } from './stats.js';

// --- Particle System ---
class ParticleSystem {
    constructor(scene) {
        this.particles = [];
        this.scene = scene;
        this.geometry = new THREE.BufferGeometry();
        this.material = new THREE.PointsMaterial({
            size: 0.5, vertexColors: true, transparent: true, opacity: 0.8,
            blending: THREE.AdditiveBlending, depthWrite: false
        });
        this.mesh = new THREE.Points(this.geometry, this.material);
        this.mesh.frustumCulled = false;
        scene.add(this.mesh);
        this.maxParticles = 5000;
        
        // Pre-allocate arrays
        this.positions = new Float32Array(this.maxParticles * 3);
        this.colors = new Float32Array(this.maxParticles * 3);
        this.sizes = new Float32Array(this.maxParticles);
    }

    emit(pos, color, count, speed, spread, life) {
        for(let i=0; i<count; i++) {
            if(this.particles.length >= this.maxParticles) break;
            const velocity = new THREE.Vector3(
                (Math.random()-0.5), (Math.random()-0.5), (Math.random()-0.5)
            ).normalize().multiplyScalar(Math.random() * speed);
            
            this.particles.push({
                x: pos.x + (Math.random()-0.5)*spread,
                y: pos.y + (Math.random()-0.5)*spread,
                z: pos.z + (Math.random()-0.5)*spread,
                vx: velocity.x, vy: velocity.y, vz: velocity.z,
                r: color.r, g: color.g, b: color.b,
                life: life + Math.random() * 0.5, maxLife: life
            });
        }
    }

    update(dt) {
        let pCount = 0;
        for(let i=this.particles.length-1; i>=0; i--) {
            const p = this.particles[i];
            p.life -= dt;
            if(p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }
            p.x += p.vx * dt * 10; // Physics speed
            p.y += p.vy * dt * 10;
            p.z += p.vz * dt * 10;
            p.vy -= dt * 5; // Gravity

            // Update Arrays
            this.positions[pCount*3] = p.x;
            this.positions[pCount*3+1] = p.y;
            this.positions[pCount*3+2] = p.z;
            
            const alpha = p.life / p.maxLife;
            this.colors[pCount*3] = p.r * alpha;
            this.colors[pCount*3+1] = p.g * alpha;
            this.colors[pCount*3+2] = p.b * alpha;
            
            pCount++;
        }
        
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions.subarray(0, pCount*3), 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors.subarray(0, pCount*3), 3));
        this.geometry.setDrawRange(0, pCount);
        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.color.needsUpdate = true;
    }
}

// --- Camera Shake ---
let shakeIntensity = 0;
export function addTrauma(amount) {
    shakeIntensity = Math.min(shakeIntensity + amount, 1.0);
}

export function updateCameraShake(camera, dt) {
    if(shakeIntensity > 0) {
        shakeIntensity = Math.max(0, shakeIntensity - dt * 1.5);
        const shake = shakeIntensity * shakeIntensity;
        camera.rotation.z = (Math.random() - 0.5) * 0.2 * shake;
        camera.rotation.x += (Math.random() - 0.5) * 0.1 * shake;
        camera.position.add(new THREE.Vector3(
            (Math.random()-0.5)*shake, (Math.random()-0.5)*shake, (Math.random()-0.5)*shake
        ));
    } else {
        camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, 0, dt * 5);
    }
}

// --- Cinematics ---
export function runVictoryCinematic(dt, playerObj, playerMesh, bossMesh, scene, camera, timer) {
    playerMesh.visible = true;
    if(timer < 3) {
        const dir = new THREE.Vector3().subVectors(bossMesh.position, playerObj.position).normalize();
        playerObj.position.add(dir.multiplyScalar(dt * 2)); 
        playerMesh.children[4].rotation.x = Math.sin(timer*10); // Arm wave
    } else if(timer < 6) {
        bossMesh.scale.multiplyScalar(0.95);
        bossMesh.rotation.y += dt * 5;
        playerObj.lookAt(bossMesh.position);
    } else {
         document.querySelector('#overlay h1').innerText = "THE SULTAN HAS FALLEN";
         document.querySelector('#overlay p').innerText = "Score: " + Math.floor(STATE.score);
         document.getElementById('overlay').style.display = 'flex';
         document.getElementById('ui-layer').style.display = 'flex';
         STATE.cinematicMode = false;
    }
}

export function runDefeatCinematic(dt, playerObj, playerMesh, bossMesh, camera, timer) {
    playerMesh.visible = true;
    if(timer < 2) {
        bossMesh.lookAt(playerObj.position);
        camera.lookAt(playerObj.position);
        playerObj.rotation.x = -Math.PI/2; // Dead
    } else {
         document.querySelector('#overlay h1').innerText = "CRUSHED";
         document.querySelector('#overlay p').innerText = "The Sultan reigns eternal.";
         document.getElementById('overlay').style.display = 'flex';
         document.getElementById('ui-layer').style.display = 'flex';
         STATE.cinematicMode = false;
    }
}

export let particles;
export function initParticles(scene) { particles = new ParticleSystem(scene); }
