// Carrega os módulos do Three.js de forma observável. O import map do index.html
// resolve os nomes bare usados pelos addons oficiais ("three" e "three/addons/").
// A Promise global permite que o app clássico aguarde a conclusão e mostre a
// causa real se uma origem externa for bloqueada pela CSP ou pela rede.
window.__THREE_BOOTSTRAP_PROMISE = Promise.all([
  import('three'),
  import('three/addons/loaders/GLTFLoader.js'),
  import('three/addons/loaders/DRACOLoader.js'),
  import('three/addons/controls/OrbitControls.js'),
  import('three/addons/loaders/RGBELoader.js')
]).then(([THREE_NS, { GLTFLoader }, { DRACOLoader }, { OrbitControls }, { RGBELoader }]) => {
  // O namespace retornado por import() é imutável; copiamos para um objeto
  // comum antes de anexar os addons usados pelo script clássico do editor.
  window.THREE = Object.assign({}, THREE_NS, {
    GLTFLoader,
    DRACOLoader,
    OrbitControls,
    RGBELoader
  });
  return window.THREE;
}).catch(error => {
  window.__THREE_BOOTSTRAP_ERROR = error;
  throw error;
});