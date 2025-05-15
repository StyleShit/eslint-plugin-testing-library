import rule, { RULE_NAME } from '../../../lib/rules/await-async-act';
import { createRuleTester } from '../test-utils';

const ruleTester = createRuleTester();

ruleTester.run(RULE_NAME, rule, {
	valid: [
		`
    import { act } from '@testing-library/react';

    test('test', async () => {
      await act(async () => {
        render(<MyComponent />);
      });
    });
    `,

		`
    import { act } from '@testing-library/react';

    test('test', async () => {
      await act(async function () {
        render(<MyComponent />);
      });
    });
    `,

		`
    import { act } from 'not-testing-library';

    test('test', () => {
      act(() => {
        // code
      });
    });
    `,
	],

	invalid: [
		{
			code: `
        import { act } from '@testing-library/react';

        test('test', () => {
          act(() => {
            render(<MyComponent />);
          });
        });
      `,
			errors: [
				{
					messageId: 'useAsyncAct',
					line: 5,
					column: 11,
					endLine: 7,
					endColumn: 13,
				},
			],
		},

		{
			code: `
        import { act } from '@testing-library/react';

        test('test', () => {
          act(function () {
            render(<MyComponent />);
          });
        });
      `,
			errors: [
				{
					messageId: 'useAsyncAct',
					line: 5,
					column: 11,
					endLine: 7,
					endColumn: 13,
				},
			],
		},

		{
			code: `
        import { act } from '@testing-library/react';

        test('test', () => {
          act(async () => {
            render(<MyComponent />);
          });
        });
      `,
			errors: [
				{
					messageId: 'awaitAsyncAct',
					line: 5,
					column: 11,
					endLine: 7,
					endColumn: 13,
				},
			],
		},

		{
			code: `
        import { act } from '@testing-library/react';

        test('test', () => {
          act(async function () {
            render(<MyComponent />);
          });
        });
      `,
			errors: [
				{
					messageId: 'awaitAsyncAct',
					line: 5,
					column: 11,
					endLine: 7,
					endColumn: 13,
				},
			],
		},

		{
			code: `
        import { act as customAct } from '@testing-library/react';

        test('test', () => {
          customAct(() => {
            render(<MyComponent />);
          });
        });
      `,
			errors: [
				{
					messageId: 'useAsyncAct',
					line: 5,
					column: 11,
					endLine: 7,
					endColumn: 13,
				},
			],
		},

		{
			code: `
        import { act } from '@testing-library/react';

        const wrappedAct = (fn) => {
          return act(fn);
        }

        test('test', () => {
          wrappedAct(() => {
            render(<MyComponent />);
          });
        });
      `,
			errors: [
				{
					messageId: 'useAsyncAct',
					line: 5,
					column: 11,
					endLine: 7,
					endColumn: 13,
				},
			],
		},
	],
});
