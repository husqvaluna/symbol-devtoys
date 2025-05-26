import { describe, it, expect } from 'vitest';
import { encodeNamespace, convertNamespaceToId } from './convert';

describe('encodeNamespace', () => {
  describe('正常なケース', () => {
    it('ルートネームスペースのみの場合、正しいIDを返す', () => {
      const result = encodeNamespace('test');
      expect(result).toBe(15276497235419185774n);
    });

    it('ルート.サブネームスペースの場合、正しいIDを返す', () => {
      const result = encodeNamespace('test.sub');
      expect(result).toBe(16257221637874783385n);
    });

    it('ルート.サブ1.サブ2の場合、正しいIDを返す', () => {
      const result = encodeNamespace('test.sub1.sub2');
      expect(result).toBe(12528015024162528018n);
    });

    it('同じ入力に対して一貫した結果を返す', () => {
      const result1 = encodeNamespace('test.sub');
      const result2 = encodeNamespace('test.sub');
      expect(result1).toBe(result2);
    });

    it('異なるネームスペース名に対して異なる結果を返す', () => {
      const result1 = encodeNamespace('namespace1');
      const result2 = encodeNamespace('namespace2');
      expect(result1).not.toBe(result2);
    });
  });

  describe('階層レベル別のテスト', () => {
    it('サブレベル1のネームスペースIDが正しく生成される', () => {
      const result = encodeNamespace('root.sub1');
      expect(result).toBe(12498908868464373370n);
    });

    it('サブレベル2のネームスペースIDが正しく生成される', () => {
      const result = encodeNamespace('root.sub1.sub2');
      expect(result).toBe(9952335005538369418n);
    });
  });

  describe('Exception cases', () => {
    describe('Empty namespace validation', () => {
      it('should throw error for empty string', () => {
        expect(() => encodeNamespace('')).toThrow('ネームスペース名が空です');
      });

      it('should throw error for whitespace only string', () => {
        expect(() => encodeNamespace('   ')).toThrow('ネームスペース名が空です');
      });

      it('should throw error for tab and newline characters', () => {
        expect(() => encodeNamespace('\t\n')).toThrow('ネームスペース名が空です');
      });
    });

    describe('Length validation', () => {
      it('should throw error for namespace longer than 64 characters', () => {
        const longNamespace = 'a'.repeat(65);
        expect(() => encodeNamespace(longNamespace)).toThrow('ネームスペース名は64文字以下である必要があります');
      });

      it('should throw error for multi-level namespace exceeding 64 characters', () => {
        const longNamespace = 'a'.repeat(30) + '.' + 'b'.repeat(35);
        expect(() => encodeNamespace(longNamespace)).toThrow('ネームスペース名は64文字以下である必要があります');
      });
    });

    describe('Character validation', () => {
      it('should accept uppercase letters (converted to lowercase)', () => {
        // Uppercase letters are converted to lowercase, so this should not throw
        expect(() => encodeNamespace('TestNamespace')).not.toThrow();
        expect(encodeNamespace('TestNamespace')).toBe(encodeNamespace('testnamespace'));
      });

      it('should throw error for special characters', () => {
        expect(() => encodeNamespace('test@namespace')).toThrow('ネームスペース名には a-z, 0-9, _, - のみ使用できます');
      });

      it('should throw error for spaces', () => {
        expect(() => encodeNamespace('test namespace')).toThrow('ネームスペース名には a-z, 0-9, _, - のみ使用できます');
      });

      it('should throw error for Japanese characters', () => {
        expect(() => encodeNamespace('テスト')).toThrow('ネームスペース名には a-z, 0-9, _, - のみ使用できます');
      });

      it('should throw error for symbols like #, $, %', () => {
        expect(() => encodeNamespace('test#namespace')).toThrow('ネームスペース名には a-z, 0-9, _, - のみ使用できます');
        expect(() => encodeNamespace('test$namespace')).toThrow('ネームスペース名には a-z, 0-9, _, - のみ使用できます');
        expect(() => encodeNamespace('test%namespace')).toThrow('ネームスペース名には a-z, 0-9, _, - のみ使用できます');
      });
    });

    describe('Level validation', () => {
      it('should throw error for more than 3 levels', () => {
        expect(() => encodeNamespace('level1.level2.level3.level4')).toThrow('ネームスペースは最大3レベルまでです');
      });

      it('should throw error for 5 levels', () => {
        expect(() => encodeNamespace('a.b.c.d.e')).toThrow('ネームスペースは最大3レベルまでです');
      });
    });

    describe('Empty level validation', () => {
      it('should throw error for empty root level', () => {
        expect(() => encodeNamespace('.sub')).toThrow('レベル1のネームスペース名が空です');
      });

      it('should throw error for empty sub level 1', () => {
        expect(() => encodeNamespace('root.')).toThrow('レベル2のネームスペース名が空です');
      });

      it('should throw error for empty sub level 2', () => {
        expect(() => encodeNamespace('root.sub1.')).toThrow('レベル3のネームスペース名が空です');
      });

      it('should throw error for empty middle level', () => {
        expect(() => encodeNamespace('root..sub2')).toThrow('レベル2のネームスペース名が空です');
      });

      it('should throw error for multiple consecutive dots', () => {
        // Multiple consecutive dots create more than 3 levels, so level validation comes first
        expect(() => encodeNamespace('root...sub')).toThrow('ネームスペースは最大3レベルまでです');
      });
    });

    describe('Additional empty level cases', () => {
      it('should throw error for two consecutive dots at start', () => {
        expect(() => encodeNamespace('..valid')).toThrow('レベル1のネームスペース名が空です');
      });

      it('should throw error for two consecutive dots in middle', () => {
        expect(() => encodeNamespace('valid..sub')).toThrow('レベル2のネームスペース名が空です');
      });
    });

    describe('Edge cases', () => {
      it('should throw error for only dots', () => {
        // Three dots create 4 levels, so level validation comes first
        expect(() => encodeNamespace('...')).toThrow('ネームスペースは最大3レベルまでです');
      });

      it('should accept mixed case characters (converted to lowercase)', () => {
        // Mixed case is converted to lowercase, so this should not throw
        expect(() => encodeNamespace('valid.INVALID.valid')).not.toThrow();
        expect(encodeNamespace('valid.INVALID.valid')).toBe(encodeNamespace('valid.invalid.valid'));
      });

      it('should throw error for namespace starting with dot after trim', () => {
        expect(() => encodeNamespace('  .namespace')).toThrow('レベル1のネームスペース名が空です');
      });

      it('should throw error for namespace ending with dot after trim', () => {
        expect(() => encodeNamespace('namespace.  ')).toThrow('レベル2のネームスペース名が空です');
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
