# Oppidum Latinum

A static Latin immersion town for desktop browsers and the Meta Quest browser. No build step or npm dependencies. Three.js 0.160.0 and its addons load through the import map from jsDelivr; an internet connection is required for those modules and the optional controller models.

Run from this directory:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000 and choose **INCIPE** to enable audio. On Quest, serve the files over **HTTPS** (WebXR requires a secure context; localhost is also allowed). Open that address in the Quest browser and choose **INTRA**. A plain LAN HTTP address can display the desktop view but cannot enter immersive VR.

Desktop: WASD moves, mouse looks after pointer lock, click replays speech, E grabs/drops the aimed item within 3 metres, Escape releases the pointer. Click the in-world **VERBA** sign to toggle Latin speech text.

Quest: left stick moves relative to the headset; right stick left/right snap turns. Hold the right trigger while aiming at empty space to preview a ballistic teleport arc, then release to teleport to the gold ring. Right stick forward also previews teleport and releasing it commits. Trigger on a character or item replays its speech. Grip grabs the aimed nearby item; release drops it. Items fall onto counters or ground. Both controllers support ray interaction and grabbing. Walking and teleportation avoid houses, counters, and the fountain.

Scenes begin within 6 metres of their anchor character, run in order, and pause before repeating. Leaving range pauses advancement; current speech finishes. Scripted conversations and individual tap responses use the same provider interface. Character gestures include waving, pointing, nodding, lifting an item, and offering a coin. Lifted objects are presentation props; counter items remain independently grabbable.

## Files

- `index.html`: Latin UI and pinned import map.
- `js/main.js`: startup and XR animation loop.
- `js/world.js`: town, signs, batched static meshes, goods and surfaces.
- `js/npc.js`: low-poly characters, arm gestures and speech bubbles.
- `js/scenes.js`: proximity scene sequencing and dialogue dispatch.
- `js/player.js`: desktop/XR locomotion, snap turns and teleportation.
- `js/interaction.js`: rays, grabbing, falling and replay.
- `js/audio.js`: cached positional audio and user-gesture audio unlock.
- `js/dialogue/ConversationProvider.js`: async provider interface, default scripted implementation and documented LLM stub.
- `js/config.js`: provider selection and movement/text options.
- `data/script.json`: single source for dialogue, scene order, tap lines and vocabulary.
- `audio/`: generated MP3 dialogue and vocabulary recordings.
- `tools/gen_audio.sh`: regenerates all recordings using installed espeak-ng and ffmpeg.

## Audio and providers

```sh
./tools/gen_audio.sh
```

Each dialogue line produces its specified `audio/<id>.mp3`; each unique vocabulary word produces `audio/vocab_<word>.mp3`. Speech uses `espeak-ng -v la -s 140` and FFmpeg MP3 quality 6. The synthesizer's Latin pronunciation is approximate. Replace the generator with ElevenLabs or another synthesis system while retaining IDs and paths. No external speech service is called by the game.

`respond({npcId, playerText, history})` resolves to `{text, audioUrl}`. Scripted scene calls pass the line ID as `playerText`. The LLM provider intentionally makes no API calls; implement a server endpoint before changing `CONFIG.provider` to `llm`. Keep keys server-side and constrain generated dialogue to Latin.

## Validation and limits

```sh
for f in js/*.js js/dialogue/*.js; do node --check "$f"; done
python3 -m json.tool data/script.json >/dev/null
```

Uses low-poly Lambert meshes, two lights, no shadows, capped pixel ratio, merged static geometry, and `setAnimationLoop`. The town is intentionally small; objects use simple vertical falling, without rigid-body collisions or throwing. Quest hardware testing is still required to establish actual frame rate and controller ergonomics. Controller model loading is handled by Three.js's controller model factory.
