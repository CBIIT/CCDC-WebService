import { afterEach, describe, expect, test, vi } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const mysql = require('../Components/mysql');
const applicationService = require('./application.service');

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getGlossaryTermsByFirstLetter', () => {
  test.each([
    undefined,
    null,
    '',
    'AB',
    1,
    true,
    [],
    ['A'],
    ["x' UNION SELECT 1, 2, 3, 4 -- "],
    { length: 1, 0: 'A' },
  ])('rejects invalid input %j before querying', async (firstLetter) => {
    const query = vi.spyOn(mysql, 'query').mockResolvedValue([]);

    await expect(applicationService.getGlossaryTermsByFirstLetter(firstLetter))
      .rejects.toThrow('Argument should be exactly one character long.');
    expect(query).not.toHaveBeenCalled();
  });

  test.each(['A', "'", '\\'])('escapes the prefix for %j and returns its terms', async (firstLetter) => {
    const rows = [{ name: `${firstLetter} term`, category: 'test', definition: 'definition', reference: '' }];
    const query = vi.spyOn(mysql, 'query').mockResolvedValue(rows);
    const format = vi.spyOn(mysql, 'format');

    await expect(applicationService.getGlossaryTermsByFirstLetter(firstLetter))
      .resolves.toEqual({ [firstLetter]: rows });
    expect(format).toHaveBeenCalledWith(expect.stringContaining('WHERE term_name LIKE ?'), [`${firstLetter}%`]);
    expect(query).toHaveBeenCalledExactlyOnceWith(format.mock.results[0].value);
    const escapedPrefix = firstLetter === "'" ? "\\'" : firstLetter === '\\' ? '\\\\' : firstLetter;
    expect(query.mock.calls[0][0]).toContain(`WHERE term_name LIKE '${escapedPrefix}%'`);
  });
});
