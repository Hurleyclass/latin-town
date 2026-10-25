import * as THREE from 'three';
export class AudioSystem {
 constructor(camera){this.listener=new THREE.AudioListener();camera.add(this.listener);this.loader=new THREE.AudioLoader();this.cache=new Map();this.sources=new Map();}
 async unlock(){if(this.listener.context.state==='suspended')await this.listener.context.resume();}
 async play(object,url){try{await this.unlock();let pending=this.cache.get(url);if(!pending){pending=this.loader.loadAsync(url);this.cache.set(url,pending);}const buffer=await pending;let source=this.sources.get(object);if(!source){source=new THREE.PositionalAudio(this.listener);source.setRefDistance(2);source.setMaxDistance(18);source.setRolloffFactor(1);object.add(source);this.sources.set(object,source);}if(source.isPlaying)source.stop();source.setBuffer(buffer);source.setVolume(.85);source.play();return buffer.duration;}catch(error){console.warn('Sonus deest:',url,error);return 3;}}
}
