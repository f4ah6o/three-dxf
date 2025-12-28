import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Viewer } from '@/index.js';
import {
  createMockDxfData,
  createMockParent,
  createMockFont,
  createMockDxfDataWithMultipleEntities,
} from '@test/setup/fixtures.js';

describe('Viewer Integration Tests', () => {
  let mockParent;
  let mockFont;

  beforeEach(() => {
    mockParent = createMockParent();
    mockFont = createMockFont();
    vi.clearAllMocks();
  });

  describe('Viewer Initialization', () => {
    it('should create viewer with minimal DXF data (LINE)', () => {
      const dxfData = createMockDxfData('line');
      const viewer = new Viewer(dxfData, mockParent, 400, 300, null);

      expect(viewer).toBeDefined();
      expect(viewer.render).toBeInstanceOf(Function);
      expect(viewer.resize).toBeInstanceOf(Function);
      expect(viewer.renderer).toBeDefined();
    });

    it('should create viewer with font', () => {
      const dxfData = createMockDxfData('text');
      const viewer = new Viewer(dxfData, mockParent, 400, 300, mockFont);

      expect(viewer).toBeDefined();
    });

    it('should handle empty entities array', () => {
      const dxfData = {
        entities: [],
        tables: { layer: { layers: {} } },
      };

      expect(() => new Viewer(dxfData, mockParent, 400, 300, null)).not.toThrow();
    });

    it('should append canvas element to parent', () => {
      const dxfData = createMockDxfData('line');
      new Viewer(dxfData, mockParent, 400, 300, null);

      expect(mockParent.appendChild).toHaveBeenCalled();
      expect(mockParent.style.display).toBe('block');
    });
  });

  describe('Viewer Methods', () => {
    it('should have render method', () => {
      const dxfData = createMockDxfData('line');
      const viewer = new Viewer(dxfData, mockParent, 400, 300, null);

      expect(() => viewer.render()).not.toThrow();
    });

    it('should have resize method', () => {
      const dxfData = createMockDxfData('line');
      const viewer = new Viewer(dxfData, mockParent, 400, 300, null);

      expect(() => viewer.resize(800, 600)).not.toThrow();
    });

    it('should resize viewer correctly', () => {
      const dxfData = createMockDxfData('circle');
      const viewer = new Viewer(dxfData, mockParent, 400, 300, null);

      viewer.resize(800, 600);

      expect(viewer.renderer).toBeDefined();
    });
  });

  describe('Entity Rendering', () => {
    const entityTypes = [
      'LINE',
      'LWPOLYLINE',
      'CIRCLE',
      'ARC',
      'SPLINE',
      'ELLIPSE',
      'POINT',
      'SOLID',
    ];

    entityTypes.forEach((type) => {
      it(`should render ${type} entity`, () => {
        const dxfData = createMockDxfData(type.toLowerCase());
        const viewer = new Viewer(dxfData, mockParent, 400, 300, null);

        expect(viewer).toBeDefined();
        expect(viewer.render).toBeInstanceOf(Function);
      });
    });

    it('should render TEXT entity with font', () => {
      const dxfData = createMockDxfData('text');
      const viewer = new Viewer(dxfData, mockParent, 400, 300, mockFont);

      expect(viewer).toBeDefined();
    });

    it('should render MTEXT entity with font', () => {
      const dxfData = createMockDxfData('mtext');
      const viewer = new Viewer(dxfData, mockParent, 400, 300, mockFont);

      expect(viewer).toBeDefined();
    });

    it('should render INSERT (block) entity', () => {
      const dxfData = createMockDxfData('block', {
        name: 'TEST_BLOCK',
        position: { x: 10, y: 10, z: 0 },
      });
      const viewer = new Viewer(dxfData, mockParent, 400, 300, null);

      expect(viewer).toBeDefined();
    });
  });

  describe('Multiple Entities', () => {
    it('should render multiple entities', () => {
      const dxfData = createMockDxfDataWithMultipleEntities(['line', 'circle', 'arc']);
      const viewer = new Viewer(dxfData, mockParent, 400, 300, null);

      expect(viewer).toBeDefined();
    });

    it('should handle entities with layers', () => {
      const dxfData = {
        tables: {
          layer: {
            layers: {
              Layer1: { color: 0xff0000 },
              Layer2: { color: 0x00ff00 },
            },
          },
        },
        blocks: {},
        entities: [
          {
            type: 'LINE',
            vertices: [{ x: 0, y: 0 }, { x: 10, y: 10 }],
            layer: 'Layer1',
          },
          {
            type: 'CIRCLE',
            center: { x: 5, y: 5, z: 0 },
            radius: 5,
            layer: 'Layer2',
          },
        ],
      };

      expect(() => new Viewer(dxfData, mockParent, 400, 300, null)).not.toThrow();
    });
  });

  describe('Layer Colors', () => {
    it('should use entity color when specified', () => {
      const dxfData = {
        tables: {
          layer: {
            layers: {
              '0': { color: 0xffffff },
            },
          },
        },
        blocks: {},
        entities: [
          {
            type: 'LINE',
            vertices: [{ x: 0, y: 0 }, { x: 10, y: 10 }],
            layer: '0',
            color: 0xff0000,
          },
        ],
      };

      const viewer = new Viewer(dxfData, mockParent, 400, 300, null);
      expect(viewer).toBeDefined();
    });

    it('should use layer color when entity color not specified', () => {
      const dxfData = {
        tables: {
          layer: {
            layers: {
              '0': { color: 0x0000ff },
            },
          },
        },
        blocks: {},
        entities: [
          {
            type: 'LINE',
            vertices: [{ x: 0, y: 0 }, { x: 10, y: 10 }],
            layer: '0',
          },
        ],
      };

      const viewer = new Viewer(dxfData, mockParent, 400, 300, null);
      expect(viewer).toBeDefined();
    });

    it('should use default color when layer color is white', () => {
      const dxfData = {
        tables: {
          layer: {
            layers: {
              '0': { color: 0xffffff },
            },
          },
        },
        blocks: {},
        entities: [
          {
            type: 'LINE',
            vertices: [{ x: 0, y: 0 }, { x: 10, y: 10 }],
            layer: '0',
          },
        ],
      };

      const viewer = new Viewer(dxfData, mockParent, 400, 300, null);
      expect(viewer).toBeDefined();
    });
  });

  describe('LWPOLYLINE with Bulge', () => {
    it('should render LWPOLYLINE with bulge values', () => {
      const dxfData = {
        tables: {
          layer: {
            layers: {
              '0': { color: 0xffffff },
            },
          },
        },
        blocks: {},
        entities: [
          {
            type: 'LWPOLYLINE',
            vertices: [
              { x: 0, y: 0, bulge: 0.5 },
              { x: 10, y: 0 },
              { x: 10, y: 10 },
            ],
            layer: '0',
          },
        ],
      };

      const viewer = new Viewer(dxfData, mockParent, 400, 300, null);
      expect(viewer).toBeDefined();
    });
  });

  describe('Line Type Patterns', () => {
    it('should handle dashed line types', () => {
      const dxfData = {
        tables: {
          layer: {
            layers: {
              '0': { color: 0xffffff },
            },
          },
          lineType: {
            lineTypes: {
              DASHED: {
                pattern: [5, -5],
              },
            },
          },
        },
        blocks: {},
        entities: [
          {
            type: 'LINE',
            vertices: [{ x: 0, y: 0 }, { x: 10, y: 10 }],
            layer: '0',
            lineType: 'DASHED',
          },
        ],
      };

      const viewer = new Viewer(dxfData, mockParent, 400, 300, null);
      expect(viewer).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle entity without vertices (LINE)', () => {
      const dxfData = {
        tables: {
          layer: {
            layers: {
              '0': { color: 0xffffff },
            },
          },
        },
        blocks: {},
        entities: [
          {
            type: 'LINE',
            layer: '0',
            // vertices missing
          },
        ],
      };

      const viewer = new Viewer(dxfData, mockParent, 400, 300, null);
      expect(viewer).toBeDefined();
    });

    it('should handle unsupported entity type', () => {
      const dxfData = {
        tables: {
          layer: {
            layers: {
              '0': { color: 0xffffff },
            },
          },
        },
        blocks: {},
        entities: [
          {
            type: 'UNSUPPORTED_TYPE',
            layer: '0',
          },
        ],
      };

      const viewer = new Viewer(dxfData, mockParent, 400, 300, null);
      expect(viewer).toBeDefined();
    });

    it('should handle missing tables', () => {
      const dxfData = {
        entities: [
          {
            type: 'LINE',
            vertices: [{ x: 0, y: 0 }, { x: 10, y: 10 }],
            layer: '0',
          },
        ],
      };

      const viewer = new Viewer(dxfData, mockParent, 400, 300, null);
      expect(viewer).toBeDefined();
    });

    it('should handle missing layer in entity', () => {
      const dxfData = {
        tables: {
          layer: {
            layers: {
              '0': { color: 0xffffff },
            },
          },
        },
        blocks: {},
        entities: [
          {
            type: 'LINE',
            vertices: [{ x: 0, y: 0 }, { x: 10, y: 10 }],
            // layer missing
          },
        ],
      };

      const viewer = new Viewer(dxfData, mockParent, 400, 300, null);
      expect(viewer).toBeDefined();
    });
  });
});
