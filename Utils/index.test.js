import { describe, test, expect } from 'vitest';
import utils from './index.js';

describe('Utils', () => {
  
  describe('getSearchableText', () => {
    test('should return searchable text for valid input', () => {
      const result = utils.getSearchableText('hello world');
      expect(result).toBe('hello world');
    });

    test('should filter out short terms', () => {
      const result = utils.getSearchableText('a cat');
      expect(result).toBe('cat');
    });

    test('should handle empty string', () => {
      const result = utils.getSearchableText('');
      expect(result).toBe('');
    });
  });

  describe('getRandom', () => {
    test('should return correct number of elements', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = utils.getRandom(arr, 3);
      expect(result.length).toBe(3);
    });

    test('should return elements from array', () => {
      const arr = [1, 2, 3];
      const result = utils.getRandom(arr, 1);
      expect(arr).toContain(result[0]);
    });
  });

  describe('getVersion', () => {
    test('should return a version', () => {
      const version = utils.getVersion();
      expect(version).toBeDefined();
      expect(typeof version).toBe('string');
    });
  });

  describe('consolidateHighlight', () => {
    test('should return array for valid input', () => {
      const highlights = ['<b>test</b>'];
      const result = utils.consolidateHighlight(highlights);
      expect(Array.isArray(result)).toBe(true);
    });

    test('should handle empty array', () => {
      const result = utils.consolidateHighlight([]);
      expect(result).toEqual([]);
    });
  });
});
