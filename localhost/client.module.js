
import {
    f_add_css,
    f_s_css_prefixed,
    o_variables, 
    f_s_css_from_o_variables
} from "https://deno.land/x/f_add_css@2.0.0/mod.js"

import {
    f_o_html__and_make_renderable,
}
from './f_o_html_from_o_js.module.js'
// from 'https://deno.land/x/f_o_html_from_o_js@5.0.0/mod.js'

// import { Midi } from 'https://cdnjs.cloudflare.com/ajax/libs/tone/15.1.3/Tone.min.js';
// import { Midi } from 'https://unpkg.com/tone@15.0.4/build/Tone.js';
// import * as Tone from 'https://cdn.jsdelivr.net/npm/tone/build/Tone.js';
// import { Midi } from 'https://cdn.jsdelivr.net/npm/@tonejs/midi@2.0.27/build/Midi.min.js';
import "https://unpkg.com/tone@15.0.4/build/Tone.js"

console.log(Midi)

let o_mod_notifire = await import('https://deno.land/x/f_o_html_from_o_js@5.0.0/localhost/jsh_modules/notifire/mod.js');

function createNestedProxy(target, path = '', callback) {
    const handler = {
      get(obj, prop) {
        if (prop === '_raw') {
          // Expose the raw object (DOM node or other proxied object)
          return obj;
        }
  
        const value = obj[prop];
        
        // Bind DOM methods to their original context
        if (typeof value === 'function') {
          return value.bind(obj);
        }
  
        // Recursively wrap nested objects/arrays
        if (typeof value === 'object' && value !== null) {
          return createNestedProxy(value, `${path}${Array.isArray(obj) ? `[${prop}]` : `.${prop}`}`, callback);
        }
  
        return value;
      },
      set(obj, prop, value) {
        const fullPath = `${path}${Array.isArray(obj) ? `[${prop}]` : `.${prop}`}`;
        const oldValue = obj[prop];
        const newValue = value;
  
        if (oldValue !== newValue) {
          callback(fullPath, oldValue, newValue);
        }
  
        // Apply the change
        obj[prop] = value;
        return true;
      },
    };
  
    return new Proxy(target, handler);
  }
import {
    f_o_webgl_program,
    f_delete_o_webgl_program,
    f_resize_canvas_from_o_webgl_program,
    f_render_from_o_webgl_program
} from "https://deno.land/x/handyhelpers@5.0.0/mod.js"

import {
    f_s_hms__from_n_ts_ms_utc,
} from "https://deno.land/x/date_functions@2.0.0/mod.js"  

let a_o_shader = []
let n_idx_a_o_shader = 0;
let o_state = {
    n_tracks: 2,
    s_f_n_idx__distribution: `
    
      // random
      let n_idx_new = parseInt(Math.random()*o_state.a_o_midi.length);
      // modulo 
      n_idx_new = n_idx%o_state.a_o_midi.length;
      return n_idx_new;
    
    
    `,
    o_shader: {},
    // o_state_notifire: {},
    n_idx_a_o_shader,
    a_o_shader,
    a_o_midi:[],
    o_midi: null,
  
}
o_state = createNestedProxy(o_state, '', (path, oldValue, newValue) => {
    console.log(`Path: ${path}, Old Value: ${oldValue}, New Value: ${newValue}`);
    let o_el = document.querySelector(`[s_prop_sync="${path.slice(1)}"]`);
    console.log(o_el);
    if(o_el){
        o_el.value = newValue
    }
});


globalThis.o_state = o_state
o_variables.n_rem_font_size_base = 1. // adjust font size, other variables can also be adapted before adding the css to the dom
o_variables.n_rem_padding_interactive_elements = 0.5; // adjust padding for interactive elements 
f_add_css(
    `
    body{
        min-height: 100vh;
        min-width: 100vw;
        /* background: rgba(0,0,0,0.84);*/
        display:flex;
        justify-content:center;
        align-items:flex-start;
    }
    canvas{
        width: 100%;
        height: 100%;
        position:fixed;
        z-index:-1;
    }
    #o_el_time{
        margin:1rem;
        background: rgba(0, 0, 0, 0.4);
        padding: 1rem;
    }
    ${
        f_s_css_from_o_variables(
            o_variables
        )
    }
    `
);


