import test from 'node:test';
import assert from 'node:assert/strict';
import {monitorTimeline} from '../src/monitor-scene.js';
test('the monitor adds four full viewports of reading with a stationary story camera',()=>{
 const top=2400,height=5400;
 for(const y of [top+901,top+1800,top+2700,top+3600,top+4499])assert.equal(monitorTimeline(y,top,height).story,3.74);
 assert.equal(monitorTimeline(top,top,height).story,3.64);
 assert.equal(monitorTimeline(top+height,top,height).story,4);
});
test('three monitor pages remain reversible and independent of time',()=>{
 const sample=y=>monitorTimeline(y,0,6000);
 assert.deepEqual([1200,2600,4200,2600,1200].map(y=>sample(y).beat),[0,1,2,1,0]);
 assert.equal(sample(-1).active,false);assert.equal(sample(6000).active,false);
});
