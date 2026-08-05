import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { SkeletonHelper } from "three";

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


				this.loader.load("/tleft45.fbx", (anim)=>{
		    this.actions.tleft45 =
		        this.mixer.clipAction(anim.animations[0]);

		    this.actions.tleft45.setLoop(THREE.LoopOnce);
		    this.actions.tleft45.clampWhenFinished = true;

		    this.assetLoaded();
		});

		this.loader.load("/tleft90.fbx", (anim)=>{
		    this.actions.tleft90 =
		        this.mixer.clipAction(anim.animations[0]);

		    this.actions.tleft90.setLoop(THREE.LoopOnce);
		    this.actions.tleft90.clampWhenFinished = true;

		    this.assetLoaded();
		});

		this.loader.load("/tright45.fbx", (anim)=>{
		    this.actions.tright45 =
		        this.mixer.clipAction(anim.animations[0]);

		    this.actions.tright45.setLoop(THREE.LoopOnce);
		    this.actions.tright45.clampWhenFinished = true;

		    this.assetLoaded();
		});

		this.loader.load("/tright90.fbx", (anim)=>{
		    this.actions.tright90 =
		        this.mixer.clipAction(anim.animations[0]);

		    this.actions.tright90.setLoop(THREE.LoopOnce);
		    this.actions.tright90.clampWhenFinished = true;

		    this.assetLoaded();
		});

		this.loader.load("/idleaiming.fbx", (anim)=>{
		    this.actions.idleaiming =
		        this.mixer.clipAction(anim.animations[0]);

		    this.assetLoaded();
		});

	}


createWeapon() {
    const geometry = new THREE.BoxGeometry(
        5, // comprimento
        100,  // altura
        10   // largura
    );

    const material = new THREE.MeshStandardMaterial({
        color: 0x333333
    });

    this.weapon = new THREE.Mesh(geometry, material);

    // A mão direita controla a arma.
    this.rightHand.add(this.weapon);

    // Ajuste esses valores.
    this.weapon.position.set(0, 10, 10);
    this.weapon.rotation.set(-0.5, 0.5, -10.2);


    // Helpers temporários para enxergar os eixos.
    this.rightHand.add(new THREE.AxesHelper(15));
    this.leftHand.add(new THREE.AxesHelper(15));
}




