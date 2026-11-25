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

export interface PoseAsset {
  image: ImageMetadata;
  clip?: string;
  // Dónde cae el clip dentro de la caja de la imagen fija, para que el
  // personaje quede del mismo tamaño y con los pies en el mismo sitio.
  box?: string;
}

export const poses = {
  hello: { image: hello, clip: helloClip, box: 'left:-0.14%;top:4.92%;width:73.04%;height:92.66%' },
  walk: { image: walk, clip: walkClip, box: 'left:18.14%;top:4.23%;width:67.46%;height:92.63%' },
  desk: { image: desk, clip: deskClip, box: 'left:18.57%;top:4.4%;width:64.38%;height:94.15%' },
  arms: { image: arms, clip: armsClip, box: 'left:29.93%;top:4.9%;width:40.49%;height:92.44%' },
  paper: { image: paper, clip: paperClip, box: 'left:25.64%;top:4.92%;width:49.2%;height:92.75%' },
  architect: {
    image: architect,
    clip: architectClip,
    box: 'left:19.33%;top:4.21%;width:62.19%;height:93.37%',
  },
  shield: { image: shield, clip: shieldClip, box: 'left:12.72%;top:5.01%;width:87.94%;height:92.57%' },
  keys: { image: keys, clip: keysClip, box: 'left:23.26%;top:4.92%;width:50.04%;height:92.57%' },
  // Sin clip por ahora: las dos animaciones generadas cambiaban la llave de mano.
  build: { image: build },
} satisfies Record<string, PoseAsset>;

export type Pose = keyof typeof poses;
