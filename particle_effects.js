
function createSunParticleSystemAtPosition(scene, position) {
    // Create a particle system
    var surfaceParticles = new BABYLON.ParticleSystem("surfaceParticles", 1600, scene);
    var flareParticles = new BABYLON.ParticleSystem("flareParticles", 20, scene);

    // Texture of each particle
    surfaceParticles.particleTexture = new BABYLON.Texture("https://raw.githubusercontent.com/PatrickRyanMS/BabylonJStextures/master/ParticleSystems/Sun/T_SunSurface.png", scene);
    flareParticles.particleTexture = new BABYLON.Texture("https://raw.githubusercontent.com/PatrickRyanMS/BabylonJStextures/master/ParticleSystems/Sun/T_SunFlare.png", scene);


    var scaleFactor = 500 / 2.01;

    // Create core sphere
    var coreSphere = BABYLON.MeshBuilder.CreateSphere("coreSphere", {diameter: 500, segments: 64}, scene);
    coreSphere.position = position;

    // Create core material
    var coreMat = new BABYLON.StandardMaterial("coreMat", scene)
    coreMat.emissiveColor = new BABYLON.Color3(0.3773, 0.0930, 0.0266);

    // Assign core material to sphere
    coreSphere.material = coreMat;

    // Pre-warm
    surfaceParticles.preWarmStepOffset = 10;
    surfaceParticles.preWarmCycles = 100;

    flareParticles.preWarmStepOffset = 10;
    flareParticles.preWarmCycles = 100;

    // Initial rotation
    surfaceParticles.minInitialRotation = -2 * Math.PI;
    surfaceParticles.maxInitialRotation = 2 * Math.PI;

    flareParticles.minInitialRotation = -2 * Math.PI;
    flareParticles.maxInitialRotation = 2 * Math.PI;

    // Where the sun particles come from
    var sunEmitter = new BABYLON.SphereParticleEmitter();
    sunEmitter.radius = scaleFactor;
    sunEmitter.radiusRange = 0; // emit only from shape surface


    // Assign particles to emitters
    surfaceParticles.emitter = coreSphere; // the starting object, the emitter
    surfaceParticles.particleEmitterType = sunEmitter;

    flareParticles.emitter = coreSphere; // the starting object, the emitter
    flareParticles.particleEmitterType = sunEmitter;

    // Color gradient over time
    surfaceParticles.addColorGradient(0, new BABYLON.Color4(0.8509, 0.4784, 0.1019, 0.0));
    surfaceParticles.addColorGradient(0.4, new BABYLON.Color4(0.6259, 0.3056, 0.0619, 0.5));
    surfaceParticles.addColorGradient(0.5, new BABYLON.Color4(0.6039, 0.2887, 0.0579, 0.5));
    surfaceParticles.addColorGradient(1.0, new BABYLON.Color4(0.3207, 0.0713, 0.0075, 0.0));

    flareParticles.addColorGradient(0, new BABYLON.Color4(1, 0.9612, 0.5141, 0.0));
    flareParticles.addColorGradient(0.25, new BABYLON.Color4(0.9058, 0.7152, 0.3825, 1.0));
    flareParticles.addColorGradient(1.0, new BABYLON.Color4(0.6320, 0.0, 0.0, 0.0));

    // Size of each particle (random between...
    surfaceParticles.minSize = 0.4 * scaleFactor;
    surfaceParticles.maxSize = 0.7 * scaleFactor;

    flareParticles.minScaleX = 0.5 * scaleFactor;
    flareParticles.minScaleY = 0.5 * scaleFactor;
    flareParticles.maxScaleX = scaleFactor;
    flareParticles.maxScaleY = scaleFactor;

    // Size over lifetime
    flareParticles.addSizeGradient(0, 0);
    flareParticles.addSizeGradient(1, 1);

    // Life time of each particle (random between...
    surfaceParticles.minLifeTime = 8.0;
    surfaceParticles.maxLifeTime = 8.0;

    flareParticles.minLifeTime = 10.0;
    flareParticles.maxLifeTime = 10.0;

    // Emission rate
    surfaceParticles.emitRate = 200;
    flareParticles.emitRate = 1;

    // Blend mode : BLENDMODE_ONEONE, BLENDMODE_STANDARD, or BLENDMODE_ADD
    surfaceParticles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
    flareParticles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;


    // Set the gravity of all particles
    surfaceParticles.gravity = new BABYLON.Vector3(0, 0, 0);
    flareParticles.gravity = new BABYLON.Vector3(0, 0, 0);


    // Angular speed, in radians
    surfaceParticles.minAngularSpeed = -0.4;
    surfaceParticles.maxAngularSpeed = 0.4;

    flareParticles.minAngularSpeed = 0.0;
    flareParticles.maxAngularSpeed = 0.0;

    // Speed
    surfaceParticles.minEmitPower = 0;
    surfaceParticles.maxEmitPower = 0;
    surfaceParticles.updateSpeed = 0.005;

    flareParticles.minEmitPower = 0.001;
    flareParticles.maxEmitPower = 0.01;

    // coronaParticles.minEmitPower = 0.0;
    // coronaParticles.maxEmitPower = 0.0;

    // No billboard
    surfaceParticles.isBillboardBased = false;
    flareParticles.isBillboardBased = true;


    // Render Order
    flareParticles.renderingGroupId = 2;
    surfaceParticles.renderingGroupId = 3;
    coreSphere.renderingGroupId = 3;

    // Ensure depth write is enabled for particles to be occluded by meshes
    surfaceParticles.disableDepthWrite = false;
    flareParticles.disableDepthWrite = false;

    // Set transparency using materials for a more natural look
    var surfaceMaterial = new BABYLON.StandardMaterial("surfaceMaterial", scene);
    surfaceMaterial.alpha = 0.7; // Adjust opacity as needed
    surfaceParticles.material = surfaceMaterial;

    var flareMaterial = new BABYLON.StandardMaterial("flareMaterial", scene), sphereEmitterRadius;
    flareMaterial.alpha = 1.0; // Adjust opacity as needed
    flareParticles.material = flareMaterial;

// Optionally, animate the material alpha for a fading effect:
    scene.registerBeforeRender(function () {
        surfaceMaterial.alpha -= 0.005; // Adjust fade rate as needed
        flareMaterial.alpha -= 0.01; // Adjust fade rate as needed
    });


    // Start the particle system
    surfaceParticles.start();
    flareParticles.start();
}


