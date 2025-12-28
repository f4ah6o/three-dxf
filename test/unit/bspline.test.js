import { describe, it, expect } from 'vitest';
import bSpline from '@/bspline.js';

describe('bSpline', () => {
  it('should calculate linear interpolation (degree 1)', () => {
    const points = [
      [0, 0],
      [10, 10],
    ];
    const result = bSpline(0.5, 1, points);
    expect(result[0]).toBeCloseTo(5, 8);
    expect(result[1]).toBeCloseTo(5, 8);
  });

  it('should return start point at t=0', () => {
    const points = [
      [0, 0],
      [10, 10],
    ];
    const result = bSpline(0, 1, points);
    expect(result[0]).toBeCloseTo(0, 8);
    expect(result[1]).toBeCloseTo(0, 8);
  });

  it('should return end point at t=1', () => {
    const points = [
      [0, 0],
      [10, 10],
    ];
    const result = bSpline(1, 1, points);
    expect(result[0]).toBeCloseTo(10, 8);
    expect(result[1]).toBeCloseTo(10, 8);
  });

  it('should throw error for t out of bounds (negative)', () => {
    const points = [
      [0, 0],
      [10, 10],
    ];
    expect(() => bSpline(-0.1, 1, points)).toThrow('t out of bounds');
  });

  it('should throw error for t out of bounds (greater than 1)', () => {
    const points = [
      [0, 0],
      [10, 10],
    ];
    expect(() => bSpline(1.1, 1, points)).toThrow('t out of bounds');
  });

  it('should throw error for invalid degree (0)', () => {
    const points = [
      [0, 0],
      [10, 10],
      [20, 0],
    ];
    expect(() => bSpline(0.5, 0, points)).toThrow('degree must be at least 1');
  });

  it('should throw error for degree too high', () => {
    const points = [
      [0, 0],
      [10, 10],
    ];
    expect(() => bSpline(0.5, 2, points)).toThrow('degree must be less than or equal');
  });

  it('should generate default knot vector when not provided', () => {
    const points = [
      [0, 0],
      [5, 5],
      [10, 0],
    ];
    const result = bSpline(0.5, 2, points);
    expect(result).toHaveLength(2);
    expect(typeof result[0]).toBe('number');
    expect(typeof result[1]).toBe('number');
  });

  it('should validate knot vector length', () => {
    const points = [
      [0, 0],
      [10, 10],
    ];
    const invalidKnots = [0, 1, 2]; // Wrong length: should be 4 for degree 1 with 2 points
    expect(() => bSpline(0.5, 1, points, invalidKnots)).toThrow('bad knot vector length');
  });

  it('should handle custom knot vector', () => {
    const points = [
      [0, 0],
      [10, 10],
    ];
    const knots = [0, 0, 1, 1]; // Valid knot vector for degree 1 with 2 points
    const result = bSpline(0.5, 1, points, knots);
    expect(result).toHaveLength(2);
    expect(result[0]).toBeCloseTo(5, 8);
    expect(result[1]).toBeCloseTo(5, 8);
  });

  it('should handle weights parameter', () => {
    const points = [
      [0, 0],
      [10, 0],
    ];
    const weights = [1, 2]; // Higher weight on second point
    const result = bSpline(0.5, 1, points, null, weights);
    // Result should be biased toward the weighted point
    expect(result[0]).toBeGreaterThan(5);
    expect(result[0]).toBeLessThan(10);
    expect(result[1]).toBe(0);
  });

  it('should handle 3D points', () => {
    const points = [
      [0, 0, 0],
      [10, 10, 10],
      [20, 0, 20],
    ];
    const result = bSpline(0.5, 2, points);
    expect(result).toHaveLength(3);
    expect(typeof result[0]).toBe('number');
    expect(typeof result[1]).toBe('number');
    expect(typeof result[2]).toBe('number');
  });

  it('should handle quadratic bezier curve (degree 2)', () => {
    const points = [
      [0, 0],
      [10, 20],
      [20, 0],
    ];
    // At t=0.5, quadratic bezier should be at midpoint of curve
    const result = bSpline(0.5, 2, points);
    expect(result).toHaveLength(2);
    // For a symmetric quadratic bezier, the midpoint should have y > 0
    expect(result[1]).toBeGreaterThan(0);
  });

  it('should handle multiple points with degree 2', () => {
    const points = [
      [0, 0],
      [5, 10],
      [10, 10],
      [15, 0],
    ];
    const result = bSpline(0.5, 2, points);
    expect(result).toHaveLength(2);
    expect(typeof result[0]).toBe('number');
    expect(typeof result[1]).toBe('number');
  });

  it('should handle single dimension points', () => {
    const points = [[0], [10], [5]];
    const result = bSpline(0.5, 2, points);
    expect(result).toHaveLength(1);
    expect(typeof result[0]).toBe('number');
  });

  it('should handle equal weights as default behavior', () => {
    const points = [
      [0, 0],
      [10, 10],
    ];
    const result1 = bSpline(0.5, 1, points);
    const result2 = bSpline(0.5, 1, points, null, [1, 1]);
    expect(result1[0]).toBeCloseTo(result2[0], 8);
    expect(result1[1]).toBeCloseTo(result2[1], 8);
  });
});
