import { TSESTree } from '@typescript-eslint/utils';

import { createTestingLibraryRule } from '../create-testing-library-rule';

export const RULE_NAME = 'await-async-act';
export type MessageIds = 'useAsyncAct' | 'awaitAsyncAct';
type Options = [];

export default createTestingLibraryRule<Options, MessageIds>({
	name: RULE_NAME,
	meta: {
		type: 'problem',
		docs: {
			description: 'Enforce using the async version of act()',
			recommendedConfig: {
				dom: false,
				angular: false,
				react: 'error',
				vue: false,
				svelte: false,
				marko: false,
			},
		},
		messages: {
			useAsyncAct: 'Use the async version of act()',
			awaitAsyncAct: 'Promise returned from act() should be awaited',
		},
		schema: [],
	},
	defaultOptions: [],

	create(context, _, helpers) {
		return {
			'CallExpression[callee.name="act"][arguments.0.async=false]'(
				node: TSESTree.CallExpression & {
					callee: TSESTree.Identifier;
				}
			) {
				if (!helpers.isActUtil(node.callee)) {
					return;
				}

				context.report({
					node,
					messageId: 'useAsyncAct',
				});
			},

			'CallExpression[callee.name="act"][arguments.0.async=true][parent.type!="AwaitExpression"]'(
				node: TSESTree.CallExpression & {
					callee: TSESTree.Identifier;
				}
			) {
				if (!helpers.isActUtil(node.callee)) {
					return;
				}

				context.report({
					node,
					messageId: 'awaitAsyncAct',
				});
			},
		};
	},
});
