import { describe, it, expect } from 'vitest';
import { foo } from '.';

describe('foo', () => {
  it('should return bar', () => {
    expect(foo()).toBe('bar');
  });
});