let f_download_midi_files = function(){
  for(let o_midi of o_state.a_o_midi){
     // Convert the MIDI to binary data
     const a_n_u8 = o_midi.toArray();

     // Create a Blob for the MIDI file
     const o_blob = new Blob([a_n_u8], { type: 'audio/midi' });

     // Create a download link and trigger the download
     const url = URL.createObjectURL(o_blob);
     const o_el_a = document.createElement('a');
     o_el_a.href = url;
     o_el_a.download = 'example.mid'; // Name of the file
     document.body.appendChild(o_el_a);
     o_el_a.click();

     // Clean up the URL object
     URL.revokeObjectURL(url);
  }
}
document.body.appendChild(
    await f_o_html__and_make_renderable(
        {
            style: "width:100vw; height: 100vh;",
            a_o: [
                {
                    innerText: "Hello",
                },
                {
                    s_tag: "input",
                    type: "number", 
                    s_prop_sync: 'n_tracks',
                },
                {
                  s_tag: "textarea", 
                  s_prop_sync: 's_f_n_idx__distribution'
                },
                {
                  s_tag: 'button', 
                  innerText: "generate", 
                  onclick: ()=>{
                    //create n new midi tracks
                    o_state.a_o_midi = new Array(o_state.n_tracks).fill(0).map((n, n_idx)=>{
                        const o_midi = new Midi();
                        const o_track = o_midi.addTrack();
                        return o_midi;
                    });

                    let f_n_idx__distribution = new Function('o_state', 'n_idx',o_state.s_f_n_idx__distribution);
                    for(let n_idx in o_state.o_midi.tracks[0].notes){
                      let o_note = o_state.o_midi.tracks[0].notes[n_idx];
                       let n_idx_new = f_n_idx__distribution(o_state, n_idx);
                       console.log(n_idx_new)
                      o_state.a_o_midi[n_idx_new].tracks[0].addNote(
                        {
                          midi: o_note.midi,
                          time: o_note.time,
                          duration: o_note.duration,
                          velocity: o_note.velocity
                        }
                      )
                    }
                    //download new midi files
                    f_clear_canvas();
                    for(let o_midi of o_state.a_o_midi){
                      let n_idx = o_state.a_o_midi.indexOf(o_midi);
                      let n_idx_nor = n_idx / o_state.a_o_midi.length;
                      f_visualize_midi(o_midi, `hsl(${n_idx_nor*360}, 100%, 50%)`);
                    }
                    f_download_midi_files();
                  }
                },
                // o_mod_notifire.f_o_js(o_state.o_state_notifire),
                {
                    s_tag: "input",
                    type: 'file',
                    onchange: (o_e)=>{
                        const file = o_e.target.files[0];
                        if (!file) {
                          alert('No file selected!');
                          return;
                        }
                  
                        const reader = new FileReader();
                  
                        // When the file is loaded, parse it as MIDI
                        reader.onload = async function (e) {
                          const arrayBuffer = e.target.result;
                          o_state.o_midi = new Midi(arrayBuffer);
                  
                          // // Example: Play the first track using Tone.js
                          // const synth = new Tone.PolySynth(Tone.Synth).toDestination();
                          // await Tone.start();
                          // Tone.Transport.start();
                  
                          // midi.tracks.forEach(track => {
                          //   track.notes.forEach(note => {
                          //     synth.triggerAttackRelease(note.name, note.duration, note.time);
                          //   });
                          // });
                          f_clear_canvas();
                          f_visualize_midi(o_state.o_midi, 'red');

                        };
                  
                        // Read the file as an ArrayBuffer
                        reader.readAsArrayBuffer(file);
                  
                    }
                }, 
                {
                  s_tag: "canvas", 
                  id: "piano-roll",
                  style: "position:fixed; z-index:-1; width:100%; height:100%;top:0;left:0;"
                }
            ]
        }
    )
)
// o_mod_notifire.f_o_throw_notification(o_state.o_state_notifire,'hello!')

