// Original, deterministic pixel-art assets. No downloaded artwork or runtime dependencies.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { createHash } from 'node:crypto';

const additions = JSON.parse(readFileSync(new URL('../src/data/catalogExpansion.json', import.meta.url), 'utf8'));
const entries = [{ id: 'orbit-raiders', name: 'Orbit Raiders' }, { id: 'neon-expansion', name: 'Neon Expansion' }, ...additions,
  { id: 'catalog-generic', name: 'PixelVault' }];
const width = 192, height = 108, scale = 4;
const rgb = (hex) => [hex >> 16 & 255, hex >> 8 & 255, hex & 255];
const mix = (a, b, t) => a.map((c, i) => Math.round(c + (b[i] - c) * t));
const palettes = [
  [0x071a35, 0x2c7b92, 0x8cf3db, 0x152e45, 0xffcc80],
  [0x15132e, 0x684b91, 0xff9ac7, 0x28304f, 0xfbdd95],
  [0x14223d, 0x647fab, 0xd2f1ff, 0x273a60, 0xffd195],
  [0x26182b, 0xa95150, 0xffce8b, 0x46304b, 0xffe8ab],
  [0x082c32, 0x367964, 0xc8e7a0, 0x163d3c, 0xffdb9a],
  [0x0c1231, 0x36377e, 0x7ae0fc, 0x20214b, 0xff7ba7],
];
function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) { crc ^= byte; for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0); }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, bytes) {
  const label = Buffer.from(type), size = Buffer.alloc(4), crc = Buffer.alloc(4);
  size.writeUInt32BE(bytes.length); crc.writeUInt32BE(crc32(Buffer.concat([label, bytes])));
  return Buffer.concat([size, label, bytes, crc]);
}
function png(pixels) {
  const w = width * scale, h = height * scale;
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const source = (Math.floor(y / scale) * width + Math.floor(x / scale)) * 3;
    const dest = y * (w * 3 + 1) + 1 + x * 3;
    pixels.copy(raw, dest, source, source + 3);
  }
  const header = Buffer.alloc(13); header.writeUInt32BE(w); header.writeUInt32BE(h, 4); header[8] = 8; header[9] = 2;
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk('IHDR', header), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
function render(entry) {
  let seed = createHash('sha256').update(entry.id).digest().readUInt32BE();
  const random = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return (seed >>> 0) / 4294967296; };
  const [top, bottom, light, dark, accent] = palettes[seed % palettes.length].map(rgb);
  const pixels = Buffer.alloc(width * height * 3);
  function pixel(x, y, color) { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= width || y >= height) return; const i = (y * width + x) * 3; pixels[i] = color[0]; pixels[i+1] = color[1]; pixels[i+2] = color[2]; }
  function rect(x, y, w, h, color) { for (let j = Math.max(0, Math.round(y)); j < Math.min(height, y+h); j++) for (let i = Math.max(0, Math.round(x)); i < Math.min(width, x+w); i++) pixel(i, j, color); }
  function circle(cx, cy, radius, color) { for (let y = -radius; y <= radius; y++) for (let x = -radius; x <= radius; x++) if (x*x+y*y <= radius*radius) pixel(cx+x, cy+y, color); }
  function polygon(points, color) {
    for (let y = 0; y < height; y++) {
      const cuts = [];
      for (let i = 0; i < points.length; i++) { const a = points[i], b = points[(i+1)%points.length]; if ((a[1] <= y && b[1] > y) || (b[1] <= y && a[1] > y)) cuts.push(a[0] + (y-a[1])*(b[0]-a[0])/(b[1]-a[1])); }
      cuts.sort((a,b)=>a-b); for(let i=0;i<cuts.length;i+=2) rect(Math.ceil(cuts[i]),y,Math.ceil(cuts[i+1])-Math.ceil(cuts[i]),1,color);
    }
  }
  for (let y=0;y<height;y++) rect(0,y,width,1,mix(top,bottom,y/height));
  for (let i=0;i<80;i++) { const x=Math.floor(random()*width), y=Math.floor(random()*65); pixel(x,y,mix(light,top,random()*0.6)); if(i%13===0) { pixel(x-1,y,light); pixel(x+1,y,light); pixel(x,y-1,light); pixel(x,y+1,light); } }
  const sunX=35+Math.floor(random()*120), sunY=19+Math.floor(random()*15);
  circle(sunX,sunY,13,light); circle(sunX+4,sunY-3,10,mix(light,bottom,0.35));
  const name=entry.name;
  const theme=/Orbit|Solar|Star|Comet|Celestial|Zenith/.test(name)?'space':/Harbor|Ocean|Coral|Tidal|Sunken/.test(name)?'sea':/Citadel|Keep|Knights|Bastion/.test(name)?'castle':/Circuit|Prism|Clockwork|Metro|Neon/.test(name)?'city':/Desert|Dunes|Canyon/.test(name)?'desert':/Skybound|Peaks|Glacier|Summit/.test(name)?'mountain':'forest';
  if(theme==='space') {
    circle(145,60,26,mix(bottom,dark,0.25));
    for(let y=44;y<79;y+=6) rect(122,y,45,2,mix(bottom,light,random()*0.4));
    polygon([[5,108],[5,94],[41,85],[69,98],[100,84],[144,96],[192,83],[192,108]],dark);
    polygon([[32,61],[64,44],[82,61],[64,57]],light); polygon([[45,60],[64,52],[74,60]],accent);
    rect(55,60,5,14,mix(accent,bottom,0.3)); rect(63,61,5,10,accent); rect(71,61,3,7,light);
    rect(106,83,6,20,light); rect(101,88,16,2,accent); rect(104,101,10,3,dark);
  } else if(theme==='city') {
    for(let x=0;x<192;x+=13) {const h=18+random()*43;rect(x,82-h,12,h,mix(dark,bottom,0.15));for(let y=86-h;y<79;y+=6)for(let k=2;k<10;k+=4)if(random()>0.35)rect(x+k,y,2,2,random()>0.5?light:accent);}
    rect(0,83,192,25,dark); polygon([[64,108],[91,83],[110,83],[153,108]],mix(dark,bottom,0.3));
    for(let y=87;y<108;y+=7)rect(99,y,3,3,accent);
    rect(12,49,38,13,accent);rect(15,52,32,7,dark);rect(17,54,15,3,light);
    rect(145,66,26,4,light);rect(149,70,18,6,accent);rect(151,76,4,3,dark);rect(163,76,4,3,dark);
  } else if(theme==='sea') {
    polygon([[0,75],[0,64],[20,40],[46,67],[75,54],[100,75]],dark); polygon([[145,77],[169,47],[192,65],[192,80]],dark);
    rect(0,76,192,32,mix(bottom,top,0.4));
    for(let i=0;i<90;i++)rect(random()*192,79+random()*28,3+random()*13,1,random()>0.8?light:mix(light,bottom,0.6));
    polygon([[65,81],[105,81],[98,89],[73,89]],accent); rect(82,45,2,35,dark); polygon([[85,48],[85,76],[107,76]],light);polygon([[80,55],[80,76],[68,76]],mix(light,bottom,0.2));
    rect(153,58,5,21,light);rect(151,55,9,4,accent);polygon([[150,55],[163,55],[156,49]],dark);
  } else {
    for(let layer=0;layer<3;layer++) {
      const pts=[[0,108],[0,65+layer*12]];for(let x=0;x<=220;x+=28)pts.push([x,37+layer*15+random()*23]);pts.push([192,108]);polygon(pts,mix(bottom,dark,0.25+layer*0.25));
    }
    if(theme==='castle') {
      rect(65,51,66,43,dark);rect(60,44,15,48,dark);rect(121,44,15,48,dark);
      for(let x=60;x<136;x+=10)rect(x,40,6,12,dark);
      for(const x of [66,88,108,126])rect(x,57,3,10,accent);
      circle(98,84,9,top);rect(89,83,19,16,top);rect(136,36,1,30,light);polygon([[137,36],[155,40],[137,45]],accent);
    } else if(theme==='forest') {
      for(let i=0;i<12;i++){const x=i*18-9, y=65+random()*20,h=18+random()*18;rect(x+5,y,3,35,dark);polygon([[x-4,y+15],[x+7,y-h],[x+20,y+15]],mix(dark,light,i%3===0?0.25:0.08));}
      polygon([[75,108],[91,81],[100,80],[122,108]],mix(accent,dark,0.55));circle(96,70,3,accent);rect(93,73,6,10,light);rect(92,82,3,6,dark);rect(97,82,3,6,dark);
      for(let i=0;i<16;i++)circle(random()*192,85+random()*22,1,accent);
    } else if(theme==='desert') {
      polygon([[0,108],[0,89],[54,78],[118,99],[166,85],[192,92],[192,108]],mix(accent,dark,0.45));
      rect(48,60,12,34,dark);rect(34,69,18,7,dark);rect(33,58,6,14,dark);rect(55,65,18,7,dark);rect(68,52,5,17,dark);
      rect(130,77,16,17,dark);rect(128,76,20,3,light);rect(136,80,3,7,accent);
    } else {
      polygon([[58,64],[83,21],[114,67]],mix(dark,bottom,0.4));polygon([[69,45],[83,21],[98,46],[84,39],[78,46]],light);
      polygon([[104,86],[133,40],[168,89]],dark);polygon([[119,63],[133,40],[149,65],[133,58]],mix(light,bottom,0.2));
      polygon([[0,108],[72,91],[128,108]],mix(light,bottom,0.45));rect(96,83,3,16,accent);polygon([[99,84],[111,88],[99,91]],light);
    }
  }
  // Foreground framing and a small visual signature keep the art coherent across the set.
  rect(0,104,192,4,top);rect(8,9,3,11,accent);rect(11,9,6,3,accent);rect(11,13,4,3,accent);
  for(let i=0;i<5;i++)rect(169+i*3,99-i%2,2,2,light);
  return png(pixels);
}
const folder = new URL('../assets/covers/', import.meta.url); mkdirSync(folder, { recursive: true });
for (const entry of entries) writeFileSync(new URL(`${entry.id}.png`, folder), render(entry));
const imports = entries.map((entry,i)=>`import cover${i} from '../../assets/covers/${entry.id}.png';`).join('\n');
const sources = entries.filter((entry)=>entry.id!=='catalog-generic').map((entry,i)=>`  '${entry.id}': cover${i},`).join('\n');
writeFileSync(new URL('../src/data/catalogCovers.js', import.meta.url), `// Generated by scripts/generate-catalog-covers.mjs. Original local illustrations.\n${imports}\n/** @type {Record<string, import('react-native').ImageSourcePropType>} */\nconst covers = {\n${sources}\n};\nexport function coverForProduct(id) { return Object.hasOwn(covers, id) ? covers[id] : cover${entries.length - 1}; }\n`);
console.log(`${entries.length} original PNG covers generated (768x432).`);
