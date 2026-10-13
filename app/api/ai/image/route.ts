import {NextRequest,NextResponse} from 'next/server';
import {timingSafeEqual} from 'node:crypto';

export const runtime='nodejs';
export const maxDuration=120;

function authorized(a:string,b:string){
  const x=Buffer.from(a),y=Buffer.from(b);
  return x.length===y.length&&timingSafeEqual(x,y);
}
export async function POST(request:NextRequest){
  if(!process.env.OPENAI_API_KEY)return NextResponse.json({error:'OPENAI_API_KEY is missing.'},{status:503});
  if(!process.env.STUDIO_ACCESS_CODE)return NextResponse.json({error:'Set STUDIO_ACCESS_CODE to protect image generation.'},{status:503});
  let input:Record<string,unknown>;
  try{
    const raw=await request.text();
    if(raw.length>3500)throw Error('too large');
    input=JSON.parse(raw);
    if(!input||typeof input!=='object'||Array.isArray(input))throw Error('invalid');
  }catch{return NextResponse.json({error:'Invalid request.'},{status:400})}
  if(typeof input.accessCode!=='string'||!authorized(input.accessCode,process.env.STUDIO_ACCESS_CODE)){
    return NextResponse.json({error:'Incorrect studio access code.'},{status:401});
  }
  const prompt=typeof input.prompt==='string'?input.prompt.trim():'';
  if(prompt.length<10||prompt.length>450)return NextResponse.json({error:'Image prompt must be 10–450 characters.'},{status:400});
  let response:Response;
  try{
    response=await fetch('https://api.openai.com/v1/images/generations',{
      method:'POST',
      headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:process.env.OPENAI_IMAGE_MODEL||'gpt-image-1',
        size:'1536x1024',
        quality:'low',
        output_format:'webp',
        output_compression:70,
        n:1,
        prompt:'Generate a single landscape 3:2 illustration to be used as a BACKGROUND plate for a vocabulary teaching motion graphic. Flat 2D vector cartoon aesthetic, tasteful pastel palette, clean geometric shapes, clear composition, generous uncluttered center area where animated SVG characters will be placed later. No text, no words, no letters, no watermarks, no logos. Scene direction: '+prompt
      }),
      signal:AbortSignal.timeout(105000)
    });
  }catch{return NextResponse.json({error:'Image service timed out or could not be reached.'},{status:502})}
  if(!response.ok){
    return NextResponse.json({error:response.status===429?'Image API quota or rate limit reached.':'Image generation failed. Check image model access, verification and billing.',status:response.status},{status:502});
  }
  try{
    const result=await response.json();
    const b64=result?.data?.[0]?.b64_json;
    if(typeof b64!=='string'||b64.length>3400000||b64.length<1000)throw Error('invalid image');
    return NextResponse.json({imageDataUrl:'data:image/webp;base64,'+b64},{headers:{'Cache-Control':'no-store'}});
  }catch{return NextResponse.json({error:'Image result was invalid or too large.'},{status:502})}
}
