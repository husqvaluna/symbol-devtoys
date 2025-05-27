import { describe, it, expect } from 'vitest';
import { Address, Network } from 'symbol-sdk/symbol';
import { encodeNamespace,
  datetimeStringToNetworkTimestamp,
  networkTimestampToDatetimeString,
  encodeAddress,
  decodeAddress,
  fromHexToUTF8,
  fromUTF8ToHex
} from './convert';

describe('datetimeStringToNetworkTimestamp', () => {
  describe('Valid cases', () => {
    it('should return correct timestamp on TESTNET', () => {
      const result = datetimeStringToNetworkTimestamp('2022-10-31T21:07:47Z');
      expect(result.timestamp).toBe(0n);
    });

    it('should return correct timestamp on MAINNET', () => {
      const result = datetimeStringToNetworkTimestamp('2021-03-16T00:06:25Z', Network.MAINNET);
      expect(result.timestamp).toBe(0n);
    });
  })
});

describe('networkTimestampToDatetimeString', () => {
  describe('Valid cases', () => {
    it('should return correct timestamp on TESTNET', () => {
      const result = networkTimestampToDatetimeString(0n);
      expect(result).toEqual(Network.TESTNET.datetimeConverter.epoch);
    });

    it('should return correct timestamp on MAINNET', () => {
      const result = networkTimestampToDatetimeString(0n, Network.MAINNET);
      expect(result).toEqual(Network.MAINNET.datetimeConverter.epoch);
    });
  })
});

describe('encodeAddress', () => {
  describe('Valid cases', () => {
    it('should return correct address on TESTNET', () => {
      const result = encodeAddress("98223AF34A98119217DC2427C6DE7F577A33D8242A2F54C3");
      expect(result.toString()).toBe("TARDV42KTAIZEF64EQT4NXT7K55DHWBEFIXVJQY");
    });

    it('should return correct address on MAINNET', () => {
      const result = encodeAddress("688E494F708C25C4E4CE77B933FDA54E81EDE01F9BD9D7DD");
      expect(result.toString()).toBe("NCHEST3QRQS4JZGOO64TH7NFJ2A63YA7TPM5PXI");
    });
  })
});

describe('decodeAddress', () => {
  describe('Valid cases', () => {
    it('should return correct raw address on TESTNET', () => {
      const address = new Address("TARDV42KTAIZEF64EQT4NXT7K55DHWBEFIXVJQY")
      const result = decodeAddress(address);
      expect(result).toBe("98223AF34A98119217DC2427C6DE7F577A33D8242A2F54C3");
    });

    it('should return correct raw address on MAINNET', () => {
      const address = new Address("NCHEST3QRQS4JZGOO64TH7NFJ2A63YA7TPM5PXI")
      const result = decodeAddress(address);
      expect(result).toBe("688E494F708C25C4E4CE77B933FDA54E81EDE01F9BD9D7DD");
    });
  })
});

describe('fromUTF8ToHex', () => {
  describe('Valid cases', () => {
    it('should return correct hex string', () => {
      const result = fromUTF8ToHex("GOOD LUCK!");
      expect(result).toBe("474F4F44204C55434B21");
    });
  })
});

describe('fromHexToUTF8', () => {
  describe('Valid cases', () => {
    it('should return correct string', () => {
      const result = fromHexToUTF8("474F4F44204C55434B21");
      expect(result).toBe("GOOD LUCK!");
    });
  })
});

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
});
