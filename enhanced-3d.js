
/* Enhanced 3D: Real GLB models + Bloom + Full workshop props */
(function(){
'use strict';

window.PRECISION_3D = {
  loadCar: function(url, onLoad, onErr){
    var loader = new THREE.GLTFLoader();
    loader.load(url, function(gltf){
      var root = gltf.scene;
      root.traverse(function(c){
        if(c.isMesh){
          c.castShadow = true;
          c.receiveShadow = true;
          if(c.material){
            c.material.envMapIntensity = 1.2;
            if(c.material.metalness !== undefined) c.material.metalness = Math.max(c.material.metalness, 0.4);
          }
        }
      });
      onLoad(root, gltf);
    }, undefined, onErr || function(e){ console.warn('GLB load failed', e); });
  },

  /* Build rich workshop environment */
  buildWorkshop: function(scene, opts){
    opts = opts || {};
    var floorMat = new THREE.MeshStandardMaterial({color:0x1a1a1a, metalness:0.35, roughness:0.65});
    var floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), floorMat);
    floor.rotation.x = -Math.PI/2; floor.receiveShadow = true; scene.add(floor);
    scene.add(new THREE.GridHelper(40, 40, 0x2a2a2a, 0x1a1a1a).translateY(0.01));

    var wallMat = new THREE.MeshStandardMaterial({color:0x121212, roughness:0.9});
    var back = new THREE.Mesh(new THREE.PlaneGeometry(40, 12), wallMat);
    back.position.set(0, 6, -14); scene.add(back);
    var left = new THREE.Mesh(new THREE.PlaneGeometry(28, 12), wallMat);
    left.rotation.y = Math.PI/2; left.position.set(-16, 6, 0); scene.add(left);
    var right = new THREE.Mesh(new THREE.PlaneGeometry(28, 12), wallMat);
    right.rotation.y = -Math.PI/2; right.position.set(16, 6, 0); scene.add(right);

    // Garage door (back wall opening feel)
    var doorMat = new THREE.MeshStandardMaterial({color:0x2a2a2a, metalness:0.6, roughness:0.4});
    var door = new THREE.Mesh(new THREE.BoxGeometry(8, 5, 0.3), doorMat);
    door.position.set(0, 2.5, -13.8); scene.add(door);
    // Door panels
    for(var i=0;i<5;i++){
      var panel = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.08, 0.05), new THREE.MeshStandardMaterial({color:0x444, metalness:0.8}));
      panel.position.set(0, 0.5+i*0.9, -13.6); scene.add(panel);
    }

    // Hydraulic lifts (2)
    function makeLift(x, z){
      var g = new THREE.Group();
      var base = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.25, 5.5), new THREE.MeshStandardMaterial({color:0x222, metalness:0.7, roughness:0.3}));
      base.position.y = 0.12; base.castShadow = true; g.add(base);
      var post1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.2, 0.2), new THREE.MeshStandardMaterial({color:0xf59e0b, metalness:0.5}));
      post1.position.set(-1.3, 1.2, 0); g.add(post1);
      var post2 = post1.clone(); post2.position.x = 1.3; g.add(post2);
      var arms = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.12, 0.3), new THREE.MeshStandardMaterial({color:0x333, metalness:0.8}));
      arms.position.y = 2.1; g.add(arms);
      g.position.set(x, 0, z); scene.add(g); return g;
    }
    makeLift(-5, -2); makeLift(5, 2);

    // Tool cabinets row
    var metal = new THREE.MeshStandardMaterial({color:0x2a3a5a, metalness:0.75, roughness:0.3});
    var redMetal = new THREE.MeshStandardMaterial({color:0x8b1a1a, metalness:0.6, roughness:0.35});
    [-10,-7,-4, 4, 7, 10].forEach(function(x, idx){
      var cab = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.6, 0.9), idx%2?redMetal:metal);
      cab.position.set(x, 1.3, -12); cab.castShadow = true; scene.add(cab);
      var handle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.06), new THREE.MeshStandardMaterial({color:0xccc, metalness:1, roughness:0.15}));
      handle.position.set(x+0.9, 1.3, -11.5); scene.add(handle);
      // Drawers
      for(var d=0;d<4;d++){
        var drawer = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.04, 0.02), new THREE.MeshStandardMaterial({color:0x111}));
        drawer.position.set(x, 0.5+d*0.55, -11.54); scene.add(drawer);
      }
    });

    // Work benches
    var wood = new THREE.MeshStandardMaterial({color:0x3d2914, roughness:0.8});
    [-12, 12].forEach(function(x){
      var top = new THREE.Mesh(new THREE.BoxGeometry(4, 0.12, 1.5), wood);
      top.position.set(x, 0.95, 4); top.castShadow = true; scene.add(top);
      var leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.95, 0.12), new THREE.MeshStandardMaterial({color:0x222}));
      leg1.position.set(x-1.7, 0.47, 3.5); scene.add(leg1);
      var leg2 = leg1.clone(); leg2.position.set(x+1.7, 0.47, 3.5); scene.add(leg2);
      var leg3 = leg1.clone(); leg3.position.set(x-1.7, 0.47, 4.5); scene.add(leg3);
      var leg4 = leg1.clone(); leg4.position.set(x+1.7, 0.47, 4.5); scene.add(leg4);
      // Tools on bench
      var wrench = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.08), new THREE.MeshStandardMaterial({color:0x888, metalness:0.9}));
      wrench.position.set(x-0.5, 1.05, 4); scene.add(wrench);
    });

    // Tire stacks
    var tireMat = new THREE.MeshStandardMaterial({color:0x111, roughness:0.95});
    function tireStack(ox, oz){
      for(var i=0;i<4;i++){
        var t = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.14, 10, 20), tireMat);
        t.rotation.x = Math.PI/2; t.position.set(ox, 0.38+i*0.32, oz); t.castShadow = true; scene.add(t);
      }
    }
    tireStack(-13, -6); tireStack(-13, -8); tireStack(13, -5);

    // Diagnostic computer stations
    function makeComputer(x, z, rot){
      var stand = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.1, 0.5), new THREE.MeshStandardMaterial({color:0x1a1a1a}));
      stand.position.set(x, 0.55, z); scene.add(stand);
      var screen = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.06), new THREE.MeshStandardMaterial({color:0x0a1628, emissive:0x1a4a8a, emissiveIntensity:0.6}));
      screen.position.set(x, 1.4, z); screen.rotation.y = rot||0; scene.add(screen);
      var kb = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.03, 0.2), new THREE.MeshStandardMaterial({color:0x222}));
      kb.position.set(x, 1.12, z+0.15); scene.add(kb);
    }
    makeComputer(-8, 5, 0.2); makeComputer(8, 6, -0.3);

    // Engine on stand
    var eng = new THREE.Group();
    var block = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 1.1), new THREE.MeshStandardMaterial({color:0x3a3a3a, metalness:0.7, roughness:0.35}));
    block.position.y = 1.0; block.castShadow = true; eng.add(block);
    var head = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.25, 1.05), new THREE.MeshStandardMaterial({color:0x2a2a2a, metalness:0.8}));
    head.position.y = 1.45; eng.add(head);
    // Pistons hint
    for(var p=0;p<4;p++){
      var cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.3, 12), new THREE.MeshStandardMaterial({color:0x555, metalness:0.9}));
      cyl.position.set(-0.3+p*0.2, 1.15, 0.3); eng.add(cyl);
    }
    eng.position.set(10, 0, -4); scene.add(eng);

    // Simple mechanic figures (stylized)
    function makeMechanic(x, z, color){
      var g = new THREE.Group();
      var body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.7, 12), new THREE.MeshStandardMaterial({color:color||0x2563eb}));
      body.position.y = 0.95; g.add(body);
      var head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), new THREE.MeshStandardMaterial({color:0xdbb891}));
      head.position.y = 1.5; g.add(head);
      var legL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.6, 8), new THREE.MeshStandardMaterial({color:0x1a1a2e}));
      legL.position.set(-0.1, 0.3, 0); g.add(legL);
      var legR = legL.clone(); legR.position.x = 0.1; g.add(legR);
      var armL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 8), new THREE.MeshStandardMaterial({color:color||0x2563eb}));
      armL.position.set(-0.35, 1.1, 0); armL.rotation.z = 0.3; g.add(armL);
      var armR = armL.clone(); armR.position.x = 0.35; armR.rotation.z = -0.3; g.add(armR);
      g.position.set(x, 0, z); scene.add(g); return g;
    }
    makeMechanic(-5.5, -3, 0x1e40af);
    makeMechanic(6, 1.5, 0xb45309);
    makeMechanic(-9, 4.5, 0x166534);

    // Ceiling industrial lights
    for(var lx=-8; lx<=8; lx+=4){
      for(var lz=-6; lz<=4; lz+=5){
        var lightMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.12, 0.35),
          new THREE.MeshStandardMaterial({color:0x111, emissive:0x6699ff, emissiveIntensity:0.9}));
        lightMesh.position.set(lx, 8.5, lz); scene.add(lightMesh);
        var pl = new THREE.PointLight(0xaaccff, 0.7, 14);
        pl.position.set(lx, 8.2, lz); scene.add(pl);
      }
    }
    // Amber accent
    scene.add(new THREE.PointLight(0xf59e0b, 0.5, 12).translateX(-10).translateY(3).translateZ(2));
    scene.add(new THREE.PointLight(0xf59e0b, 0.5, 12).translateX(10).translateY(3).translateZ(2));

    // Oil drums
    var drumMat = new THREE.MeshStandardMaterial({color:0x1a3a1a, metalness:0.4, roughness:0.5});
    for(var di=0;di<3;di++){
      var drum = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.9, 16), drumMat);
      drum.position.set(12, 0.45, -8+di*0.7); drum.castShadow = true; scene.add(drum);
    }

    // Ceiling
    var ceil = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshStandardMaterial({color:0x0a0a0a, roughness:1}));
    ceil.rotation.x = Math.PI/2; ceil.position.y = 9; scene.add(ceil);

    return scene;
  },

  /* Setup bloom post-processing */
  setupBloom: function(renderer, scene, camera, strength){
    if(typeof THREE.EffectComposer === 'undefined') return null;
    var composer = new THREE.EffectComposer(renderer);
    var renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);
    var bloom = new THREE.UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      strength || 0.45, 0.4, 0.85
    );
    composer.addPass(bloom);
    return composer;
  },

  /* Procedural detailed sports car fallback */
  makeDetailedCar: function(color){
    var g = new THREE.Group();
    var bodyMat = new THREE.MeshStandardMaterial({color:color||0x0a0a0a, metalness:0.9, roughness:0.18, envMapIntensity:1.5});
    var glassMat = new THREE.MeshPhysicalMaterial({color:0x88aacc, metalness:0, roughness:0.05, transmission:0.85, transparent:true, opacity:0.3, thickness:0.5});
    var chrome = new THREE.MeshStandardMaterial({color:0xdddddd, metalness:1, roughness:0.08});
    var rubber = new THREE.MeshStandardMaterial({color:0x111, roughness:0.9, metalness:0.05});
    var carbon = new THREE.MeshStandardMaterial({color:0x1a1a1a, metalness:0.6, roughness:0.4});

    // Lower body
    var lower = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.4, 4.4), bodyMat);
    lower.position.y = 0.5; lower.castShadow = true; g.add(lower);
    // Upper cabin
    var cabin = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.5, 2.1), bodyMat);
    cabin.position.set(0, 0.95, -0.15); cabin.castShadow = true; g.add(cabin);
    // Hood slope
    var hood = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.12, 1.3), bodyMat);
    hood.position.set(0, 0.72, 1.45); hood.rotation.x = -0.08; g.add(hood);
    // Trunk
    var trunk = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.15, 0.8), bodyMat);
    trunk.position.set(0, 0.72, -1.7); g.add(trunk);
    // Windshield
    var ws = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.48, 0.06), glassMat);
    ws.position.set(0, 1.0, 0.9); ws.rotation.x = -0.4; g.add(ws);
    // Side windows
    var swL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.4, 1.6), glassMat);
    swL.position.set(-0.85, 0.95, -0.1); g.add(swL);
    var swR = swL.clone(); swR.position.x = 0.85; g.add(swR);
    // Rear window
    var rw = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.4, 0.06), glassMat);
    rw.position.set(0, 0.98, -1.2); rw.rotation.x = 0.35; g.add(rw);
    // Spoiler
    var spoil = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 0.35), carbon);
    spoil.position.set(0, 1.15, -2.0); g.add(spoil);
    var spoilPostL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.25, 0.05), carbon);
    spoilPostL.position.set(-0.5, 1.0, -1.9); g.add(spoilPostL);
    var spoilPostR = spoilPostL.clone(); spoilPostR.position.x = 0.5; g.add(spoilPostR);
    // Wheels with more detail
    function wheel(x, z){
      var wg = new THREE.Group();
      var tire = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.28, 28), rubber);
      tire.rotation.z = Math.PI/2; tire.castShadow = true; wg.add(tire);
      var rim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.3, 16), chrome);
      rim.rotation.z = Math.PI/2; wg.add(rim);
      // Spokes
      for(var s=0;s<5;s++){
        var spoke = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.2, 0.03), chrome);
        spoke.position.y = 0.1; spoke.rotation.z = (s/5)*Math.PI*2; spoke.rotation.x = Math.PI/2;
        var sg = new THREE.Group(); sg.add(spoke); sg.rotation.y = (s/5)*Math.PI*2; wg.add(sg);
      }
      wg.position.set(x, 0.38, z); g.add(wg); return wg;
    }
    wheel(-0.9, 1.4); wheel(0.9, 1.4); wheel(-0.9, -1.4); wheel(0.9, -1.4);
    // Headlights
    var hlMat = new THREE.MeshStandardMaterial({color:0xe8f4ff, emissive:0xaaccff, emissiveIntensity:0.8});
    [-0.65, 0.65].forEach(function(x){
      var hl = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.18, 0.1), hlMat);
      hl.position.set(x, 0.55, 2.22); g.add(hl);
    });
    // LED strip
    var led = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.03, 0.04), new THREE.MeshStandardMaterial({color:0xffffff, emissive:0xffffff, emissiveIntensity:0.5}));
    led.position.set(0, 0.42, 2.22); g.add(led);
    // Taillights
    var tlMat = new THREE.MeshStandardMaterial({color:0xff1111, emissive:0xff0000, emissiveIntensity:1});
    [-0.7, 0.7].forEach(function(x){
      var tl = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.08), tlMat);
      tl.position.set(x, 0.58, -2.22); g.add(tl);
    });
    // Exhaust tips
    var exMat = new THREE.MeshStandardMaterial({color:0x888, metalness:1, roughness:0.2});
    [-0.4, 0.4].forEach(function(x){
      var ex = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.2, 12), exMat);
      ex.rotation.x = Math.PI/2; ex.position.set(x, 0.25, -2.25); g.add(ex);
    });
    // Side mirrors
    var mir = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 0.08), bodyMat);
    mir.position.set(-1.05, 0.95, 0.5); g.add(mir);
    var mirR = mir.clone(); mirR.position.x = 1.05; g.add(mirR);

    return g;
  }
};
})();
