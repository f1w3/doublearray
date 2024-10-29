import { describe, expect, it, beforeEach } from "bun:test";
import doublearray from "../doublearray.ts";
import type { DoubleArray } from "../doublearray.ts";
import olddoublearray from "./doublearray.js";


describe("doublearray", () => {
    describe("consistency load", () => {
        const words = [{ k: "apple", v: 1 }];
        let trie: DoubleArray;
        let loadTrie: DoubleArray;
        let oldTrie: DoubleArray;
        let oldLoadTrie: DoubleArray;
        beforeEach((done) => {
            trie = doublearray.builder().build(words);
            oldTrie = olddoublearray.builder().build(words);
            const baseBuffer = trie.bc.getBaseBuffer();
            const checkBuffer = trie.bc.getCheckBuffer();
            const oldBaseBuffer = oldTrie.bc.getBaseBuffer();
            const oldCheckBuffer = oldTrie.bc.getCheckBuffer();
            if (!baseBuffer || !checkBuffer || !oldBaseBuffer || !oldCheckBuffer) {
                throw new Error("Failed to get typed arrays");
            }
            loadTrie = doublearray.load(baseBuffer, checkBuffer);
            oldLoadTrie = olddoublearray.load(oldBaseBuffer, oldCheckBuffer);
            done();
        });
        it("Original and loaded tries lookup successfully", () => {
            expect(trie.lookup("apple")).toBe(oldTrie.lookup("apple"));
            expect(loadTrie.lookup("apple")).toBe(oldLoadTrie.lookup("apple"));
        });
        it("Original and loaded typed arrays are same", () => {
            expect(trie.bc.getBaseBuffer()).toEqual(oldTrie.bc.getBaseBuffer());
            expect(loadTrie.bc.getCheckBuffer()).toEqual(oldLoadTrie.bc.getCheckBuffer());
        });
    });

    describe("contain", () => {
        const dict: { [key: string]: number } = {
            "apple": 1,
            "ball": 2,
            "bear": 3,
            "bird": 4,
            "bison": 5,
            "black": 6,
            "blue": 7,
            "blur": 8,
            "cold": 10,
            "column": 11,
            "cow": 12
        };
        const words: { k: string, v: number }[] = [];
        for (const key in dict) {
            dict[key];
            words.push({ k: key, v: dict[key] });
        }

        it("Contain bird", () => {
            const trie = doublearray.builder().build(words);
            expect(trie.contain("bird")).toBe(true);
        });

        it("Contain bison", () => {
            const trie = doublearray.builder().build(words);
            expect(trie.contain("bison")).toBe(true);
        });

        it("Lookup bird", () => {
            const trie = doublearray.builder().build(words);
            expect(trie.lookup("bird")).toBe(dict["bird"]);
        });

        it("Lookup bison", () => {
            const trie = doublearray.builder().build(words);
            expect(trie.lookup("bison")).toBe(dict["bison"]);
        });

        it("Build", () => {
            const trie = doublearray.builder(4).build(words);
            expect(trie.lookup("bison")).toBe(dict["bison"]);
        });
    });

    describe("load", () => {
        const words = [{ k: "apple", v: 1 }];
        let trie: DoubleArray;
        let load_trie: DoubleArray;
        beforeEach((done) => {
            trie = doublearray.builder().build(words);
            const base_buffer = trie.bc.getBaseBuffer();
            const check_buffer = trie.bc.getCheckBuffer();
            if (!base_buffer || !check_buffer) {
                throw new Error("Failed to get typed arrays");
            }
            load_trie = doublearray.load(base_buffer, check_buffer);
            done();
        });
        it("Original and loaded tries lookup successfully", () => {
            expect(trie.lookup("apple")).toBe(words[0].v);
            expect(load_trie.lookup("apple")).toBe(words[0].v);
        });
        it("Original and loaded typed arrays are same", () => {
            expect(trie.bc.getBaseBuffer()).toEqual(load_trie.bc.getBaseBuffer());
            expect(trie.bc.getCheckBuffer()).toEqual(load_trie.bc.getCheckBuffer());
        });
    });

    describe("consistency contain", () => {
        const dict: { [key: string]: number } = {
            "apple": 1,
            "ball": 2,
            "bear": 3,
            "bird": 4,
            "bison": 5,
            "black": 6,
            "blue": 7,
            "blur": 8,
            "cold": 10,
            "column": 11,
            "cow": 12
        };
        const words: { k: string, v: number }[] = [];
        for (const key in dict) {
            dict[key];
            words.push({ k: key, v: dict[key] });
        }

        it("Contain bird", () => {
            const trie = doublearray.builder().build(words);
            const oldTrie = olddoublearray.builder().build(words);
            expect(trie.contain("bird")).toBe(oldTrie.contain("bird"));
        });

        it("Contain bison", () => {
            const trie = doublearray.builder().build(words);
            const oldTrie = olddoublearray.builder().build(words);
            expect(trie.contain("bison")).toBe(oldTrie.contain("bison"));
        });

        it("Lookup bird", () => {
            const trie = doublearray.builder().build(words);
            const oldTrie = olddoublearray.builder().build(words);
            expect(trie.lookup("bird")).toBe(oldTrie.lookup("bird"));
        });

        it("Lookup bison", () => {
            const trie = doublearray.builder().build(words);
            const oldTrie = olddoublearray.builder().build(words);
            expect(trie.lookup("bison")).toBe(oldTrie.lookup("bison"));
        });

        it("Build", () => {
            const trie = doublearray.builder(4).build(words);
            const oldTrie = olddoublearray.builder(4).build(words);
            expect(trie.lookup("bison")).toBe(oldTrie.lookup("bison"));
        });
    });
});