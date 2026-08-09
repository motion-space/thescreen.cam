# Click sound v2 source preparation

The v1 WAV files contain a physical mouse-down transient, a recorded hold interval, and a physical mouse-up transient. The v2 source files separate those transients so clients can schedule them at the actual input event times.

The split points were selected from 1 ms and 5 ms RMS envelopes and verified against the stereo waveforms. They intentionally remove the recorded hold interval while retaining each device's full mechanical decay.

| ID | Down window | Up window | Output fade |
| --- | ---: | ---: | --- |
| `magic-mouse` | 42–65 ms | 192–245 ms | 2 ms out |
| `magic-trackpad` | 25–185 ms | 250–308 ms | 2 ms down out; 4 ms up out |
| `mx-master` | 42–80 ms | 203–268 ms | 2 ms out |
| `game-mouse-1` | 0–100 ms | 112–141 ms | 0.5 ms down in; 2 ms out |
| `game-mouse-2` | 0–100 ms | 120–141 ms | 0.5 ms down in; 2 ms out |
| `angrymiao` | 40–105 ms | 145–195 ms | 2 ms out |

All outputs retain their source sample rate, stereo channels, and 16-bit PCM encoding. No denoising, EQ, compression, or loudness normalization is applied. The short fades only make non-silent edit boundaries continuous and do not change the relative down/up levels.

The source and public copies are connected by `content/click-sounds/sounds.json` and `scripts/build-click-sounds.mjs`. Run `npm run click-sounds:build` after changing a phase source; the generated v2 manifest contains the output duration, byte size, and SHA-256 hash.
