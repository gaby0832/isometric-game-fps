import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

export class Game {

		assetLoaded() {

    this.assetsLoaded++;

    console.log(`${this.assetsLoaded}/${this.assetsToLoad}`);

    if (this.assetsLoaded === this.assetsToLoad) {

        this.gameReady = true;

        console.log("Tudo carregado!");

    }

}

	loadAnimations() {

	    this.loader.load("/front.fbx", (anim) => {

	        this.actions.front =
	            this.mixer.clipAction(anim.animations[0]);

	            this.assetLoaded();

	    });

	    this.loader.load("/back.fbx", (anim) => {

	        this.actions.back =
	            this.mixer.clipAction(anim.animations[0]);

	            this.assetLoaded();

	    });

	    this.loader.load("/left.fbx", (anim) => {

	        this.actions.left =
	            this.mixer.clipAction(anim.animations[0]);

	            this.assetLoaded();

	    });

	    this.loader.load("/right.fbx", (anim) => {

	        this.actions.right =
	            this.mixer.clipAction(anim.animations[0]);

	            this.assetLoaded();

	    });

	    this.loader.load("/fleft.fbx", (anim) => {

	        this.actions.fleft =
	            this.mixer.clipAction(anim.animations[0]);

	            this.assetLoaded();

	    });

	    this.loader.load("/fright.fbx", (anim) => {

	        this.actions.fright =
	            this.mixer.clipAction(anim.animations[0]);

	            this.assetLoaded();

	    });

	    this.loader.load("/bleft.fbx", (anim) => {

	        this.actions.bleft =
	            this.mixer.clipAction(anim.animations[0]);

	            this.assetLoaded();

	    });

	    this.loader.load("/bright.fbx", (anim) => {

	        this.actions.bright =
	            this.mixer.clipAction(anim.animations[0]);

	            this.assetLoaded();

	    });





	    this.loader.load("/idle.fbx", (anim) => {

		    this.actions.idle = this.mixer.clipAction(anim.animations[0]);

		    this.assetLoaded();

		    // Começa parado
		    this.play("idle");

		});

	}





    constructor() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            40,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(this.renderer.domElement);

        this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();

        this.camera.position.set(15, 15, 15);
        this.camera.lookAt(0, 0, 0);

        const light = new THREE.DirectionalLight(0xffffff, 3);
        light.position.set(5, 10, 5);

        this.scene.add(light);

        const ambient = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambient);

        this.floor = new THREE.Mesh(
            new THREE.PlaneGeometry(50, 50),
            new THREE.MeshStandardMaterial({
                color: 0x3b8c3b
            })
        );

        this.floor.updateMatrixWorld();

        this.floor.rotation.x = -Math.PI / 2;
		
		this.scene.add(this.floor);

        this.clock = new THREE.Clock();

        this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();

		// Plano infinito na altura Y = 0
		this.groundPlane = new THREE.Plane(
		    new THREE.Vector3(0, 1, 0),
		    0
		);

		// Vetor reutilizado para guardar onde o mouse bate no plano
		this.mousePoint = new THREE.Vector3();


        this.loader = new FBXLoader();

		        this.assetsToLoad = 10; // player + 9 animações
		this.assetsLoaded = 0;
		this.gameReady = false;

		this.mixer = null;
		this.actions = {};
		this.currentAction = null;

		this.loader.load("/player.fbx", (fbx) => {

		    this.player = fbx;

		    this.player.scale.setScalar(0.02);

		    this.scene.add(this.player);


			this.assetLoaded();

		    this.mixer = new THREE.AnimationMixer(this.player);

		    this.loadAnimations();

		});

		this.keys = {};

		window.addEventListener("keydown", e=>{
		    this.keys[e.code] = true;
		});

		window.addEventListener("keyup", e=>{
		    this.keys[e.code] = false;
		});


		
		window.addEventListener("mousemove", (event) => {

		    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		});


this.deadZone = 4; // distância em unidades do mundo

/*this.deadZoneMesh = new THREE.Mesh(
    new THREE.RingGeometry(this.deadZone - 0.05, this.deadZone, 64),
    new THREE.MeshBasicMaterial({
        color: 0xff0000,
        side: THREE.DoubleSide
    })
);

this.deadZoneMesh.rotation.x = -Math.PI / 2;
this.scene.add(this.deadZoneMesh);
this.deadZoneMesh.position.y = 0.1;
*/

		this.forward = new THREE.Vector3();
this.right = new THREE.Vector3();
this.up = new THREE.Vector3(0, 1, 0);


    }

    start() {
        this.loop();
    }

    play(name) {

		    if (this.currentAction === this.actions[name])
		        return;

		    if (this.currentAction)
		        this.currentAction.fadeOut(0.2);

		    this.currentAction = this.actions[name];

		    if (!this.currentAction)
		        return;

		    this.currentAction
		        .reset()
		        .fadeIn(0.2)
		        .play();

		}


    loop = () => {

    	if (!this.gameReady) {

	    requestAnimationFrame(this.loop);

	    this.renderer.render(this.scene, this.camera);

	    return;

	}

    requestAnimationFrame(this.loop);

    if (!this.player) {
        this.renderer.render(this.scene, this.camera);
        return;
    }

    const delta = this.clock.getDelta();

    if (this.mixer)
        this.mixer.update(delta);

    const speed = 0.08;

    // Vetores
    this.player.getWorldDirection(this.forward);
    //this.deadZoneMesh.position.copy(this.player.position);
    //this.deadZoneMesh.position.y = 0.1;

	this.forward.y = 0;
	this.forward.normalize();

	this.right.crossVectors(this.up, this.forward).normalize();

    // Movimento
    const W = this.keys["KeyW"];
    const A = this.keys["KeyA"];
    const S = this.keys["KeyS"];
    const D = this.keys["KeyD"];

    if (W) this.player.position.addScaledVector(this.forward, speed);
    if (S) this.player.position.addScaledVector(this.forward, -speed);
    if (A) this.player.position.addScaledVector(this.right, speed);
    if (D) this.player.position.addScaledVector(this.right, -speed);

    // Escolhe UMA animação
    let animation = "idle";

    if (W && A)
        animation = "fleft";
    else if (W && D)
        animation = "fright";
    else if (S && A)
        animation = "bleft";
    else if (S && D)
        animation = "bright";
    else if (W)
        animation = "front";
    else if (S)
        animation = "back";
    else if (A)
        animation = "right";
    else if (D)
        animation = "left";

    this.play(animation);

    // Câmera
    this.camera.position.set(
        this.player.position.x + 15,
        15,
        this.player.position.z + 15
    );

    this.camera.lookAt(this.player.position);

    this.camera.updateMatrixWorld();

    // Mouse
    this.raycaster.setFromCamera(this.mouse, this.camera);

    if (this.raycaster.ray.intersectPlane(this.groundPlane, this.mousePoint)) {

				const dx = this.mousePoint.x - this.player.position.x;
		const dz = this.mousePoint.z - this.player.position.z;

		const distance = Math.sqrt(dx * dx + dz * dz);

		if (distance < this.deadZone) {

		    const scale = this.deadZone / distance;

		    this.mousePoint.x = this.player.position.x + dx * scale;
		    this.mousePoint.z = this.player.position.z + dz * scale;

		}

		this.player.rotation.y = Math.atan2(
		    this.mousePoint.x - this.player.position.x,
		    this.mousePoint.z - this.player.position.z
		);
	}


    this.renderer.render(this.scene, this.camera);

};
}