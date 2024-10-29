# this is a fork of [@takuyaa/doublearray](https://github.com/takuyaa/doublearray)

### build

- [Install bunjs](https://bun.sh/)

- run

```bash
bun install
bun run build
```

### test

```bash
bun test
```

```bash
bun test v1.1.33 (247456b6)

test\doublearray.test.ts:
✓ doublearray > contain > Contain bird
✓ doublearray > contain > Contain bison
✓ doublearray > contain > Lookup bird
✓ doublearray > contain > Lookup bison
✓ doublearray > contain > Build
✓ doublearray > load > Original and loaded tries lookup successfully
✓ doublearray > load > Original and loaded typed arrays are same
✓ doublearray > consistency contain > Contain bird
✓ doublearray > consistency contain > Contain bison
✓ doublearray > consistency contain > Lookup bird
✓ doublearray > consistency contain > Lookup bison
✓ doublearray > consistency contain > Build
✓ doublearray > consistency load > Original and loaded tries lookup successfully
✓ doublearray > consistency load > Original and loaded typed arrays are same

 14 pass
 0 fail
 18 expect() calls
Ran 14 tests across 1 files. [46.00ms]
```

Double-Array
============

JavaScript implementation of Double-Array trie.

Usage
-----

### Build

Node.js example

    var doublearray = require('./doublearray.ts');

    var words = [
        { k: 'a', v: 1 },
        { k: 'abc', v: 2 },
        { k: '奈良', v: 3 },
        { k: '奈良先端', v: 4 },
        { k: '奈良先端科学技術大学院大学', v: 5 }
    ];

    var trie = doublearray.builder().build(words);

Browser example

    var words = [
        { k: 'a', v: 1 },
        { k: 'abc', v: 2 },
        { k: '奈良', v: 3 },
        { k: '奈良先端', v: 4 },
        { k: '奈良先端科学技術大学院大学', v: 5 }
    ];

    var trie = doublearray.builder().build(words);

Method chaining

    var trie = doublearray
           .builder()
           .append('a', 1)
           .append('abc', 2)
           .append('奈良', 3)
           .append('奈良先端', 4)
           .append('奈良先端科学技術大学院大学', 5)
           .build();

### Search

    trie.contain('a');  // -> true

    trie.lookup('abc');  // -> 2

    trie.commonPrefixSearch('奈良先端科学技術大学院大学');
    // -> [ { v: 3, k: '奈良' },
    //      { v: 4, k: '奈良先端' },
    //      { v: 5, k: '奈良先端科学技術大学院大学' } ]

### Load

Get BASE or CHECK buffer as Int32Array of typed array

    var base_buffer = trie.bc.getBaseBuffer();
    var check_buffer = trie.bc.getCheckBuffer();

Load and create a new DoubleArray object from original buffers

    var loaded_trie = doublearray.load(base_buffer, check_buffer);

Copyright and license
---------------------

Copyright (c) 2014 Takuya Asano All Rights Reserved.

This software is released under the MIT License.
See LICENSE.txt
