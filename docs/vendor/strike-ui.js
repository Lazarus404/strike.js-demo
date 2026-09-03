import{h as E}from"./strike.core+hooks.js";var S=new WeakMap,B=new Map;function l(t,...e){let r;if(typeof t=="string")r=t;else{r=t[0]||"";for(let o=0;o<e.length;o++)r+=e[o]+(t[o+1]||"");if(S.has(t))return S.get(t)}if(B.has(r)){let o=B.get(r);return typeof t!="string"&&S.set(t,o),o}let i=document.createElement("style");return i.setAttribute("data-strike",""),i.textContent=r,document.head.appendChild(i),B.set(r,i),typeof t!="string"&&S.set(t,i),i}function a(...t){let e="";for(let r=0;r<t.length;r++){let i=t[r];i==null||i===!1||i===""||(e=e?e+" "+i:""+i)}return e}l`
.strike-btn {
  font: inherit;
  cursor: pointer;
  border: 1px solid var(--strike-line, #ccc);
  background: #fff;
  color: inherit;
  border-radius: var(--strike-radius, 6px);
  padding: 0.4rem 0.85rem;
}
.strike-btn:hover { border-color: var(--strike-muted, #666); }
.strike-btn:focus-visible { outline: 2px solid var(--strike-accent, #0b6e4f); outline-offset: 2px; }
.strike-btn:active { transform: translateY(1px); }
.strike-btn--primary {
  background: var(--strike-accent, #0b6e4f);
  border-color: transparent;
  color: #fff;
}
.strike-btn--ghost { background: transparent; }
.strike-btn--default { background: #fff; }
.strike-btn[data-state="busy"] { opacity: 0.6; pointer-events: none; }
`;function h({variant:t="primary",state:e="rest",class:r,type:i="button",children:o,...n}){return E("button",{...n,type:i,class:a("strike-btn","strike-btn--"+t,r),"data-state":e},o)}import{h as N}from"./strike.core+hooks.js";l`
.strike-field { display: flex; flex-direction: column; gap: 0.35rem; font: inherit; }
.strike-field__label { font-size: 0.85rem; color: var(--strike-muted, #5c5c5c); }
.strike-field__input {
  font: inherit;
  padding: 0.45rem 0.65rem;
  border: 1px solid var(--strike-line, #ccc);
  border-radius: var(--strike-radius, 6px);
  background: #fff;
}
.strike-field__input:focus-visible {
  outline: 2px solid var(--strike-accent, #0b6e4f);
  outline-offset: 1px;
}
.strike-field[data-state="invalid"] .strike-field__input {
  border-color: var(--strike-danger, #9b2226);
}
`;function I({label:t,id:e,class:r,state:i="rest",...o}){return N("label",{class:a("strike-field",r),"data-state":i},t&&N("span",{class:"strike-field__label"},t),N("input",{id:e,class:"strike-field__input",...o}))}import{h as O}from"./strike.core+hooks.js";l`
.strike-stack { display: flex; flex-direction: column; }
.strike-stack--row { flex-direction: row; align-items: center; }
`;function R({gap:t=8,row:e,class:r,children:i,style:o,...n}){return O("div",{...n,class:a("strike-stack",e&&"strike-stack--row",r),style:{gap:t,...o||{}}},i)}import{h as L}from"./strike.core+hooks.js";l`
.strike-text { margin: 0; font: inherit; color: inherit; }
.strike-text--muted { color: var(--strike-muted, #5c5c5c); }
.strike-text--danger { color: var(--strike-danger, #9b2226); }
.strike-text--title { font-size: 1.25rem; font-weight: 600; }
`;var M={p:1,span:1,h1:1,h2:1,h3:1,label:1,strong:1,em:1};function P({as:t="p",tone:e,class:r,children:i,...o}){let n=M[t]?t:"p";return L(n,{...o,class:a("strike-text",e&&"strike-text--"+e,r)},i)}import{h as j}from"./strike.core+hooks.js";import{useLayoutEffect as W,useRef as K}from"./strike.core+hooks.js";l`
.strike-check {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font: inherit;
  cursor: pointer;
}
.strike-check__input {
  width: 1rem;
  height: 1rem;
  accent-color: var(--strike-accent, #0b6e4f);
}
.strike-check[data-state="busy"] { opacity: 0.6; pointer-events: none; }
`;function U({label:t,class:e,state:r="rest",indeterminate:i=!1,children:o,...n}){let u=K(null);return W(()=>{u.current&&(u.current.indeterminate=!!i)},[i]),j("label",{class:a("strike-check",e),"data-state":r},j("input",{...n,ref:u,type:"checkbox",class:"strike-check__input"}),(t||o)&&j("span",{class:"strike-check__label"},t||o))}import{h as z}from"./strike.core+hooks.js";l`
.strike-select { display: flex; flex-direction: column; gap: 0.35rem; font: inherit; }
.strike-select__label { font-size: 0.85rem; color: var(--strike-muted, #5c5c5c); }
.strike-select__control {
  font: inherit;
  padding: 0.45rem 0.65rem;
  border: 1px solid var(--strike-line, #ccc);
  border-radius: var(--strike-radius, 6px);
  background: #fff;
}
.strike-select__control:focus-visible {
  outline: 2px solid var(--strike-accent, #0b6e4f);
  outline-offset: 1px;
}
.strike-select[data-state="invalid"] .strike-select__control {
  border-color: var(--strike-danger, #9b2226);
}
`;function X({label:t,id:e,options:r,class:i,state:o="rest",children:n,...u}){let d=n;return r&&(d=r.map(c=>z("option",{key:c.value,value:c.value},c.label!=null?c.label:c.value))),z("label",{class:a("strike-select",i),"data-state":o},t&&z("span",{class:"strike-select__label"},t),z("select",{id:e,class:"strike-select__control",...u},d))}import{h as Y}from"./strike.core+hooks.js";l`
.strike-image {
  display: block;
  max-width: 100%;
  height: auto;
}
.strike-image--round { border-radius: var(--strike-radius, 6px); }
.strike-image--circle { border-radius: 50%; }
`;function q({alt:t="",class:e,round:r,circle:i,...o}){return Y("img",{...o,alt:t,class:a("strike-image",r&&"strike-image--round",i&&"strike-image--circle",e)})}import{h as H}from"./strike.core+hooks.js";l`
.strike-form {
  display: flex;
  flex-direction: column;
  gap: var(--strike-gap, 0.75rem);
  font: inherit;
}
.strike-form[data-state="busy"] { opacity: 0.7; pointer-events: none; }
`;function J({class:t,state:e="rest",onSubmit:r,children:i,...o}){return H("form",{...o,class:a("strike-form",t),"data-state":e,onSubmit:n=>{n.preventDefault(),r&&r(n)}},i)}import{h as F}from"./strike.core+hooks.js";l`
.strike-switch {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font: inherit;
  cursor: pointer;
  position: relative;
}
.strike-switch__track {
  position: relative;
  width: 2.25rem;
  height: 1.25rem;
  border-radius: 999px;
  background: var(--strike-line, #ccc);
  transition: background 0.15s ease;
  flex-shrink: 0;
}
.strike-switch__track::after {
  content: "";
  position: absolute;
  top: 0.15rem;
  left: 0.15rem;
  width: 0.95rem;
  height: 0.95rem;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
  transition: transform 0.15s ease;
}
.strike-switch__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.strike-switch__input:focus-visible + .strike-switch__track {
  outline: 2px solid var(--strike-accent, #0b6e4f);
  outline-offset: 2px;
}
.strike-switch__input:checked + .strike-switch__track {
  background: var(--strike-accent, #0b6e4f);
}
.strike-switch__input:checked + .strike-switch__track::after {
  transform: translateX(1rem);
}
.strike-switch[data-state="busy"] { opacity: 0.6; pointer-events: none; }
`;function Q({label:t,class:e,state:r="rest",children:i,...o}){return F("label",{class:a("strike-switch",e),"data-state":r},F("input",{type:"checkbox",role:"switch",class:"strike-switch__input",...o}),F("span",{class:"strike-switch__track","aria-hidden":"true"}),(t||i)&&F("span",{class:"strike-switch__label"},t||i))}import{h as T,createPortal as Z}from"./strike.core+hooks.js";l`
.strike-dialog-root {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.4);
}
.strike-dialog {
  max-width: 24rem;
  width: 100%;
  max-height: min(90vh, 32rem);
  overflow: auto;
  background: #fff;
  color: var(--strike-ink, #1a1a1a);
  border-radius: var(--strike-radius, 6px);
  border: 1px solid var(--strike-line, #ccc);
  padding: 1rem 1.1rem;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18);
}
.strike-dialog__title {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
}
`;function $({open:t,title:e,onClose:r,class:i,children:o,...n}){if(!t)return null;let u=typeof document<"u"?document.body:null;return u?Z(T("div",{class:"strike-dialog-root",role:"presentation",onClick:d=>{d.target===d.currentTarget&&r&&r(d)}},T("div",{...n,role:"dialog","aria-modal":"true",class:a("strike-dialog",i),onClick:d=>d.stopPropagation()},e&&T("h2",{class:"strike-dialog__title"},e),o)),u):null}import{h as v}from"./strike.core+hooks.js";l`
.strike-radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font: inherit;
}
.strike-radio-group__label {
  font-size: 0.85rem;
  color: var(--strike-muted, #5c5c5c);
}
.strike-radio-group__options {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.strike-radio-group__options--row {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.strike-radio {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font: inherit;
  cursor: pointer;
}
.strike-radio__input {
  width: 1rem;
  height: 1rem;
  accent-color: var(--strike-accent, #0b6e4f);
}
.strike-radio-group[data-state="busy"] { opacity: 0.6; pointer-events: none; }
`;function V({label:t,name:e,options:r=[],value:i,defaultValue:o,onChange:n,row:u,class:d,state:c="rest",...m}){let k=i!==void 0;return v("div",{...m,role:"radiogroup","aria-label":typeof t=="string"?t:m["aria-label"],class:a("strike-radio-group",d),"data-state":c},t&&v("span",{class:"strike-radio-group__label"},t),v("div",{class:a("strike-radio-group__options",u&&"strike-radio-group__options--row")},r.map(b=>{let f=b.value,g=k?i===f:o!==void 0?o===f:void 0;return v("label",{key:String(f),class:"strike-radio"},v("input",{type:"radio",class:"strike-radio__input",name:e,value:f,checked:g,onChange:_=>{n&&n(_)}}),v("span",{class:"strike-radio__label"},b.label!=null?b.label:f))})))}import{h as y}from"./strike.core+hooks.js";l`
.strike-number {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font: inherit;
}
.strike-number__label {
  font-size: 0.85rem;
  color: var(--strike-muted, #5c5c5c);
}
.strike-number__row {
  display: inline-flex;
  align-items: stretch;
  gap: 0;
}
.strike-number__input {
  font: inherit;
  padding: 0.45rem 0.65rem;
  border: 1px solid var(--strike-line, #ccc);
  border-radius: 0;
  background: #fff;
  width: 4.5rem;
  text-align: center;
  -moz-appearance: textfield;
}
.strike-number__input::-webkit-outer-spin-button,
.strike-number__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.strike-number__input:focus-visible {
  outline: 2px solid var(--strike-accent, #0b6e4f);
  outline-offset: 1px;
  z-index: 1;
}
.strike-number__row .strike-btn {
  border-radius: 0;
  padding: 0.4rem 0.65rem;
  min-width: 2.25rem;
}
.strike-number__row .strike-btn:first-child {
  border-radius: var(--strike-radius, 6px) 0 0 var(--strike-radius, 6px);
}
.strike-number__row .strike-btn:last-child {
  border-radius: 0 var(--strike-radius, 6px) var(--strike-radius, 6px) 0;
}
.strike-number__row .strike-btn + .strike-number__input {
  margin-left: -1px;
}
.strike-number__row .strike-number__input + .strike-btn {
  margin-left: -1px;
}
.strike-number[data-state="invalid"] .strike-number__input {
  border-color: var(--strike-danger, #9b2226);
}
.strike-number[data-state="busy"] { opacity: 0.6; pointer-events: none; }
`;function tt(t,e,r){return e!=null&&t<e?e:r!=null&&t>r?r:t}function w(t,e){let r=typeof t=="number"?t:parseFloat(t);return Number.isFinite(r)?r:e}function rt({label:t,id:e,class:r,state:i="rest",value:o,min:n,max:u,step:d=1,onInput:c,onChange:m,...k}){let b=w(d,1),f=n==null?null:w(n,null),g=u==null?null:w(u,null);function _(s,p){let x=tt(s,f,g);c&&c({...p,target:{...p.target,value:String(x),valueAsNumber:x}}),m&&m({...p,target:{...p.target,value:String(x),valueAsNumber:x}})}function A(s,p){p.preventDefault();let x=w(o,0);_(x+s*b,p)}return y("div",{class:a("strike-number",r),"data-state":i},t&&y("span",{class:"strike-number__label"},t),y("div",{class:"strike-number__row"},y(h,{type:"button",variant:"default","aria-label":"Decrease",onClick:s=>A(-1,s)},"-"),y("input",{...k,id:e,type:"number",class:"strike-number__input",value:o,min:f,max:g,step:b,onInput:s=>{let p=w(s.target.value,0);_(p,s)}}),y(h,{type:"button",variant:"default","aria-label":"Increase",onClick:s=>A(1,s)},"+")))}import{h as et}from"./strike.core+hooks.js";l`
.strike-btn-group {
  display: inline-flex;
  flex-direction: row;
  align-items: stretch;
  font: inherit;
}
.strike-btn-group > .strike-btn {
  border-radius: 0;
  margin-left: -1px;
}
.strike-btn-group > .strike-btn:first-child {
  margin-left: 0;
  border-radius: var(--strike-radius, 6px) 0 0 var(--strike-radius, 6px);
}
.strike-btn-group > .strike-btn:last-child {
  border-radius: 0 var(--strike-radius, 6px) var(--strike-radius, 6px) 0;
}
.strike-btn-group > .strike-btn:only-child {
  border-radius: var(--strike-radius, 6px);
  margin-left: 0;
}
.strike-btn-group[data-state="busy"] { opacity: 0.6; pointer-events: none; }
`;function it({class:t,state:e="rest",children:r,...i}){return et("div",{...i,role:"group",class:a("strike-btn-group",t),"data-state":e},r)}import{h as G}from"./strike.core+hooks.js";l`
.strike-toggle-group {
  display: inline-flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.35rem;
  font: inherit;
}
.strike-toggle-group--joined {
  gap: 0;
}
.strike-toggle-group--joined > .strike-btn {
  border-radius: 0;
  margin-left: -1px;
}
.strike-toggle-group--joined > .strike-btn:first-child {
  margin-left: 0;
  border-radius: var(--strike-radius, 6px) 0 0 var(--strike-radius, 6px);
}
.strike-toggle-group--joined > .strike-btn:last-child {
  border-radius: 0 var(--strike-radius, 6px) var(--strike-radius, 6px) 0;
}
.strike-toggle-group--joined > .strike-btn:only-child {
  border-radius: var(--strike-radius, 6px);
  margin-left: 0;
}
.strike-toggle-group[data-state="busy"] { opacity: 0.6; pointer-events: none; }
`;function ot(t,e,r){return r?t===e:Array.isArray(t)&&t.indexOf(e)!==-1}function st({options:t=[],value:e,exclusive:r=!0,joined:i=!0,onChange:o,class:n,state:u="rest",...d}){return G("div",{...d,role:r?"radiogroup":"group",class:a("strike-toggle-group",i&&"strike-toggle-group--joined",n),"data-state":u},t.map(c=>{let m=c.value,k=ot(e,m,r);return G(h,{key:String(m),type:"button",variant:k?"primary":"ghost",role:r?"radio":"button","aria-checked":r?k?"true":"false":void 0,"aria-pressed":r?void 0:k?"true":"false",onClick:b=>{if(!o)return;if(r){o(m,b);return}let f=Array.isArray(e)?e.slice():[],g=f.indexOf(m);g===-1?f.push(m):f.splice(g,1),o(f,b)}},c.label!=null?c.label:m)}))}import{h as D}from"./strike.core+hooks.js";import{useState as C}from"./strike.core+hooks.js";l`
.strike-autocomplete {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font: inherit;
  position: relative;
}
.strike-autocomplete__label {
  font-size: 0.85rem;
  color: var(--strike-muted, #5c5c5c);
}
.strike-autocomplete__input {
  font: inherit;
  padding: 0.45rem 0.65rem;
  border: 1px solid var(--strike-line, #ccc);
  border-radius: var(--strike-radius, 6px);
  background: #fff;
  width: 100%;
  box-sizing: border-box;
}
.strike-autocomplete__input:focus-visible {
  outline: 2px solid var(--strike-accent, #0b6e4f);
  outline-offset: 1px;
}
.strike-autocomplete__list {
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  z-index: 20;
  margin: 0.2rem 0 0;
  padding: 0.25rem 0;
  list-style: none;
  background: #fff;
  border: 1px solid var(--strike-line, #ccc);
  border-radius: var(--strike-radius, 6px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  max-height: 12rem;
  overflow: auto;
}
.strike-autocomplete__option {
  padding: 0.4rem 0.65rem;
  cursor: pointer;
}
.strike-autocomplete__option[aria-selected="true"],
.strike-autocomplete__option:hover {
  background: color-mix(in srgb, var(--strike-accent, #0b6e4f) 12%, #fff);
}
.strike-autocomplete[data-state="invalid"] .strike-autocomplete__input {
  border-color: var(--strike-danger, #9b2226);
}
.strike-autocomplete[data-state="busy"] { opacity: 0.6; pointer-events: none; }
`;function at({label:t,id:e,class:r,state:i="rest",value:o="",options:n=[],onInput:u,onSelect:d,...c}){let[m,k]=C(!1),[b,f]=C(0),g=e?e+"-list":void 0;function _(s,p){k(!1),d&&d(s,p)}function A(s){if(s.key==="Escape"){s.preventDefault(),k(!1);return}if(n.length){if(s.key==="ArrowDown"){s.preventDefault(),k(!0),f(p=>(p+1)%n.length);return}if(s.key==="ArrowUp"){s.preventDefault(),k(!0),f(p=>(p-1+n.length)%n.length);return}if(s.key==="Enter"&&m){s.preventDefault();let p=n[b];p&&_(p,s)}}}return D("div",{class:a("strike-autocomplete",r),"data-state":i},t&&D("span",{class:"strike-autocomplete__label"},t),D("input",{...c,id:e,type:"text",role:"combobox",class:"strike-autocomplete__input",value:o,autocomplete:"off","aria-expanded":m&&n.length>0,"aria-controls":g,"aria-autocomplete":"list",onInput:s=>{k(!0),f(0),u&&u(s)},onFocus:s=>{k(!0),c.onFocus&&c.onFocus(s)},onBlur:s=>{setTimeout(()=>k(!1),0),c.onBlur&&c.onBlur(s)},onKeyDown:A}),m&&n.length?D("ul",{id:g,role:"listbox",class:"strike-autocomplete__list"},n.map((s,p)=>D("li",{key:String(s.value),role:"option",class:"strike-autocomplete__option","aria-selected":p===b,onMouseDown:x=>{x.preventDefault(),_(s,x)}},s.label!=null?s.label:s.value))):null)}export{at as Autocomplete,h as Btn,it as BtnGroup,U as Check,$ as Dialog,I as Field,J as Form,q as Image,rt as NumberField,V as RadioGroup,X as Select,R as Stack,Q as Switch,P as Text,st as ToggleGroup,a as cls};
