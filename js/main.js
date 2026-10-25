import * as THREE from 'three';
import {VRButton} from 'three/addons/webxr/VRButton.js';
import {CONFIG} from './config.js';
import {buildWorld} from './world.js';
import {createNPC,updateNPC} from './npc.js';
import {AudioSystem} from './audio.js';
import {SceneDirector} from './scenes.js';
import {Player} from './player.js';
import {Interaction} from './interaction.js';
import {ScriptedProvider,LLMProvider} from './dialogue/ConversationProvider.js';
async function main(){const response=await fetch('data/script.json');if(!response.ok)throw new Error('Scriptum deest');const data=await response.json();const scene=new THREE.Scene();const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.xr.enabled=true;renderer.outputColorSpace=THREE.SRGBColorSpace;document.body.appendChild(renderer.domElement);const camera=new THREE.PerspectiveCamera(70,innerWidth/innerHeight,.05,65);const world=buildWorld(scene,data);const npcs={};for(const [id,x,z,color] of [['caupo',-6,-3.65,'#a95d44'],['hospes',-5,-1,'#d2bf87'],['mercator',6,-3.65,'#75835d'],['emptor',6,-.8,'#8c7190'],['viator',-2,2,'#718e9b']])npcs[id]=createNPC(scene,id,x,z,color);npcs.hospes.root.rotation.y=Math.PI;npcs.emptor.root.rotation.y=Math.PI;
for(const npc of Object.values(npcs))world.targets[npc.id]=npc.root;
const player=new Player(renderer,scene,camera,world,CONFIG);const audio=new AudioSystem(camera);const provider=CONFIG.provider==='llm'?new LLMProvider():new ScriptedProvider(data);const director=new SceneDirector(data,npcs,world,audio,provider,CONFIG);const interaction=new Interaction(player,world,npcs,director,audio,CONFIG);
const button=VRButton.createButton(renderer);document.body.appendChild(button);const translate=()=>{const english=button.textContent;let latin=renderer.xr.isPresenting?'EXI':'INTRA';if(/NOT SUPPORTED|NOT ALLOWED|NEEDS HTTPS/i.test(english))latin='VR NON SUPPORTATUR';if(button.textContent!==latin)button.textContent=latin;};new MutationObserver(translate).observe(button,{childList:true,characterData:true,subtree:true});translate();if(button.tagName==='A')button.textContent='VR NON SUPPORTATUR';
const begin=async()=>{await audio.unlock();document.getElementById('intro').style.display='none';document.getElementById('status').textContent='Audi et disce.';};document.getElementById('start').addEventListener('click',async()=>{await begin();renderer.domElement.requestPointerLock();});renderer.xr.addEventListener('sessionstart',()=>{begin();if(document.pointerLockElement)document.exitPointerLock();});
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});let previous=0;const position=new THREE.Vector3();renderer.setAnimationLoop(ms=>{const t=ms/1000,dt=Math.min(.05,Math.max(0,t-previous));previous=t;player.update(dt);interaction.update(dt);const head=renderer.xr.isPresenting?renderer.xr.getCamera(camera):camera;head.getWorldPosition(position);if(audio.listener.context.state==='running')director.update(performance.now()/1000,position);for(const npc of Object.values(npcs))updateNPC(npc,performance.now()/1000,position,CONFIG.showText);renderer.render(scene,camera);});
// Read-only diagnostics for smoke tests and performance inspection.
window.oppidum={renderer,scene,player,world,npcs,director,interaction};}
main().catch(error=>{console.error(error);document.getElementById('status').textContent='Oppidum aperiri non potest.';});