function setByPath(obj, path, value) {
    const pathParts = path.match(/([^[.\]]+)/g); // Split the path into parts (e.g., ['a', 'b', '3', 'c', 'd'])
  
    let current = obj;
  
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
  
      // If it's the last part, set the value
      if (i === pathParts.length - 1) {
        current[part] = value;
        return;
      }
  
      // Determine if the next level should be an array or object
      const nextPart = pathParts[i + 1];
      if (!current[part]) {
        current[part] = /^\d+$/.test(nextPart) ? [] : {}; // Create array if next part is a number, otherwise create object
      }
  
      current = current[part];
    }
  }

  
let f_input_change = function(o_e){ 
    let s_prop_sync = (o_e.target.getAttribute('s_prop_sync'));
    if(s_prop_sync){
        let v = o_e.target.value;
        if(o_e.target.type == 'number'){
            v = parseFloat(v);
        }
        setByPath(o_state, s_prop_sync, v)
    }
}

      // Attach listeners to all inputs
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', f_input_change);  // For live updates
    input.addEventListener('change', f_input_change); // For committed changes
});
document.querySelectorAll('textarea').forEach(input => {
  input.addEventListener('input', f_input_change);  // For live updates
  input.addEventListener('change', f_input_change); // For committed changes
});

function f_clear_canvas() {
  const canvas = document.getElementById('piano-roll');
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function f_visualize_midi(midi, baseColor = '#000000') {
  const canvas = document.getElementById('piano-roll');
  const ctx = canvas.getContext('2d');

  // Canvas dimensions
  const width = canvas.width;
  const height = canvas.height;

  // Map note numbers to vertical positions
  const noteRange = { min: 21, max: 108 }; // Piano key range
  const noteHeight = height / (noteRange.max - noteRange.min + 1);

  // Find the first note time and last note time
  let firstNoteTime = Infinity;
  let lastNoteTime = 0;

  midi.tracks.forEach(track => {
    track.notes.forEach(note => {
      if (note.time < firstNoteTime) firstNoteTime = note.time;
      if (note.time + note.duration > lastNoteTime) lastNoteTime = note.time + note.duration;
    });
  });

  // Adjust duration to exclude leading silence
  const duration = midi.duration;//lastNoteTime - firstNoteTime;
  const timeScale = width / duration; // Map time to canvas width

  // Draw notes
  midi.tracks.forEach((track, trackIndex) => {
    // Generate unique colors based on the base color and track index
    const colors = [
      baseColor, 
      // shadeColor(baseColor, 0.8),
      // shadeColor(baseColor, 0.6),
      // shadeColor(baseColor, 0.4),
    ];
    const color = colors[trackIndex % colors.length];

    track.notes.forEach(note => {
      const x = (note.time - firstNoteTime) * timeScale; // Adjust start time
      const y = height - ((note.midi - noteRange.min) * noteHeight); // Note mapped to y-axis
      const w = note.duration * timeScale; // Note duration mapped to width
      const h = noteHeight; // Note height based on pitch range

      // Draw the note
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    });
  });
}


function f_a_s_path_iterate(obj, currentPath = '') {
  let paths = [];
  
  for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
          const newPath = Array.isArray(obj) 
              ? `${currentPath}[${key}]` 
              : (currentPath ? `${currentPath}.${key}` : key);
          
          if (typeof obj[key] === 'object' && obj[key] !== null) {
              paths = paths.concat(f_a_s_path_iterate(obj[key], newPath));
          } else {
            console.log(newPath)
              let o_el = document.querySelector(`[s_prop_sync="${newPath}"]`);
              console.log(o_el);
              console.log(o_el);
              console.log(o_el);
              if(o_el){
                console.log(obj[key])
                  o_el.value = obj[key]
              }
              paths.push(newPath);
          }
      }
  }
  
  return paths;
}

f_a_s_path_iterate(o_state);


