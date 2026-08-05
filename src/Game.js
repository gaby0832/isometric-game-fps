import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

export class Game {

	loadAnimations() {

	    this.loader.load("/front.fbx", (anim) => {

	        this.actions.front =
	            this.mixer.clipAction(anim.animations[0]);

	    });

	    this.loader.load("/back.fbx", (anim) => {

	        this.actions.back =
	            this.mixer.clipAction(anim.animations[0]);

	    });

	    this.loader.load("/left.fbx", (anim) => {

	        this.actions.left =
	            this.mixer.clipAction(anim.animations[0]);

	    });

	    this.loader.load("/right.fbx", (anim) => {

	        this.actions.right =
	            this.mixer.clipAction(anim.animations[0]);

	    });

	    this.loader.load("/fleft.fbx", (anim) => {

	        this.actions.fleft =
	            this.mixer.clipAction(anim.animations[0]);

	    });

	    this.loader.load("/fright.fbx", (anim) => {

	        this.actions.fright =
	            this.mixer.clipAction(anim.animations[0]);

	    });

	    this.loader.load("/bleft.fbx", (anim) => {

	        this.actions.bleft =
	            this.mixer.clipAction(anim.animations[0]);

	    });

	    this.loader.load("/bright.fbx", (anim) => {

	        this.actions.bright =
	            this.mixer.clipAction(anim.animations[0]);

	    });





	    this.loader.load("/idle.fbx", (anim) => {

		    this.actions.idle = this.mixer.clipAction(anim.animations[0]);

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


        this.loader = new FBXLoader();

		this.mixer = null;
		this.actions = {};
		this.currentAction = null;

		this.loader.load("/player.fbx", (fbx) => {

		    this.player = fbx;

		    this.player.scale.setScalar(0.02);

		    this.scene.add(this.player);

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

    	if (!this.player) {

		    requestAnimationFrame(this.loop);
		    this.renderer.render(this.scene, this.camera);
		    return;

		}

    	const delta = this.clock.getDelta();

		if (this.mixer)
		    this.mixer.update(delta);

    	const speed = 0.08;

		const forward = new THREE.Vector3();

		// pega a direção para frente do jogador
		this.player.getWorldDirection(forward);

		// como não queremos subir/descer
		forward.y = 0;

		// normaliza para ficar com tamanho 1
		forward.normalize();

		// vetor para direita
		const right = new THREE.Vector3();
		const up = new THREE.Vector3(0, 1, 0);
		right.crossVectors(up, forward).normalize();
		let moving = false;


		// W
		if (this.keys["KeyW"]) {
			 moving = true;
		    this.player.position.addScaledVector(forward, speed);
		  

		     if (this.keys["KeyA"]) {
		     	 this.play("fleft");

		     }else if(this.keys["KeyD"]){
		     	this.play("fright");
		     }else{
		     	this.play("front");
		     }
		}

		// S
		if (this.keys["KeyS"]) {
			 moving = true;
		    this.player.position.addScaledVector(forward, -speed);
		     
		     if (this.keys["KeyA"]) {
		     	 this.play("bleft");

		     }else if(this.keys["KeyD"]){
		     	this.play("bright");
		     }else{
		     	this.play("back");
		     }
		}

		// A
		if (this.keys["KeyA"]) {
			 moving = true;
		    this.player.position.addScaledVector(right, speed);
		   

		          if (this.keys["KeyW"]) {
		     	 this.play("fleft");

		     }else if(this.keys["KeyS"]){
		     	this.play("bleft");
		     }else{
		     	  this.play("right");
		     }
		}


		// D
		if (this.keys["KeyD"]) {
			 moving = true;
		    this.player.position.addScaledVector(right, -speed);
		     

		     if (this.keys["KeyW"]) {
		     	 this.play("fright");

		     }else if(this.keys["KeyS"]){
		     	this.play("bright");
		     }else{
		     	this.play("left");
		     }
		}

		if (!moving) {
		    this.play("idle");
		}

		this.camera.position.x = this.player.position.x + 15;


		this.camera.position.z = this.player.position.z + 15;

		this.camera.lookAt(
		    this.player.position.x,
		    this.player.position.y,
		    this.player.position.z
		);

		this.camera.updateMatrixWorld();

		this.raycaster.setFromCamera(this.mouse, this.camera);

		const hits = this.raycaster.intersectObject(this.floor);

		if (hits.length > 0) {

		    const point = hits[0].point;

		    const dx = point.x - this.player.position.x;
		    const dz = point.z - this.player.position.z;

		    this.player.rotation.y = Math.atan2(dx, dz);

		}


	


        requestAnimationFrame(this.loop);

        this.renderer.render(this.scene, this.camera);
    };
}