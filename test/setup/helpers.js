import { vi } from 'vitest';

// EventDispatcher mock class
function MockEventDispatcher() {
  this._listeners = {};
}

MockEventDispatcher.prototype.addEventListener = function(type, listener) {
  if (this._listeners[type] === undefined) {
    this._listeners[type] = [];
  }
  if (this._listeners[type].indexOf(listener) === -1) {
    this._listeners[type].push(listener);
  }
};

MockEventDispatcher.prototype.hasEventListener = function(type, listener) {
  if (this._listeners[type] !== undefined) {
    return this._listeners[type].indexOf(listener) !== -1;
  }
  return false;
};

MockEventDispatcher.prototype.removeEventListener = function(type, listener) {
  if (this._listeners[type] !== undefined) {
    const index = this._listeners[type].indexOf(listener);
    if (index !== -1) {
      this._listeners[type].splice(index, 1);
    }
  }
};

MockEventDispatcher.prototype.dispatchEvent = function(event) {
  if (this._listeners[event.type] !== undefined) {
    const listeners = this._listeners[event.type];
    for (let i = 0; i < listeners.length; i++) {
      listeners[i].call(this, event);
    }
  }
};

// Three.js モック
vi.mock('three', () => {
  const mockVector3 = vi.fn((x, y, z) => {
    const v = { x: x || 0, y: y || 0, z: z || 0 };
    v.set = function(x, y, z) { this.x = x; this.y = y; this.z = z; return this; };
    v.clone = function() { return { x: this.x, y: this.y, z: this.z }; };
    v.sub = function(v2) { this.x -= v2.x; this.y -= v2.y; this.z -= v2.z; return this; };
    v.subVectors = function(a, b) { this.x = a.x - b.x; this.y = a.y - b.y; this.z = a.z - b.z; return this; };
    v.add = function(v2) { this.x += v2.x; this.y += v2.y; this.z += v2.z; return this; };
    v.multiplyScalar = function(s) { this.x *= s; this.y *= s; this.z *= s; return this; };
    v.cross = function(v2) { return { x: this.y * v2.z - this.z * v2.y, y: this.z * v2.x - this.x * v2.z, z: this.x * v2.y - this.y * v2.x }; };
    v.normalize = function() { const len = Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2); this.x /= len; this.y /= len; this.z /= len; return this; };
    v.distanceTo = function(v2) { return Math.sqrt((this.x - v2.x) ** 2 + (this.y - v2.y) ** 2 + (this.z - v2.z) ** 2); };
    v.angleTo = function(v2) { return Math.acos((this.x * v2.x + this.y * v2.y + this.z * v2.z) / (Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2) * Math.sqrt(v2.x ** 2 + v2.y ** 2 + v2.z ** 2))); };
    return v;
  });
  // Add static method for subVectors
  mockVector3.subVectors = function(a, b) { return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }; };

  const mockObject3D = vi.fn(() => ({
    add: vi.fn(),
    children: [],
    position: { x: 0, y: 0, z: 0 },
    rotation: { z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    updateMatrixWorld: vi.fn(),
  }));

  const mockLine = vi.fn(() => ({
    position: { x: 0, y: 0, z: 0 },
  }));

  return {
    Scene: vi.fn(() => ({
      add: vi.fn(),
      children: [],
      remove: vi.fn(),
      traverse: vi.fn(),
    })),
    OrthographicCamera: vi.fn(() => {
      const camera = {
        position: { x: 0, y: 0, z: 0, clone: () => ({ x: 0, y: 0, z: 0 }) },
        target: { x: 0, y: 0, z: 0, clone: () => ({ x: 0, y: 0, z: 0 }) },
        zoom: 1,
        updateProjectionMatrix: vi.fn(),
        top: 100,
        bottom: -100,
        left: -100,
        right: 100,
      };
      return camera;
    }),
    WebGLRenderer: vi.fn(() => ({
      setSize: vi.fn(),
      setClearColor: vi.fn(),
      render: vi.fn(),
      domElement: document.createElement('canvas'),
    })),
    Vector2: vi.fn((x, y) => {
      const v = { x, y };
      v.sub = function(v2) { this.x -= v2.x; this.y -= v2.y; return this; };
      v.normalize = function() { const len = Math.sqrt(this.x ** 2 + this.y ** 2); this.x /= len; this.y /= len; return this; };
      v.distanceTo = function(v2) { return Math.sqrt((this.x - v2.x) ** 2 + (this.y - v2.y) ** 2); };
      return v;
    }),
    Vector3: mockVector3,
    Float32BufferAttribute: vi.fn((array, itemSize) => ({ array, itemSize })),
    BufferGeometry: vi.fn(() => {
      const geom = {
        setFromPoints: vi.fn(() => geom),
        computeBoundingSphere: vi.fn(),
        setAttribute: vi.fn(),
        attributes: {},
      };
      return geom;
    }),
    LineBasicMaterial: vi.fn(),
    LineDashedMaterial: vi.fn(),
    Line: mockLine,
    ArcCurve: vi.fn(() => ({
      getPoints: vi.fn(() => []),
    })),
    EllipseCurve: vi.fn(() => ({
      getPoints: vi.fn(() => []),
    })),
    Box3: vi.fn(() => ({
      setFromObject: vi.fn(() => ({ min: { x: 0, y: 0, z: 0 }, max: { x: 10, y: 10, z: 0 } })),
      expandByScalar: vi.fn(),
    })),
    Color: vi.fn((c) => ({ r: 1, g: 1, b: 1 })),
    MeshBasicMaterial: vi.fn(),
    Mesh: vi.fn(() => ({
      position: { x: 0, y: 0, z: 0 },
    })),
    PointsMaterial: vi.fn(),
    Points: vi.fn(),
    Object3D: mockObject3D,
    UniformsUtils: { merge: vi.fn(() => ({})) },
    UniformsLib: { common: {}, fog: {} },
    ShaderChunk: {},
    ShaderMaterial: vi.fn(),
    EventDispatcher: MockEventDispatcher,
    TextGeometry: vi.fn(() => ({
      rotateZ: vi.fn(),
    })),
    FontLoader: vi.fn(() => ({
      parse: vi.fn(() => ({})),
    })),
  };
});

// troika-three-text モック
vi.mock('troika-three-text', () => ({
  Text: vi.fn(() => ({
    sync: vi.fn(),
    position: { x: 0, y: 0, z: 0 },
  })),
  preloadFont: vi.fn(() => Promise.resolve()),
}));

// @dxfom/mtext モック
vi.mock('@dxfom/mtext', () => ({
  parseDxfMTextContent: vi.fn((text) => [text, []]),
}));

// OrbitControls モック
vi.mock('@/OrbitControls.js', () => ({
  OrbitControls: vi.fn(() => ({
    target: { x: 0, y: 0, z: 0, clone: () => ({ x: 0, y: 0, z: 0 }) },
    object: { position: { x: 0, y: 0, z: 0, clone: () => ({ x: 0, y: 0, z: 0 }) } },
    addEventListener: vi.fn(),
    update: vi.fn(),
    enableRotate: true,
    zoomSpeed: 3,
  })),
}));
