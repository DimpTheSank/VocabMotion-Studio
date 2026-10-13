import {bundle} from '@remotion/bundler';
import {getCompositions,renderMedia} from '@remotion/renderer';
import {readFile,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';

const input=path.resolve(process.argv[2]||'sample-lesson.json');
const output=path.resolve(process.argv[3]||'out/demo.mp4');
const payload=JSON.parse(await readFile(input,'utf8'));
const storyboard=payload.storyboard;
const inputProps=storyboard?{storyboard}:{lesson:payload};
const compositionId=storyboard?'StoryboardLesson':'VocabLesson';
await mkdir(path.dirname(output),{recursive:true});
const serveUrl=await bundle({
  entryPoint:path.resolve('remotion/index.tsx'),
  outDir:path.join(tmpdir(),'vocabmotion-remotion-bundle-'+process.pid)
});
const compositions=await getCompositions(serveUrl,{inputProps});
const composition=compositions.find((c)=>c.id===compositionId);
if(!composition)throw new Error(compositionId+' composition not found');
await renderMedia({
  serveUrl,
  composition,
  codec:'h264',
  outputLocation:output,
  inputProps
});
console.log('Rendered MP4:',output);