constructor() {

    // =========================
    // CENA
    // =========================

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    this.camera.position.set(15, 15, 15);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    this.renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    document.body.appendChild(
        this.renderer.domElement
    );

    // =========================
    // LUZES
    // =========================

    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(5, 10, 5);
    this.scene.add(light);

    this.scene.add(
        new THREE.AmbientLight(0xffffff, 0.5)
    );

    // =========================
    // CHÃO
    // =========================

    this.floor = new THREE.Mesh(
        new THREE.PlaneGeometry(50, 50),
        new THREE.MeshStandardMaterial({
            color: 0x3b8c3b
        })
    );

    this.floor.rotation.x = -Math.PI / 2;
    this.scene.add(this.floor);

    // =========================
    // UTILITÁRIOS
    // =========================

    this.clock = new THREE.Clock();

    this.loader = new FBXLoader();

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.groundPlane = new THREE.Plane(
        new THREE.Vector3(0, 1, 0),
        0
    );

    this.mousePoint = new THREE.Vector3();

    // =========================
    // VETORES REUTILIZÁVEIS
    // =========================

    this.forward = new THREE.Vector3();
    this.right = new THREE.Vector3();
    this.up = new THREE.Vector3(0, 1, 0);

    this.tmpQuat = new THREE.Quaternion();
    this.yAxis = new THREE.Vector3(-0.5, 0.05, 0);

    // =========================
    // MOVIMENTO
    // =========================

    this.state = "idle";

	this.turnDirection = null;

	this.turning = false;

	this.turnAmount = 0;
this.turnAction = null;

    this.lookAngle = 0;
    this.moveAngle = 0;

    this.legsAngle = 0;

	this.maxTorsoAngle = THREE.MathUtils.degToRad(60);

	this.aiming = false;

    this.deadZone = 3;

    this.keys = {};

    // =========================
    // ANIMAÇÕES
    // =========================

    this.mixer = null;
    this.actions = {};
    this.currentAction = null;

    // =========================
    // LOADING
    // =========================

    this.assetsLoaded = 0;
    this.assetsToLoad = 14;
    this.gameReady = false;

    // =========================
    // PLAYER
    // =========================

    this.loader.load("/player.fbx", (fbx) => {

        this.player = fbx;

        this.player.scale.setScalar(0.02);

        this.scene.add(this.player);

        this.spine1 = this.player.getObjectByName("spine_01");
        this.spine2 = this.player.getObjectByName("spine_02");
        this.neck   = this.player.getObjectByName("neck");
        this.head   = this.player.getObjectByName("head");

        this.spine1Base = this.spine1.quaternion.clone();
        this.spine2Base = this.spine2.quaternion.clone();
        this.neckBase   = this.neck.quaternion.clone();
        this.headBase   = this.head.quaternion.clone();


    if (!this.rightHand) {
        console.error("Osso hand_r não encontrado");
    }

        this.mixer = new THREE.AnimationMixer(this.player);

		this.mixer.addEventListener("finished", (event) => {
		    if (!this.turning) return;
		    if (event.action !== this.turnAction) return;

		    this.legsAngle += this.turnAmount;

		    // mantém o ângulo entre -PI e PI
		    this.legsAngle = Math.atan2(
		        Math.sin(this.legsAngle),
		        Math.cos(this.legsAngle)
		    );

		    this.player.rotation.y = this.legsAngle;

		    this.turning = false;
		    this.turnAmount = 0;
		    this.turnAction = null;

		    if (this.aiming) {
		        this.play("idleaiming");
		    } else {
		        this.play("idle");
		    }
		});

this.rightHand = this.player.getObjectByName("hand_r");
this.leftHand = this.player.getObjectByName("hand_l");

if (!this.rightHand || !this.leftHand) {
    console.error("Não encontrei hand_r ou hand_l");
} else {
    this.createWeapon();
}

        this.loadAnimations();

        this.assetLoaded();
    });

    // =========================
    // INPUT
    // =========================

    window.addEventListener("keydown", (e) => {

        this.keys[e.code] = true;

    });

    window.addEventListener("keyup", (e) => {

        this.keys[e.code] = false;

    });

    window.addEventListener("mousemove", (e) => {

        this.mouse.x =
            (e.clientX / window.innerWidth) * 2 - 1;

        this.mouse.y =
            -(e.clientY / window.innerHeight) * 2 + 1;

    });

	    window.addEventListener("mousedown", e=>{
	    if(e.button === 2)
	        this.aiming = true;
	});

	window.addEventListener("mouseup", e=>{
	    if(e.button === 2)
	        this.aiming = false;
	});

	window.addEventListener("contextmenu", e=>e.preventDefault());

}

    start() {
        this.loop();
    }

play(name) {
    const nextAction = this.actions[name];

    if (!nextAction) {
        console.warn(`Animação não carregada: ${name}`);
        return;
    }

    if (this.currentAction === nextAction) {
        return;
    }

    if (this.currentAction) {
        this.currentAction.fadeOut(0.15);
    }

    nextAction
        .reset()
        .setEffectiveTimeScale(1)
        .setEffectiveWeight(1)
        .fadeIn(0.15)
        .play();

    this.currentAction = nextAction;
}


