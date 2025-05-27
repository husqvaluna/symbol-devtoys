import { Address, generateNamespaceId, Network, NetworkTimestamp } from "symbol-sdk/symbol";
import { utils } from "symbol-sdk";

export const datetimeStringToNetworkTimestamp = (input: string, network: Network = Network.TESTNET): NetworkTimestamp => {
  return network.fromDatetime(new Date(input))
}

export const networkTimestampToDatetimeString = (input: bigint, network: Network = Network.TESTNET): Date => {
  return network.datetimeConverter.toDatetime(Number(input))
}

export const encodeAddress = (value: string): Address => {
  return Address.fromDecodedAddressHexString(value);
}

export const decodeAddress = (value: Address): string => {
  return utils.uint8ToHex(value.bytes)
}

export const fromUTF8ToHex = (value: string) => {
  return utils.uint8ToHex(new TextEncoder().encode(value))
}

export const fromHexToUTF8 = (value: string) => {
  return new TextDecoder().decode(utils.hexToUint8(value))
}




/**
 * Encodes namespace name to generate namespace ID
 *
 * @param value - Namespace name (max 64 characters, only a-z, 0-9, _, - allowed)
 * @param networkType - Network type (default: TESTNET)
 * @returns Namespace ID
 * @throws Error for invalid input values
 */
export const encodeNamespace = (value: string): bigint => {
  const normalizedValue = value.trim().toLowerCase();

  if (!normalizedValue) {
    throw new Error('Namespace name is empty');
  }

  if (normalizedValue.length > 64) {
    throw new Error('Namespace name must be 64 characters or less');
  }

  if (!/^[a-z0-9_.-]+$/.test(normalizedValue)) {
    throw new Error('Namespace name can only use a-z, 0-9, _, -');
  }

  const parts = normalizedValue.split('.');

  // Check number of levels (maximum 3 levels)
  if (parts.length > 3) {
    throw new Error('Namespace can have maximum 3 levels');
  }

  // Check that each level name is not empty
  for (let i = 0; i < parts.length; i++) {
    if (!parts[i]) {
      throw new Error(`Level ${i + 1} namespace name is empty`);
    }
  }

  const [root, sub1, sub2] = parts;

  // Generate root namespace ID
  const rootId = generateNamespaceId(root);

  if (sub1 == null) {
    return rootId;
  }

  // Generate sub-namespace 1 ID
  const sub1Id = generateNamespaceId(sub1, rootId);

  if (sub2 == null) {
    return sub1Id;
  }

  // Generate sub-namespace 2 ID
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
