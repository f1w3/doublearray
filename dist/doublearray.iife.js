// Copyright (c) 2014 Takuya Asano All Rights Reserved.
// rewrite by @f1w3_ | 2024

"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __moduleCache = /* @__PURE__ */ new WeakMap;
  var __toCommonJS = (from) => {
    var entry = __moduleCache.get(from), desc;
    if (entry)
      return entry;
    entry = __defProp({}, "__esModule", { value: true });
    if (from && typeof from === "object" || typeof from === "function")
      __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
        get: () => from[key],
        enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
      }));
    __moduleCache.set(from, entry);
    return entry;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, {
        get: all[name],
        enumerable: true,
        configurable: true,
        set: (newValue) => all[name] = () => newValue
      });
  };

  // doublearray.ts
  var exports_doublearray = {};
  __export(exports_doublearray, {
    default: () => doublearray_default,
    DoubleArrayBuilder: () => DoubleArrayBuilder,
    DoubleArray: () => DoubleArray
  });
  var TERM_CHAR = "\0";
  var TERM_CODE = 0;
  var ROOT_ID = 0;
  var NOT_FOUND = -1;
  var BASE_SIGNED = true;
  var CHECK_SIGNED = true;
  var BASE_BYTES = 4;
  var CHECK_BYTES = 4;
  var MEMORY_EXPAND_RATIO = 2;
  var newArrayBuffer = (signed, bytes, size) => {
    if (signed) {
      switch (bytes) {
        case 1:
          return new Int8Array(size);
        case 2:
          return new Int16Array(size);
        case 4:
          return new Int32Array(size);
        default:
          throw new RangeError("Invalid newArray parameter element_bytes:" + bytes);
      }
    } else {
      switch (bytes) {
        case 1:
          return new Uint8Array(size);
        case 2:
          return new Uint16Array(size);
        case 4:
          return new Uint32Array(size);
        default:
          throw new RangeError("Invalid newArray parameter element_bytes:" + bytes);
      }
    }
  };
  var arrayCopy = (src, src_offset, length) => {
    var buffer = new ArrayBuffer(length);
    var dstU8 = new Uint8Array(buffer, 0, length);
    var srcU8 = src.subarray(src_offset, length);
    dstU8.set(srcU8);
    return dstU8;
  };
  var stringToUtf8Bytes = (str) => {
    const bytes = new Uint8Array(str.length * 4);
    let j = 0;
    for (let i = 0;i < str.length; i++) {
      let unicode_code = str.charCodeAt(i);
      if (unicode_code >= 55296 && unicode_code <= 56319) {
        if (i + 1 < str.length) {
          const lower = str.charCodeAt(++i);
          if (lower >= 56320 && lower <= 57343) {
            unicode_code = (unicode_code - 55296 << 10) + (lower - 56320) + 65536;
          } else {
            return null;
          }
        } else {
          return null;
        }
      }
      if (unicode_code < 128) {
        bytes[j++] = unicode_code;
      } else if (unicode_code < 2048) {
        bytes[j++] = 192 | unicode_code >>> 6;
        bytes[j++] = 128 | unicode_code & 63;
      } else if (unicode_code < 65536) {
        bytes[j++] = 224 | unicode_code >>> 12;
        bytes[j++] = 128 | unicode_code >>> 6 & 63;
        bytes[j++] = 128 | unicode_code & 63;
      } else if (unicode_code < 1114112) {
        bytes[j++] = 240 | unicode_code >>> 18;
        bytes[j++] = 128 | unicode_code >>> 12 & 63;
        bytes[j++] = 128 | unicode_code >>> 6 & 63;
        bytes[j++] = 128 | unicode_code & 63;
      } else {
        return null;
      }
    }
    return bytes.subarray(0, j);
  };
  var utf8BytesToString = (bytes) => {
    const strArray = [];
    let i = 0;
    while (i < bytes.length) {
      const b1 = bytes[i++];
      let code;
      if (b1 < 128) {
        code = b1;
      } else if (b1 >> 5 === 6) {
        const b2 = bytes[i++];
        code = (b1 & 31) << 6 | b2 & 63;
      } else if (b1 >> 4 === 14) {
        const b2 = bytes[i++];
        const b3 = bytes[i++];
        code = (b1 & 15) << 12 | (b2 & 63) << 6 | b3 & 63;
      } else {
        const b2 = bytes[i++];
        const b3 = bytes[i++];
        const b4 = bytes[i++];
        code = (b1 & 7) << 18 | (b2 & 63) << 12 | (b3 & 63) << 6 | b4 & 63;
      }
      if (code < 65536) {
        strArray.push(String.fromCharCode(code));
      } else {
        code -= 65536;
        strArray.push(String.fromCharCode(55296 | code >> 10));
        strArray.push(String.fromCharCode(56320 | code & 1023));
      }
    }
    return strArray.join("");
  };
  var newBC = (initial_size = 1024) => {
    const initBase = (_base, start, end) => {
      if (!check.array) {
        throw new Error("check array is not initialized");
      }
      for (let i = start;i < end; i++) {
        _base[i] = -i + 1;
      }
      if (0 < check.array[check.array.length - 1]) {
        let last_used_id = check.array.length - 2;
        while (0 < check.array[last_used_id]) {
          last_used_id--;
        }
        _base[start] = -last_used_id;
      }
    };
    const initCheck = (_check, start, end) => {
      for (let i = start;i < end; i++) {
        _check[i] = -i - 1;
      }
    };
    const realloc = (min_size) => {
      const new_size = min_size * MEMORY_EXPAND_RATIO;
      const base_new_array = newArrayBuffer(base.signed, base.bytes, new_size);
      if (!base.array)
        throw new Error("realloc failed. base.array is null");
      initBase(base_new_array, base.array.length, new_size);
      base_new_array.set(base.array);
      base.array = null;
      base.array = base_new_array;
      const check_new_array = newArrayBuffer(check.signed, check.bytes, new_size);
      if (!check.array)
        throw new Error("realloc failed. check.array is null");
      initCheck(check_new_array, check.array.length, new_size);
      check_new_array.set(check.array);
      check.array = null;
      check.array = check_new_array;
    };
    let first_unused_node = ROOT_ID + 1;
    const base = {
      signed: BASE_SIGNED,
      bytes: BASE_BYTES,
      array: newArrayBuffer(BASE_SIGNED, BASE_BYTES, initial_size)
    };
    const check = {
      signed: CHECK_SIGNED,
      bytes: CHECK_BYTES,
      array: newArrayBuffer(CHECK_SIGNED, CHECK_BYTES, initial_size)
    };
    if (!base.array) {
      throw new Error("base.array is null");
    }
    if (!check.array) {
      throw new Error("check.array is null");
    }
    base.array[ROOT_ID] = 1;
    check.array[ROOT_ID] = ROOT_ID;
    initBase(base.array, ROOT_ID + 1, base.array.length);
    initCheck(check.array, ROOT_ID + 1, check.array.length);
    return {
      getBaseBuffer: () => {
        return base.array;
      },
      getCheckBuffer: () => {
        return check.array;
      },
      loadBaseBuffer: (base_buffer) => {
        base.array = base_buffer;
        return null;
      },
      loadCheckBuffer: (check_buffer) => {
        check.array = check_buffer;
        return null;
      },
      size: () => {
        if (!base.array) {
          throw new Error("base.array is null");
        }
        if (!check.array) {
          throw new Error("check.array is null");
        }
        return Math.max(base.array.length, check.array.length);
      },
      getBase: (index) => {
        if (!base.array) {
          throw new Error("base.array is null");
        }
        if (base.array.length - 1 < index) {
          return -index + 1;
        }
        return base.array[index];
      },
      getCheck: (index) => {
        if (!check.array) {
          throw new Error("check.array is null");
        }
        if (check.array.length - 1 < index) {
          return -index - 1;
        }
        return check.array[index];
      },
      setBase: (index, base_value) => {
        if (!base.array) {
          throw new Error("base.array is null");
        }
        if (base.array.length - 1 < index) {
          realloc(index);
        }
        base.array[index] = base_value;
      },
      setCheck: (index, check_value) => {
        if (!check.array) {
          throw new Error("check.array is null");
        }
        if (check.array.length - 1 < index) {
          realloc(index);
        }
        check.array[index] = check_value;
      },
      setFirstUnusedNode: (index) => {
        first_unused_node = index;
      },
      getFirstUnusedNode: function() {
        return first_unused_node;
      },
      shrink: () => {
        if (!base.array) {
          throw new Error("base.array is null");
        }
        if (!check.array) {
          throw new Error("check.array is null");
        }
        let last_index = Math.max(base.array.length, check.array.length);
        while (true) {
          if (0 <= check.array[last_index]) {
            break;
          }
          last_index--;
        }
        base.array = base.array.subarray(0, last_index + 2);
        check.array = check.array.subarray(0, last_index + 2);
      },
      calc: () => {
        if (!base.array) {
          throw new Error("base.array is null");
        }
        if (!check.array) {
          throw new Error("check.array is null");
        }
        let unused_count = 0;
        const size = check.array.length;
        for (let i = 0;i < size; i++) {
          if (check.array[i] < 0) {
            unused_count++;
          }
        }
        return {
          all: size,
          unused: unused_count,
          efficiency: (size - unused_count) / size
        };
      },
      dump: () => {
        if (!base.array) {
          throw new Error("base.array is null");
        }
        if (!check.array) {
          throw new Error("check.array is null");
        }
        let dump_base = "";
        let dump_check = "";
        for (const data of base.array) {
          dump_base = dump_base + " " + data;
        }
        for (const data of check.array) {
          dump_check = dump_check + " " + data;
        }
        console.log("base:" + dump_base);
        console.log("chck:" + dump_check);
        return "base:" + dump_base + " chck:" + dump_check;
      }
    };
  };

  class DoubleArrayBuilder {
    bc;
    keys;
    constructor(initial_size = 1024) {
      this.bc = newBC(initial_size);
      this.keys = [];
    }
    append(key, record) {
      this.keys.push({ k: key, v: record });
      return this;
    }
    build(keys = this.keys, sorted = false) {
      if (keys == null) {
        return new DoubleArray(this.bc);
      }
      let buff_keys = keys.map((k) => {
        return {
          k: stringToUtf8Bytes(k.k + TERM_CHAR),
          v: k.v
        };
      });
      if (sorted) {
        this.keys = buff_keys;
      } else {
        this.keys = buff_keys.sort((k1, k2) => {
          const b1 = k1.k;
          const b2 = k2.k;
          const min_length = Math.min(b1.length, b2.length);
          for (let pos = 0;pos < min_length; pos++) {
            if (b1[pos] === b2[pos]) {
              continue;
            }
            return b1[pos] - b2[pos];
          }
          return b1.length - b2.length;
        });
      }
      buff_keys = null;
      this._build(ROOT_ID, 0, 0, this.keys.length);
      return new DoubleArray(this.bc);
    }
    _build(parent_index, position, start, length) {
      const children_info = this.getChildrenInfo(position, start, length);
      const _base = this.findAllocatableBase(children_info);
      this.setBC(parent_index, children_info, _base);
      let i = 0;
      for (const child_code of children_info) {
        if (child_code === TERM_CODE) {
          continue;
        }
        const child_start = children_info[i + 1];
        const child_len = children_info[i + 2];
        const child_index = _base + child_code;
        this._build(child_index, position + 1, child_start, child_len);
        i = i + 1;
      }
    }
    getChildrenInfo(position, start, length) {
      let current_char = this.keys[start].k[position];
      let children_info = new Int32Array(length * 3);
      let i = 0;
      children_info[i++] = parseInt(current_char);
      children_info[i++] = start;
      let next_pos = start;
      let start_pos = start;
      for (;next_pos < start + length; next_pos++) {
        const next_char = this.keys[next_pos].k[position];
        if (current_char !== next_char) {
          children_info[i++] = next_pos - start_pos;
          children_info[i++] = parseInt(next_char);
          children_info[i++] = next_pos;
          current_char = next_char;
          start_pos = next_pos;
        }
      }
      children_info[i++] = next_pos - start_pos;
      children_info = children_info.subarray(0, i);
      return children_info;
    }
    setBC(parent_id, children_info, _base) {
      const bc = this.bc;
      bc.setBase(parent_id, _base);
      let i = 0;
      for (const code of children_info) {
        const child_id = _base + code;
        const prev_unused_id = -bc.getBase(child_id);
        const next_unused_id = -bc.getCheck(child_id);
        if (child_id !== bc.getFirstUnusedNode()) {
          bc.setCheck(prev_unused_id, -next_unused_id);
        } else {
          bc.setFirstUnusedNode(next_unused_id);
        }
        bc.setBase(next_unused_id, -prev_unused_id);
        const check = parent_id;
        bc.setCheck(child_id, check);
        if (code === TERM_CODE) {
          const start_pos = children_info[i + 1];
          let value = this.keys[start_pos].v;
          if (value == null) {
            value = 0;
          }
          const base = -value - 1;
          bc.setBase(child_id, base);
        }
        i = i + 1;
      }
    }
    findAllocatableBase(children_info) {
      const bc = this.bc;
      let _base;
      let curr = bc.getFirstUnusedNode();
      while (true) {
        _base = curr - children_info[0];
        if (_base < 0) {
          curr = -bc.getCheck(curr);
          continue;
        }
        let empty_area_found = true;
        for (const code of children_info) {
          const candidate_id = _base + code;
          if (!this.isUnusedNode(candidate_id)) {
            curr = -bc.getCheck(curr);
            empty_area_found = false;
            break;
          }
        }
        if (empty_area_found) {
          return _base;
        }
      }
    }
    isUnusedNode(index) {
      const bc = this.bc;
      const check = bc.getCheck(index);
      if (index === ROOT_ID) {
        return false;
      }
      if (check < 0) {
        return true;
      }
      return false;
    }
  }

  class DoubleArray {
    bc;
    constructor(bc) {
      this.bc = bc;
      this.bc.shrink();
    }
    contain(key) {
      const bc = this.bc;
      key += TERM_CHAR;
      const buffer = stringToUtf8Bytes(key);
      if (!buffer) {
        throw new Error("invalid key");
      }
      let parent = ROOT_ID;
      let child = NOT_FOUND;
      for (const code of buffer) {
        child = this.traverse(parent, code);
        if (child === NOT_FOUND) {
          return false;
        }
        if (bc.getBase(child) <= 0) {
          return true;
        } else {
          parent = child;
          continue;
        }
      }
      return false;
    }
    lookup(key) {
      key += TERM_CHAR;
      const buffer = stringToUtf8Bytes(key);
      if (!buffer) {
        throw new Error("invalid key");
      }
      let parent = ROOT_ID;
      let child = NOT_FOUND;
      for (const code of buffer) {
        child = this.traverse(parent, code);
        if (child === NOT_FOUND) {
          return NOT_FOUND;
        }
        parent = child;
      }
      const base = this.bc.getBase(child);
      if (base <= 0) {
        return -base - 1;
      } else {
        return NOT_FOUND;
      }
    }
    commonPrefixSearch(key) {
      const buffer = stringToUtf8Bytes(key);
      if (!buffer) {
        throw new Error("invalid key");
      }
      const result = [];
      let parent = ROOT_ID;
      let child = NOT_FOUND;
      let i = 0;
      for (const code of buffer) {
        child = this.traverse(parent, code);
        if (child !== NOT_FOUND) {
          parent = child;
          const grand_child = this.traverse(child, TERM_CODE);
          if (grand_child !== NOT_FOUND) {
            const base = this.bc.getBase(grand_child);
            const r = { k: "", v: -1 };
            if (base <= 0) {
              r.v = -base - 1;
            }
            r.k = utf8BytesToString(arrayCopy(buffer, 0, i + 1));
            result.push(r);
          }
          continue;
        } else {
          break;
        }
        i = i + 1;
      }
      return result;
    }
    traverse(parent, code) {
      const child = this.bc.getBase(parent) + code;
      if (this.bc.getCheck(child) === parent) {
        return child;
      } else {
        return NOT_FOUND;
      }
    }
    size() {
      return this.bc.size();
    }
    calc() {
      return this.bc.calc();
    }
    dump() {
      return this.bc.dump();
    }
  }
  var doublearray = {
    builder: (initial_size = 1024) => {
      return new DoubleArrayBuilder(initial_size);
    },
    load: (base_buffer, check_buffer) => {
      const bc = newBC(0);
      bc.loadBaseBuffer(base_buffer);
      bc.loadCheckBuffer(check_buffer);
      return new DoubleArray(bc);
    }
  };
  var doublearray_default = doublearray;
})();

//# debugId=4183D2E71C2FA3E664756E2164756E21
//# sourceMappingURL=doublearray.iife.js.map
