import { describe, expect, test } from 'vitest';
import { get } from './helpers';

describe('get', () => {
  test('単一キーで値を取得できる', () => {
    const obj = { foo: 'bar' };
    expect(get(obj, 'foo')).toBe('bar');
  });

  test('ネストしたキーで値を取得できる', () => {
    const obj = { foo: { bar: 'baz' } };
    expect(get(obj, 'foo.bar')).toBe('baz');
  });

  test('深くネストしたキーで値を取得できる', () => {
    const obj = { a: { b: { c: { d: 'deep' } } } };
    expect(get(obj, 'a.b.c.d')).toBe('deep');
  });

  test('存在しないキーはundefinedを返す', () => {
    const obj = { foo: 'bar' };
    expect(get(obj, 'baz')).toBeUndefined();
  });

  test('存在しないネストキーはundefinedを返す', () => {
    const obj = { foo: { bar: 'baz' } };
    expect(get(obj, 'foo.qux')).toBeUndefined();
  });

  test('途中のパスが存在しない場合はundefinedを返す', () => {
    const obj = { foo: 'bar' };
    expect(get(obj, 'foo.bar.baz')).toBeUndefined();
  });

  test('nullオブジェクトはundefinedを返す', () => {
    expect(get(null, 'foo')).toBeUndefined();
  });

  test('undefinedオブジェクトはundefinedを返す', () => {
    expect(get(undefined, 'foo')).toBeUndefined();
  });

  test('配列のインデックスアクセスができる', () => {
    const obj = { items: ['a', 'b', 'c'] };
    expect(get(obj, 'items.1')).toBe('b');
  });

  test('オブジェクト自体を取得できる', () => {
    const obj = { foo: { bar: 'baz' } };
    expect(get(obj, 'foo')).toEqual({ bar: 'baz' });
  });

  test('数値の値を取得できる', () => {
    const obj = { count: 42 };
    expect(get(obj, 'count')).toBe(42);
  });

  test('booleanの値を取得できる', () => {
    const obj = { active: true };
    expect(get(obj, 'active')).toBe(true);
  });
});