function restartParticleSystem(particleSystem, settings, scene) {
    // Dispose of the current particle system if it exists
    if (particleSystem && particleSystem.dispose) {
        particleSystem.dispose();
    }
    // console.log("Restarting particle system ...");
    // Recreate the particle system and return the new instance
    return createNewSphericalParticleSystem(scene, settings);
}

function createSparkleSystem(name, color, position, scene) {
    // console.log("Creating sparkle system at position", position);
    // console.log("Name of the system", name);
    // console.log("Scene", scene);
    var sparkleSystem = new BABYLON.ParticleSystem("sparkle", 2000, scene);

    // Texture of each particle
    sparkleSystem.particleTexture = new BABYLON.Texture("http://localhost:8080/assets/star_particle.jpg", scene);


    sparkleSystem.createSphereEmitter(1); // Radius of the sphere

    sparkleSystem.emitter = position; // the starting position

    // Colors of all particles
    color.color1 = new BABYLON.Color3.FromHexString("#d7d7d7");
    color.color2 = new BABYLON.Color3.FromHexString("#ffffff");
    color.colorDead = new BABYLON.Color3.FromHexString("#b6b4f8");


    // Configuration of particle sizes and lifetimes
    sparkleSystem.minSize = 2;
    sparkleSystem.maxSize = 7;
    sparkleSystem.minLifeTime = 0.1;
    sparkleSystem.maxLifeTime = .2;

    // Emission settings
    sparkleSystem.manualEmitCount = 4; // Number of particles emitted in one burst
    sparkleSystem.disposeOnStop = true; // Automatically dispose the system when it stops
    sparkleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    // Angular speed and emit power settings
    //  sparkleSystem.minAngularSpeed = 20;
    //sparkleSystem.maxAngularSpeed = 30;
    sparkleSystem.minEmitPower = 1;
    sparkleSystem.maxEmitPower = 5;
    sparkleSystem.updateSpeed = 0.005;

    // Starting the particle system
    sparkleSystem.start();
}

