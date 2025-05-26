import { describe, it, expect } from 'vitest';
import { encodeNamespace } from './convert';

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
});
