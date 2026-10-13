import {NextRequest,NextResponse} from 'next/server';
import {spawn} from 'node:child_process';
import {mkdtemp,readFile,rm,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';

export const runtime='nodejs';
export const maxDuration=300;

function runRenderer(input:string,output:string):Promise<void>{
  return new Promise((resolve,reject)=>{
    const script=path.join(process.cwd(),'scripts','render.mjs');
    const child=spawn(process.execPath,[script,input,output],{
      cwd:process.cwd(),
      env:process.env,
      stdio:['ignore','ignore','pipe']
    });
    let errors='';
    child.stderr.on('data',(chunk:Buffer)=>{errors=(errors+chunk.toString()).slice(-6000)});
    child.on('error',reject);
    child.on('close',(code)=>code===0?resolve():reject(new Error(errors||`Renderer exited with code ${code}`)));
  });
}

export async function POST(req:NextRequest){
  // Vercel builds the editor only. Rendering needs a separate Node worker.
  if(process.env.VERCEL){
    return NextResponse.json({error:'MP4 export is available in local Node only. A cloud rendering worker is not configured yet.'},{status:501});
  }
  let lesson:unknown;
  try{lesson=await req.json()}catch{return NextResponse.json({error:'Invalid JSON'},{status:400})}
  const payload=lesson as Record<string,unknown>|null;
  const storyboard=payload?.storyboard as Record<string,unknown>|undefined;
  const isStoryboard=!!storyboard&&Array.isArray(storyboard.scenes)&&storyboard.scenes.length===5
    &&storyboard.scenes.every((s:unknown)=>{
      if(!s||typeof s!=='object')return false;
      const scene=s as Record<string,unknown>;
      return typeof scene.title==='string'&&typeof scene.caption==='string'
        &&typeof scene.narration==='string'&&['journey','chart','dialogue','process'].includes(String(scene.style))
        &&typeof scene.blocked==='boolean'&&Number.isInteger(scene.seconds)
        &&Number(scene.seconds)>=3&&Number(scene.seconds)<=10;
    });
  const isLesson=!!payload&&typeof payload.word==='string'&&typeof payload.example==='string';
  if(!isLesson&&!isStoryboard){
    return NextResponse.json({error:'Invalid lesson'},{status:400});
  }
  const dir=await mkdtemp(path.join(tmpdir(),'vocabmotion-'));
  try{
    const input=path.join(dir,'lesson.json');
    const output=path.join(dir,'output.mp4');
    await writeFile(input,JSON.stringify(lesson),'utf8');
    await runRenderer(input,output);
    return new NextResponse(new Uint8Array(await readFile(output)),{
      headers:{'Content-Type':'video/mp4','Content-Disposition':'attachment; filename="vocabmotion.mp4"'}
    });
  }catch(e){
    return NextResponse.json({error:e instanceof Error?e.message:'Render failed'},{status:500});
  }finally{
    await rm(dir,{recursive:true,force:true});
  }
}
