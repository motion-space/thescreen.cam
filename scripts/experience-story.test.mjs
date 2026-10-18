import assert from 'node:assert/strict';
import test from 'node:test';
import { CAPTION, CAPTION_CLIPS, CHAPTERS, RECORDING_DURATION, STORY, tourTimeAt } from '../src/components/experience/story-timing.ts';

test('the tour clock advances continuously through every chapter boundary', () => {
  let previous = tourTimeAt(0);
  for (let step = 1; step <= 10000; step++) {
    const current = tourTimeAt(step / 10000);
    assert.ok(current >= previous, `recording rewound at scroll ${step / 10000}`);
    assert.ok(current - previous < 0.03, `recording jumped at scroll ${step / 10000}`);
    previous = current;
  }
  for (const chapter of CHAPTERS) {
    for (const progress of [chapter.from, ...chapter.scrub, chapter.to]) {
      assert.ok(Math.abs(tourTimeAt(progress + 1e-8) - tourTimeAt(progress - 1e-8)) < 0.00001);
    }
  }
});

test('chapter entry and exit match their intended recording times in either scroll direction', () => {
  for (const chapter of [...CHAPTERS].reverse()) {
    assert.ok(Math.abs(tourTimeAt(chapter.scrub[1]) - chapter.time[1]) < 1e-10);
    assert.ok(Math.abs(tourTimeAt(chapter.scrub[0]) - chapter.time[0]) < 1e-10);
  }
});

test('narration finishes before comment typing and camera removal', () => {
  const lens = CHAPTERS.find(ch => ch.key === 'lens');
  const captions = CHAPTERS.find(ch => ch.key === 'captions');
  const keyboard = CHAPTERS.find(ch => ch.key === 'keyboard');
  const camera = CHAPTERS.find(ch => ch.key === 'camera');
  assert.ok(lens.time[1] <= CAPTION.start - CAPTION.fade);
  assert.ok(captions.time[0] <= CAPTION.start - CAPTION.fade + 1e-10);
  assert.ok(captions.time[1] >= CAPTION.end + CAPTION.fade - 1e-10);
  assert.ok(keyboard.time[0] < STORY.focusComment);
  assert.ok(STORY.focusComment < STORY.typeStart && STORY.typeStart < STORY.submit);
  assert.ok(STORY.submit + 0.36 < keyboard.time[1]);
  assert.ok(camera.time[0] < STORY.cameraSplit && STORY.cameraSplit < camera.time[1]);
  assert.ok(camera.time[1] < STORY.closeDetail && STORY.closeDetail < RECORDING_DURATION);
  assert.ok(CAPTION_CLIPS.every(([start, end]) => start >= captions.time[0] && end <= captions.time[1]));
});

test('screenshot holds its capture frame throughout annotation', () => {
  const shot = CHAPTERS.at(-1);
  for (const progress of [shot.from, ...shot.scrub, 0.86, 0.94, shot.to]) {
    assert.equal(tourTimeAt(progress), shot.time[0]);
  }
});


test('the recording stays compact and chapter transitions never park the playhead', () => {
  assert.equal(RECORDING_DURATION, 24);
  for (let i = 1; i < CHAPTERS.length; i++) {
    const previous = CHAPTERS[i - 1];
    const next = CHAPTERS[i];
    const gap = next.time[0] - previous.time[1];
    assert.ok(gap > 0 && gap <= 1, `${next.key} must advance through its framing transition without a long wait`);
    const midpoint = (previous.scrub[1] + next.scrub[0]) / 2;
    assert.ok(tourTimeAt(midpoint) > previous.time[1]);
    assert.ok(tourTimeAt(midpoint) < next.time[0]);
  }
  assert.ok(STORY.focusComment - (CAPTION.end + CAPTION.fade) < 0.2);
  assert.ok(STORY.typeStart - STORY.focusComment <= 0.25);
});
