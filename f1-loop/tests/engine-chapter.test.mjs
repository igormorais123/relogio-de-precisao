import test from 'node:test';
import assert from 'node:assert/strict';
import {ENGINE_LESSONS,engineBeat,engineChapterMarkup} from '../src/engine/chapter.js';
test('the engine lesson revisits its three parts in either scroll direction',()=>{
 assert.equal(ENGINE_LESSONS.length,3);
 assert.deepEqual([.35,.58,.82,.58,.35].map(engineBeat),[0,1,2,1,0]);
});
test('the seventh chapter provides readable content without WebGL',()=>{
 const html=engineChapterMarkup();assert.match(html,/id="motor-do-loop"/);
 for(const lesson of ENGINE_LESSONS){assert.ok(html.includes(lesson.title));assert.ok(html.includes(lesson.text));}
});
