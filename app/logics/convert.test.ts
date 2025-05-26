import { describe, it, expect } from 'vitest';
import { encodeNamespace, convertNamespaceToId } from './convert';

describe('encodeNamespace', () => {
  describe('Valid cases', () => {
    it('should return correct ID for root namespace only', () => {
      const result = encodeNamespace('test');
      expect(result).toBe(15276497235419185774n);
    });

    it('should return correct ID for root.sub namespace', () => {
      const result = encodeNamespace('test.sub');
      expect(result).toBe(16257221637874783385n);
    });

    it('should return correct ID for root.sub1.sub2', () => {
      const result = encodeNamespace('test.sub1.sub2');
      expect(result).toBe(12528015024162528018n);
    });

    it('should return consistent results for same input', () => {
      const result1 = encodeNamespace('test.sub');
      const result2 = encodeNamespace('test.sub');
      expect(result1).toBe(result2);
    });

    it('should return different results for different namespace names', () => {
      const result1 = encodeNamespace('namespace1');
      const result2 = encodeNamespace('namespace2');
      expect(result1).not.toBe(result2);
    });
  });

  describe('Hierarchical level tests', () => {
    it('should correctly generate sub-level 1 namespace ID', () => {
      const result = encodeNamespace('root.sub1');
      expect(result).toBe(12498908868464373370n);
    });

    it('should correctly generate sub-level 2 namespace ID', () => {
      const result = encodeNamespace('root.sub1.sub2');
      expect(result).toBe(9952335005538369418n);
    });
  });

  describe('Exception cases', () => {
    describe('Empty namespace validation', () => {
      it('should throw error for empty string', () => {
        expect(() => encodeNamespace('')).toThrow('Namespace name is empty');
      });

      it('should throw error for whitespace only string', () => {
        expect(() => encodeNamespace('   ')).toThrow('Namespace name is empty');
      });

      it('should throw error for tab and newline characters', () => {
        expect(() => encodeNamespace('\t\n')).toThrow('Namespace name is empty');
      });
    });

    describe('Length validation', () => {
      it('should throw error for namespace longer than 64 characters', () => {
        const longNamespace = 'a'.repeat(65);
        expect(() => encodeNamespace(longNamespace)).toThrow('Namespace name must be 64 characters or less');
      });

      it('should throw error for multi-level namespace exceeding 64 characters', () => {
        const longNamespace = 'a'.repeat(30) + '.' + 'b'.repeat(35);
        expect(() => encodeNamespace(longNamespace)).toThrow('Namespace name must be 64 characters or less');
      });
    });

    describe('Character validation', () => {
      it('should accept uppercase letters (converted to lowercase)', () => {
        // Uppercase letters are converted to lowercase, so this should not throw
        expect(() => encodeNamespace('TestNamespace')).not.toThrow();
        expect(encodeNamespace('TestNamespace')).toBe(encodeNamespace('testnamespace'));
      });

      it('should throw error for special characters', () => {
        expect(() => encodeNamespace('test@namespace')).toThrow('Namespace name can only use a-z, 0-9, _, -');
      });

      it('should throw error for spaces', () => {
        expect(() => encodeNamespace('test namespace')).toThrow('Namespace name can only use a-z, 0-9, _, -');
      });

      it('should throw error for Japanese characters', () => {
        expect(() => encodeNamespace('テスト')).toThrow('Namespace name can only use a-z, 0-9, _, -');
      });

      it('should throw error for symbols like #, $, %', () => {
        expect(() => encodeNamespace('test#namespace')).toThrow('Namespace name can only use a-z, 0-9, _, -');
        expect(() => encodeNamespace('test$namespace')).toThrow('Namespace name can only use a-z, 0-9, _, -');
        expect(() => encodeNamespace('test%namespace')).toThrow('Namespace name can only use a-z, 0-9, _, -');
      });
    });

    describe('Level validation', () => {
      it('should throw error for more than 3 levels', () => {
        expect(() => encodeNamespace('level1.level2.level3.level4')).toThrow('Namespace can have maximum 3 levels');
      });

      it('should throw error for 5 levels', () => {
        expect(() => encodeNamespace('a.b.c.d.e')).toThrow('Namespace can have maximum 3 levels');
      });
    });

    describe('Empty level validation', () => {
      it('should throw error for empty root level', () => {
        expect(() => encodeNamespace('.sub')).toThrow('Level 1 namespace name is empty');
      });

      it('should throw error for empty sub level 1', () => {
        expect(() => encodeNamespace('root.')).toThrow('Level 2 namespace name is empty');
      });

      it('should throw error for empty sub level 2', () => {
        expect(() => encodeNamespace('root.sub1.')).toThrow('Level 3 namespace name is empty');
      });

      it('should throw error for empty middle level', () => {
        expect(() => encodeNamespace('root..sub2')).toThrow('Level 2 namespace name is empty');
      });

      it('should throw error for multiple consecutive dots', () => {
        // Multiple consecutive dots create more than 3 levels, so level validation comes first
        expect(() => encodeNamespace('root...sub')).toThrow('Namespace can have maximum 3 levels');
      });
    });

    describe('Additional empty level cases', () => {
      it('should throw error for two consecutive dots at start', () => {
        expect(() => encodeNamespace('..valid')).toThrow('Level 1 namespace name is empty');
      });

      it('should throw error for two consecutive dots in middle', () => {
        expect(() => encodeNamespace('valid..sub')).toThrow('Level 2 namespace name is empty');
      });
    });

    describe('Edge cases', () => {
      it('should throw error for only dots', () => {
        // Three dots create 4 levels, so level validation comes first
        expect(() => encodeNamespace('...')).toThrow('Namespace can have maximum 3 levels');
      });

      it('should accept mixed case characters (converted to lowercase)', () => {
        // Mixed case is converted to lowercase, so this should not throw
        expect(() => encodeNamespace('valid.INVALID.valid')).not.toThrow();
        expect(encodeNamespace('valid.INVALID.valid')).toBe(encodeNamespace('valid.invalid.valid'));
      });

      it('should throw error for namespace starting with dot after trim', () => {
        expect(() => encodeNamespace('  .namespace')).toThrow('Level 1 namespace name is empty');
      });

      it('should throw error for namespace ending with dot after trim', () => {
        expect(() => encodeNamespace('namespace.  ')).toThrow('Level 2 namespace name is empty');
      });
    });
  });

  describe('convertNamespaceToId', () => {
    describe('Valid namespace conversions', () => {
      it('should convert root namespace to ID string', () => {
        const result = convertNamespaceToId('test');
        expect(result).toBe('15276497235419185774');
      });

      it('should convert sub-namespace to ID string', () => {
        const result = convertNamespaceToId('test.sub');
        expect(result).toBe('16257221637874783385');
      });

      it('should convert multi-level namespace to ID string', () => {
        const result = convertNamespaceToId('test.sub1.sub2');
        expect(result).toBe('12528015024162528018');
      });

      it('should handle uppercase letters by converting to lowercase', () => {
        const result = convertNamespaceToId('TEST.SUB');
        expect(result).toBe(convertNamespaceToId('test.sub'));
      });

      it('should handle mixed case namespace names', () => {
        const result = convertNamespaceToId('Symbol.Xym');
        expect(result).toBe(convertNamespaceToId('symbol.xym'));
      });

      it('should return consistent results for same input', () => {
        const result1 = convertNamespaceToId('symbol.xym');
        const result2 = convertNamespaceToId('symbol.xym');
        expect(result1).toBe(result2);
        expect(result1).not.toBe('');
      });
    });

    describe('Invalid input handling (should return empty string)', () => {
      it('should return empty string for empty namespace', () => {
        const result = convertNamespaceToId('');
        expect(result).toBe('');
      });

      it('should return empty string for whitespace only', () => {
        const result = convertNamespaceToId('   ');
        expect(result).toBe('');
      });

      it('should return empty string for namespace longer than 64 characters', () => {
        const longNamespace = 'a'.repeat(65);
        const result = convertNamespaceToId(longNamespace);
        expect(result).toBe('');
      });

      it('should return empty string for invalid characters', () => {
        const result = convertNamespaceToId('test@namespace');
        expect(result).toBe('');
      });

      it('should return empty string for spaces in namespace', () => {
        const result = convertNamespaceToId('test namespace');
        expect(result).toBe('');
      });

      it('should return empty string for Japanese characters', () => {
        const result = convertNamespaceToId('テスト');
        expect(result).toBe('');
      });

      it('should return empty string for special symbols', () => {
        expect(convertNamespaceToId('test#namespace')).toBe('');
        expect(convertNamespaceToId('test$namespace')).toBe('');
        expect(convertNamespaceToId('test%namespace')).toBe('');
      });

      it('should return empty string for more than 3 levels', () => {
        const result = convertNamespaceToId('level1.level2.level3.level4');
        expect(result).toBe('');
      });

      it('should return empty string for empty levels', () => {
        expect(convertNamespaceToId('.sub')).toBe('');
        expect(convertNamespaceToId('root.')).toBe('');
        expect(convertNamespaceToId('root..sub')).toBe('');
      });
    });

    describe('Edge cases', () => {
      it('should return empty string for only dots', () => {
        const result = convertNamespaceToId('...');
        expect(result).toBe('');
      });

      it('should handle valid namespace with underscores and hyphens', () => {
        const result = convertNamespaceToId('test_namespace-name');
        expect(result).not.toBe('');
        expect(typeof result).toBe('string');
      });

      it('should handle valid namespace with numbers', () => {
        const result = convertNamespaceToId('test123.sub456');
        expect(result).not.toBe('');
        expect(typeof result).toBe('string');
      });

      it('should return empty string for namespace starting with dot after trim', () => {
        const result = convertNamespaceToId('  .namespace');
        expect(result).toBe('');
      });

      it('should return empty string for namespace ending with dot after trim', () => {
        const result = convertNamespaceToId('namespace.  ');
        expect(result).toBe('');
      });
    });
  });
});
