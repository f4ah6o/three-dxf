import { vi } from 'vitest';

/**
 * モックDXFデータを生成する関数
 * @param {string} entityType - エンティティタイプ (line, circle, arc, polyline, spline, ellipse, point, solid, text, mtext, block)
 * @param {object} overrides - エンティティプロパティの上書き
 * @returns {object} モックDXFデータ
 */
export function createMockDxfData(entityType, overrides = {}) {
  const baseData = {
    tables: {
      layer: {
        layers: {
          '0': { color: 0xffffff },
        },
      },
      lineType: {
        lineTypes: {},
      },
    },
    blocks: {},
    entities: [],
  };

  const entityTemplates = {
    line: {
      type: 'LINE',
      vertices: [{ x: 0, y: 0 }, { x: 10, y: 10 }],
      layer: '0',
    },
    lwpolyline: {
      type: 'LWPOLYLINE',
      vertices: [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }],
      layer: '0',
    },
    circle: {
      type: 'CIRCLE',
      center: { x: 5, y: 5, z: 0 },
      radius: 5,
      layer: '0',
    },
    arc: {
      type: 'ARC',
      center: { x: 5, y: 5, z: 0 },
      radius: 5,
      startAngle: 0,
      endAngle: Math.PI,
      layer: '0',
    },
    polyline: {
      type: 'LWPOLYLINE',
      vertices: [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }],
      layer: '0',
    },
    spline: {
      type: 'SPLINE',
      controlPoints: [{ x: 0, y: 0 }, { x: 5, y: 10 }, { x: 10, y: 0 }],
      degreeOfSplineCurve: 2,
      knotValues: [0, 0, 0, 1, 1, 1],
      layer: '0',
    },
    ellipse: {
      type: 'ELLIPSE',
      center: { x: 5, y: 5, z: 0 },
      majorAxisEndPoint: { x: 10, y: 5, z: 0 },
      axisRatio: 0.5,
      startAngle: 0,
      endAngle: Math.PI * 2,
      layer: '0',
    },
    point: {
      type: 'POINT',
      position: { x: 5, y: 5, z: 0 },
      layer: '0',
    },
    solid: {
      type: 'SOLID',
      points: [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }],
      layer: '0',
    },
    text: {
      type: 'TEXT',
      text: 'Test',
      startPoint: { x: 0, y: 0, z: 0 },
      textHeight: 5,
      layer: '0',
    },
    mtext: {
      type: 'MTEXT',
      text: 'Test MText',
      position: { x: 0, y: 0, z: 0 },
      height: 5,
      width: 50,
      layer: '0',
      attachmentPoint: 1,
    },
    block: {
      type: 'INSERT',
      name: 'TEST_BLOCK',
      position: { x: 0, y: 0, z: 0 },
      layer: '0',
    },
  };

  const template = entityTemplates[entityType.toLowerCase()] || entityTemplates.line;
  baseData.entities.push({ ...template, ...overrides });

  if (entityType.toLowerCase() === 'block') {
    baseData.blocks[overrides.name || 'TEST_BLOCK'] = {
      entities: [
        {
          type: 'LINE',
          vertices: [{ x: 0, y: 0 }, { x: 5, y: 5 }],
          layer: '0',
        },
      ],
    };
  }

  return baseData;
}

/**
 * モック親DOM要素を生成する関数
 * @returns {object} モックDOM要素
 */
export function createMockParent() {
  const mockParent = document.createElement('div');
  Object.defineProperty(mockParent, 'clientWidth', {
    value: 400,
    writable: false,
    configurable: true,
  });
  Object.defineProperty(mockParent, 'clientHeight', {
    value: 300,
    writable: false,
    configurable: true,
  });
  Object.defineProperty(mockParent, 'appendChild', {
    value: vi.fn(),
  });
  Object.defineProperty(mockParent, 'style', {
    value: {},
    writable: true,
  });
  return mockParent;
}

/**
 * モックフォントオブジェクトを生成する関数
 * @returns {object} モックフォント
 */
export function createMockFont() {
  return {
    generateShapes: vi.fn(() => []),
  };
}

/**
 * 複数のエンティティを含むモックDXFデータを生成する関数
 * @param {array} entityTypes - エンティティタイプの配列
 * @returns {object} モックDXFデータ
 */
export function createMockDxfDataWithMultipleEntities(entityTypes) {
  const baseData = {
    tables: {
      layer: {
        layers: {
          '0': { color: 0xffffff },
        },
      },
      lineType: {
        lineTypes: {},
      },
    },
    blocks: {},
    entities: [],
  };

  const entityTemplates = {
    line: {
      type: 'LINE',
      vertices: [{ x: 0, y: 0 }, { x: 10, y: 10 }],
      layer: '0',
    },
    circle: {
      type: 'CIRCLE',
      center: { x: 5, y: 5, z: 0 },
      radius: 5,
      layer: '0',
    },
    arc: {
      type: 'ARC',
      center: { x: 5, y: 5, z: 0 },
      radius: 5,
      startAngle: 0,
      endAngle: Math.PI,
      layer: '0',
    },
  };

  entityTypes.forEach((type) => {
    const template = entityTemplates[type.toLowerCase()];
    if (template) {
      baseData.entities.push({ ...template });
    }
  });

  return baseData;
}