function getRandomPositionInsideSphere(center, radius) {
    let u = Math.random();
    let v = Math.random();
    let theta = u * 2.0 * Math.PI;
    let phi = Math.acos(2.0 * v - 1.0);
    let r = Math.cbrt(Math.random()) * radius;
    let sinTheta = Math.sin(theta);
    let cosTheta = Math.cos(theta);
    let sinPhi = Math.sin(phi);
    let cosPhi = Math.cos(phi);
    let x = r * sinPhi * cosTheta;
    let y = r * sinPhi * sinTheta;
    let z = r * cosPhi;
    return new BABYLON.Vector3(x + center.x, y + center.y, z + center.z);
}

function createParticleSystemAtRandomPosition(center, radius, color, name, scene) {
    // Get a random position within the specified sphere
    let randomPosition = getRandomPositionInsideSphere(center, radius);

    // console.log("Creating particle system at random position: ", randomPosition.toString());
    // // Create the particle system at the random position
    // console.log("Name: ", name);
    // console.log("Scene: ", scene);
    createSparkleSystem(name, color, randomPosition, scene);
}

function createNewSphericalParticleSystem(scene, {position = new BABYLON.Vector3(0, 0, -50),
    particleNumber = 800,
    sphereEmitterRadius = 1000, // Original value at 250 TODO see if we can spread particles further somehow
    particleSize = {min: 60, max: 100},
    particleColors = {color1: "#eeeeee", color2: "#cfcfff", colorDead: "#e5e5e5"},
    fogTextureUrl = "http://localhost:8080/assets/water3.png" }) {
    // fogTextureUrl = "https://raw.githubusercontent.com/aWeirdo/Babylon.js/master/smoke_15.png"}) {

    // console.log("Creating new spherical particle system")
    // console.log("Position: ", position)
    // console.log("Radius: ", sphereEmitterRadius)

    // // Custom shader for particles
    // BABYLON.Effect.ShadersStore["myParticleFragmentShader"] =
    //         "#ifdef GL_ES\n" +
    //         "precision highp float;\n" +
    //         "#endif\n" +
    //         "varying vec2 vUV;\n" +
    //         "varying vec4 vColor;\n" +
    //         "uniform sampler2D diffuseSampler;\n" +
    //         "uniform float time;\n" +
    //         "void main(void) {\n" +
    //         "vec2 position = vUV;\n" +
    //         "float color = 0.0;\n" +
    //         "vec2 center = vec2(0.5, 0.5);\n" +
    //         "color = sin(distance(position, center) * 10.0 + time * vColor.g);\n" +
    //         "vec4 baseColor = texture2D(diffuseSampler, vUV);\n" +
    //         "gl_FragColor = baseColor * vColor * vec4(vec3(color, color, color), 1.0);\n" +
    //         "}\n";
    //
    // // Create an effect for particles using the custom shader
    // var effect = scene.getEngine().createEffectForParticles("myParticle", ["time"]);


    var particleSystem = new BABYLON.ParticleSystem("particles", particleNumber, scene);
    particleSystem.manualEmitCount = particleSystem.getCapacity();

    var fogTexture = new BABYLON.Texture(fogTextureUrl, scene);
    particleSystem.particleTexture = fogTexture.clone();


    // Setting the particleEmitterType to a SphereParticleEmitter
    var sphereEmitter = new BABYLON.SphereParticleEmitter();
    sphereEmitter.radius = sphereEmitterRadius; // Setting the radius of the sphere
    sphereEmitter.radiusRange = 1;
    particleSystem.emitter = position;
    particleSystem.particleEmitterType = sphereEmitter;

    let color1x = new BABYLON.Color3.FromHexString(particleColors.color1);
    let color2x = new BABYLON.Color3.FromHexString(particleColors.color2);
    let colorDeadx = new BABYLON.Color3.FromHexString(particleColors.colorDead);

    particleSystem.color1 = new BABYLON.Color4(color1x.r,color1x.g, color1x.b, 0.3);
    particleSystem.color2 = new BABYLON.Color4(color2x.r, color2x.g, color2x.b, 0.2);
    particleSystem.colorDead = new BABYLON.Color4(colorDeadx.r, colorDeadx.g, colorDeadx.b, 0.1);

    particleSystem.minSize = particleSize.min;
    particleSystem.maxSize = particleSize.max;
    particleSystem.minLifeTime = Number.MAX_SAFE_INTEGER;
    particleSystem.emitRate = 50000;
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
    particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);
    // Directional properties are still applicable, but the sphere emitter provides a natural spread
    particleSystem.direction1 = new BABYLON.Vector3(0, 0, 0);
    particleSystem.direction2 = new BABYLON.Vector3(0, 0, 0);
    //   particleSystem.minAngularSpeed = -2;
    //  particleSystem.maxAngularSpeed = 2;
    particleSystem.minEmitPower = .3;
    particleSystem.maxEmitPower = .9;
    particleSystem.updateSpeed = 0.005;

