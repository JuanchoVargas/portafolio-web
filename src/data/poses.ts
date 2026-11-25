// Las poses del personaje: la imagen fija de cada una y, encima, su clip.
import type { ImageMetadata } from 'astro';
import hello from '../assets/personaje/01-saludo.png';
import arms from '../assets/personaje/04-brazos-cruzados.png';
import walk from '../assets/personaje/07-caminando.png';
import desk from '../assets/personaje/08-sentado.png';
import paper from '../assets/personaje/09-entregando.png';
import architect from '../assets/personaje/12-arquitecto.png';
import shield from '../assets/personaje/13-seguridad.png';
import keys from '../assets/personaje/14-roles.png';
import build from '../assets/personaje/15-obra.png';
import helloClip from '../assets/personaje/01-saludo.webm';
import armsClip from '../assets/personaje/04-brazos-cruzados.webm';
import walkClip from '../assets/personaje/07-caminando.webm';
import deskClip from '../assets/personaje/08-sentado.webm';
import paperClip from '../assets/personaje/09-entregando.webm';
import architectClip from '../assets/personaje/12-arquitecto.webm';
import shieldClip from '../assets/personaje/13-seguridad.webm';
import keysClip from '../assets/personaje/14-roles.webm';
import buildClip from '../assets/personaje/15-obra.webm';

export interface PoseAsset {
  image: ImageMetadata;
  clip: string;
  // Dónde cae el clip dentro de la caja de la imagen fija, para que el
  // personaje quede del mismo tamaño y con los pies en el mismo sitio.
  box: string;
}

export const poses = {
  hello: { image: hello, clip: helloClip, box: 'left:16.25%;top:4.33%;width:57.99%;height:93.61%' },
  walk: { image: walk, clip: walkClip, box: 'left:1.32%;top:4.65%;width:83.03%;height:91.64%' },
  desk: { image: desk, clip: deskClip, box: 'left:15.51%;top:6.54%;width:62.58%;height:90.98%' },
  arms: { image: arms, clip: armsClip, box: 'left:29.93%;top:4.9%;width:40.49%;height:92.44%' },
  paper: { image: paper, clip: paperClip, box: 'left:-0.12%;top:3.33%;width:99.79%;height:95.08%' },
  architect: {
    image: architect,
    clip: architectClip,
    box: 'left:18.87%;top:4.3%;width:62.97%;height:94.33%',
  },
  shield: { image: shield, clip: shieldClip, box: 'left:7.4%;top:4.35%;width:73.76%;height:92.99%' },
  keys: { image: keys, clip: keysClip, box: 'left:16.77%;top:4.56%;width:58.83%;height:94%' },
  build: { image: build, clip: buildClip, box: 'left:24.28%;top:3.9%;width:52.23%;height:94.47%' },
} satisfies Record<string, PoseAsset>;

export type Pose = keyof typeof poses;
