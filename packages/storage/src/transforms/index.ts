import { ConfigurationError } from "../errors/index.js";

export type PayloadTransform = (payload: string) => string;

export interface PayloadTransforms {
  readonly compress?: PayloadTransform;
  readonly decompress?: PayloadTransform;
  readonly encrypt?: PayloadTransform;
  readonly decrypt?: PayloadTransform;
}

export interface SerializePair {
  readonly serialize: (value: unknown) => string;
  readonly deserialize: (raw: string) => unknown;
}

/**
 * Compose optional compress/encrypt hooks around a base serialize pair.
 *
 * Write: serialize → compress? → encrypt?
 * Read: decrypt? → decompress? → deserialize
 *
 * Sync string→string only. Defaults stay plaintext when hooks are omitted.
 * Import from `@jayoncode/storage/transforms`.
 */
export function withPayloadTransforms(
  base: SerializePair,
  transforms: PayloadTransforms = {},
): SerializePair {
  const { compress, decompress, encrypt, decrypt } = transforms;

  if ((compress && !decompress) || (!compress && decompress)) {
    throw new ConfigurationError("compress and decompress must be provided together.");
  }
  if ((encrypt && !decrypt) || (!encrypt && decrypt)) {
    throw new ConfigurationError("encrypt and decrypt must be provided together.");
  }

  return {
    serialize(value) {
      let wire = base.serialize(value);
      if (compress) {
        wire = compress(wire);
      }
      if (encrypt) {
        wire = encrypt(wire);
      }
      return wire;
    },
    deserialize(raw) {
      let plain = raw;
      if (decrypt) {
        plain = decrypt(plain);
      }
      if (decompress) {
        plain = decompress(plain);
      }
      return base.deserialize(plain);
    },
  };
}