//     // Create sub emitter
//     var subEmitter = new BABYLON.SubEmitter(createSystem(new BABYLON.Color4(1, 1, 1), 1,"sparks", scene));
// // Have the sub emitter spawn the particle system when the particle dies
//     subEmitter.type = BABYLON.SubEmitterType.ATTACHED;
//
//     particleSystem.subEmitters = [subEmitter];

    particleSystem.start();
    return particleSystem; // Optionally return the particle system for further manipulation
}

/*
function createNewParticleSystem(scene, fountainPosition = new BABYLON.Vector3(0, 0, -50),
                                 particleNumber = 2500,
                                 emitBoxSize = {min: new BABYLON.Vector3(-150, -100, -100),
                                     max: new BABYLON.Vector3(150, 100, 200)},
                                 particleSize = {min: 20, max: 30},
                                 fogTextureUrl =
                                     "https://raw.githubusercontent.com/aWeirdo/Babylon.js/master/smoke_15.png") {
    var fountain = BABYLON.Mesh.CreateBox("fountain", .01, scene);
    fountain.visibility = 0;
    fountain.position = fountainPosition;

    var particleSystem = new BABYLON.ParticleSystem("particles", particleNumber, scene);
    particleSystem.manualEmitCount = particleSystem.getCapacity();
    particleSystem.minEmitBox = emitBoxSize.min; // Starting all from
    particleSystem.maxEmitBox = emitBoxSize.max; // To...

    var fogTexture = new BABYLON.Texture(fogTextureUrl, scene);
    particleSystem.particleTexture = fogTexture.clone();
    particleSystem.emitter = fountain;

    let color1 = new BABYLON.Color3.FromHexString("#cccccc");
    let color2 = new BABYLON.Color3.FromHexString("#f2f2f2");
    let colorDead = new BABYLON.Color3.FromHexString("#e5e5e5");

    particleSystem.color1 = new BABYLON.Color4(color1.r,color1.g, color1.b, 0.1);
    particleSystem.color2 = new BABYLON.Color4(color2.r, color2.g, color2.b, 0.15);
    particleSystem.colorDead = new BABYLON.Color4(colorDead.r, colorDead.g, colorDead.b, 0.1);

    //particleSystem.color2 = new BABYLON.Color4(.95, .95, .95, 0.15);
    //particleSystem.colorDead = new BABYLON.Color4(0.9, 0.9, 0.9, 0.1);
    particleSystem.minSize = particleSize.min;
    particleSystem.maxSize = particleSize.max;
    particleSystem.minLifeTime = Number.MAX_SAFE_INTEGER;
    particleSystem.emitRate = 100000;
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
    particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);
    particleSystem.direction1 = new BABYLON.Vector3(0, 0, 0);
    particleSystem.direction2 = new BABYLON.Vector3(0, 0, 0);
    particleSystem.minAngularSpeed = -2;
    particleSystem.maxAngularSpeed = 2;
    particleSystem.minEmitPower = .5;
    particleSystem.maxEmitPower = 1;
    particleSystem.updateSpeed = 0.005;

    particleSystem.start();
    return particleSystem; // Optionally return the particle system for further manipulation
}

 */