loop = () => {

    requestAnimationFrame(this.loop);

    if (!this.gameReady || !this.player) {
        this.renderer.render(this.scene, this.camera);
        return;
    }

    //==============================
    // DELTA / ANIMAÇÕES
    //==============================

    const delta = this.clock.getDelta();

    if (this.mixer)
        this.mixer.update(delta);

    //==============================
    // CÂMERA
    //==============================

    this.camera.position.set(
        this.player.position.x + 15,
        15,
        this.player.position.z + 15
    );

    this.camera.lookAt(this.player.position);
    this.camera.updateMatrixWorld();

    //==============================
    // MOUSE -> ÂNGULO
    //==============================

    this.raycaster.setFromCamera(this.mouse, this.camera);

    if (this.raycaster.ray.intersectPlane(this.groundPlane, this.mousePoint)) {

        const dx = this.mousePoint.x - this.player.position.x;
        const dz = this.mousePoint.z - this.player.position.z;

        const dist = Math.hypot(dx, dz);

        if (dist > this.deadZone) {

            this.lookAngle = Math.atan2(dx, dz);

        }

    }

    //==============================
    // MOVIMENTO
    //==============================

    const W = this.keys["KeyW"];
    const A = this.keys["KeyA"];
    const S = this.keys["KeyS"];
    const D = this.keys["KeyD"];

    let moveX = 0;
    let moveZ = 0;

    if (W) moveZ += 1;
    if (S) moveZ -= 1;
    if (A) moveX += 1;
    if (D) moveX -= 1;

    const wantsToMove = moveX !== 0 || moveZ !== 0;
	const moving = wantsToMove && !this.turning;

    if (moving) {

        const local = new THREE.Vector3(moveX, 0, moveZ);

        local.normalize();

        local.applyAxisAngle(
            this.up,
            this.lookAngle
        );

        this.player.position.addScaledVector(
            local,
            0.08
        );

    }

//==============================
// ANIMAÇÃO NORMAL
//==============================

if (!this.turning) {
    let animation = "idle";

    if (moving) {
        if (W && A) animation = "fleft";
        else if (W && D) animation = "fright";
        else if (S && A) animation = "bleft";
        else if (S && D) animation = "bright";
        else if (W) animation = "front";
        else if (S) animation = "back";
        else if (A) animation = "right";
        else if (D) animation = "left";
    } else if (this.aiming) {
        animation = "idleaiming";
    }

    this.play(animation);
}

//==============================
// ROTAÇÃO
//==============================

let diff = this.lookAngle - this.legsAngle;

while (diff > Math.PI)
    diff -= Math.PI * 2;

while (diff < -Math.PI)
    diff += Math.PI * 2;


//=======================================
// ANDANDO
//=======================================

if (moving) {

    this.legsAngle = THREE.MathUtils.lerp(
        this.legsAngle,
        this.lookAngle,
        0.18
    );

    this.player.rotation.y = this.legsAngle;

    // devolve o tronco
    this.spine1.rotation.y = THREE.MathUtils.lerp(this.spine1.rotation.y,0,0.15);
    this.spine2.rotation.y = THREE.MathUtils.lerp(this.spine2.rotation.y,0,0.15);
    this.neck.rotation.y   = THREE.MathUtils.lerp(this.neck.rotation.y,0,0.15);
    this.head.rotation.y   = THREE.MathUtils.lerp(this.head.rotation.y,0,0.20);

}

//=======================================
// PARADO MIRANDO
//=======================================

else if (this.aiming) {
    const torso = THREE.MathUtils.clamp(
        diff,
        -this.maxTorsoAngle,
        this.maxTorsoAngle
    );

    this.spine1.rotation.y = torso * 0.15;
    this.spine2.rotation.y = torso * 1;
    this.neck.rotation.y = torso * 0.35;
    this.head.rotation.y = torso * 0.5;

    this.player.rotation.y = this.legsAngle;

    if (!this.turning) {
        const absDiff = Math.abs(diff);
        const turnThreshold = THREE.MathUtils.degToRad(60);

        if (absDiff > turnThreshold) {
            const isLeft = diff < 0;
            const use90 = absDiff >= THREE.MathUtils.degToRad(75);

            let turnName;
            let turnDegrees;

            if (isLeft) {
                turnName = use90 ? "tright90" : "tright45";
                turnDegrees = use90 ? -90 : -45;
            } else {
                turnName = use90 ? "tleft90" : "tleft45";
                turnDegrees = use90 ? 90 : 45;
            }

            const action = this.actions[turnName];

            if (action) {
                this.turning = true;
                this.turnAmount = THREE.MathUtils.degToRad(turnDegrees);
                this.turnAction = action;

                this.play(turnName);
            }
        }
    }
}

//=======================================
// PARADO SEM MIRAR
//=======================================

else {

    this.spine1.rotation.y = THREE.MathUtils.lerp(this.spine1.rotation.y,0,0.15);
    this.spine2.rotation.y = THREE.MathUtils.lerp(this.spine2.rotation.y,0,0.15);
    this.neck.rotation.y   = THREE.MathUtils.lerp(this.neck.rotation.y,0,0.15);
    this.head.rotation.y   = THREE.MathUtils.lerp(this.head.rotation.y,0,0.15);

    this.player.rotation.y = this.legsAngle;

}

    this.renderer.render(this.scene, this.camera);

};

}