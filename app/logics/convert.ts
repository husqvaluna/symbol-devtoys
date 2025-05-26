import { SymbolFacade, Network, generateNamespaceId } from "symbol-sdk/symbol";

/**
 * ネームスペース名をエンコードしてネームスペースIDを生成します
 *
 * @param value - ネームスペース名（最大64文字、a-z, 0-9, _, - のみ使用可能）
 * @param networkType - ネットワークタイプ（デフォルト: TESTNET）
 * @returns ネームスペースID
 * @throws Error 不正な入力値の場合
 */
export const encodeNamespace = (value: string): bigint => {
  const normalizedValue = value.trim().toLowerCase();

  if (!normalizedValue) {
    throw new Error('ネームスペース名が空です');
  }

  if (normalizedValue.length > 64) {
    throw new Error('ネームスペース名は64文字以下である必要があります');
  }

  if (!/^[a-z0-9_.-]+$/.test(normalizedValue)) {
    throw new Error('ネームスペース名には a-z, 0-9, _, - のみ使用できます');
  }

  const parts = normalizedValue.split('.');

  // レベル数のチェック（最大3レベル）
  if (parts.length > 3) {
    throw new Error('ネームスペースは最大3レベルまでです');
  }

  // 各レベルの名前が空でないことをチェック
  for (let i = 0; i < parts.length; i++) {
    if (!parts[i]) {
      throw new Error(`レベル${i + 1}のネームスペース名が空です`);
    }
  }

  const [root, sub1, sub2] = parts;

  // ルートネームスペースIDを生成
  const rootId = generateNamespaceId(root);

  if (sub1 == null) {
    return rootId;
  }

  // サブネームスペース1のIDを生成
  const sub1Id = generateNamespaceId(sub1, rootId);

  if (sub2 == null) {
    return sub1Id;
  }

  // サブネームスペース2のIDを生成
  const sub2Id = generateNamespaceId(sub2, sub1Id);

  return sub2Id;
}

// export const convertHexToNum = (value: string) => {
//   const parsed = parseInt(value, 16)
//   return Number.isNaN(parsed) ? "" : parsed.toString()
// }
// export const convertHexToUInt64 = (value: string) => {
//   try {
//     const uint64 = UInt64.fromHex(value.trim())
//     return `[${uint64.lower},${uint64.higher}]`
//   } catch (error) {
//     return ""
//   }
// }
//
// export const convertNumToHex = (value: string) => {
//   return parseInt(value, 10).toString(16).toUpperCase()
// }
// export const convertNumToUInt64 = (value: string) => {
//   try {
//     const uint64= UInt64.fromNumericString(value)
//     return `[${uint64.lower},${uint64.higher}]`
//   } catch (error) {
//     return ""
//   }
// }
//
// export const convertUInt64ToHex = (value: string) => {
//   const prepared = `[${value.replace(/[[\]\s]/g, "")}]`
//   try {
//     const loHi = JSON.parse(prepared)
//     return (new UInt64(loHi)).toHex()
//   } catch (error) {
//     return ""
//   }
// }
//
// export const convertUInt64ToNum = (value: string) => {
//   const prepared = `[${value.replace(/[[\]\s]/g, "")}]`
//   try {
//     const loHi = JSON.parse(prepared)
//     return parseInt((new UInt64(loHi)).toString(), 10)
//   } catch (error) {
//     return ""
//   }
// }
//
// export const convertIdentifierToNamespaceId = (value: string) => {
//   if(/[0-9a-fA-F]{16}/.test(value)) {
//     return NamespaceId.createFromEncoded(value)
//   }
//   try {
//     const namespaceId = new NamespaceId(value)
//     return namespaceId
//   } catch (_) {
//     // try next
//   }
//   const hex = convertUInt64ToHex(value)
//   if(! /[0-9a-fA-F]{16}/.test(hex)) {
//     throw new Error("Can't convert")
//   }
//   return NamespaceId.createFromEncoded(hex)
// }
//
// export const convertIdentifierToNamespaceHex = (value: string) => {
//   try {
//     const namespaceId = convertIdentifierToNamespaceId(value)
//     if(namespaceId) {
//       return namespaceId.toHex()
//     } else {
//       return /[0-9a-fA-F]{16}/.test(value) ? value : ""
//     }
//   } catch (_) {
//     return ""
//   }
// }
//
// export const convertIdentifierToMosaicId = (value: string) => {
//   if(/[0-9a-fA-F]{16}/.test(value)) {
//     return new MosaicId(value)
//   }
//   const hex = convertUInt64ToHex(value)
//   if(! /[0-9a-fA-F]{16}/.test(hex)) {
//     throw new Error("Can't convert")
//   }
//   return new MosaicId(hex)
// }
//
// export const convertIdentifierToMosaicHex = (value: string) => {
//   try {
//     return convertIdentifierToMosaicId(value).toHex()
//   } catch (_) {
//     return /[0-9a-fA-F]{16}/.test(value) ? value : ""
//   }
// }
//
// export const encodeRawToHex = (value: string) => {
//   return Convert.utf8ToHex(value)
// }
//
// export const decodeHexToRaw = (value: string) => {
//   if(! /^([0-9a-fA-F][0-9a-fA-F])+$/.test(value)) return ""
//   return Buffer.from(value, "hex").toString("utf8")
// }
//
// export const encodeAddress = (value: string) => {
//   try {
//     return RawAddress.addressToString(Convert.hexToUint8(value))
//   } catch(error) {
//     return ""
//   }
// }
//
// export const decodeAddress = (value: string) => {
//   try {
//     const plain = Address.createFromRawAddress(value).plain()
//     return Convert.uint8ToHex(RawAddress.stringToAddress(plain))
//   } catch(error) {
//     return ""
//   }
// }
//
// export const hashBySha3 = (input: string) => {
//   return sha3_256(input)
// }
//
// export const hashByKeccak = (input: string) => {
//   return keccak256(input)
// }
//
// export const hashByHash160 = (input: string) => {
//   return RIPEMD160(sha3_256(input))
// }
//
// export const hashByHash256 = (input: string) => {
//   return sha3_256(sha3_256(input))
// }
//
// export const datetimeStringToNemTimestamp = (input: string) => {
//   const msec = Date.parse(input)
//   if(Number.isNaN(msec)) return ""
//   try {
//     const nemTimestamp = msec / 1000 - Deadline.timestampNemesisBlock
//     return nemTimestamp.toString()
//   } catch(_) {
//     return ""
//   }
// }
//
// export const nemTimestampToDatetimeString = (input: string) => {
//   try {
//     const sec = parseInt(input) + Deadline.timestampNemesisBlock
//     return new Date(sec * 1000).toISOString()
//   } catch(_) {
//     return ""
//   }
// }
//
// export const createAddressFromIdentifier = (value: string, networkType?: NetworkType) => {
//   try {
//     if(/^[SMTN][0-9A-Z]{39}$/.test(value.toUpperCase().replace(/-/g, ""))){
//       return Address.createFromRawAddress(value)
//     }
//     if(networkType && /^[0-9A-Z]{64}$/.test(value.toUpperCase())){
//       return Address.createFromPublicKey(value, networkType)
//     }
//   } catch(error) {
//     console.warn(error)
//   }
//   return null
// }
//
