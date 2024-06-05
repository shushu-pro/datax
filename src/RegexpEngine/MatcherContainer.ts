import { Cursor } from '.';
import { HookMatcher, RuleMatcher } from './matcher';
import { DefineMatcher } from './types';

export class MatcherContainer {
  private allMatchers: Record<string, RuleMatcher | HookMatcher>;

  constructor(option: MatcherContainerOption) {
    this.allMatchers = {};
    this.initBuiltinMatchers();
    this.initHookMatchers(option.matchers);

    // console.info(this.allMatchers);
  }

  add(id: string, option: DefineMatcher) {
    this.allMatchers[id] = new HookMatcher(option, id);
  }

  get matchers() {
    return this.allMatchers;
  }

  private initBuiltinMatchers() {
    const { allMatchers } = this;
    (
      [
        ['w', (cr: Cursor) => /\w/.test(cr.read())],
        ['W', (cr: Cursor) => /\W/.test(cr.read())],
        ['d', (cr: Cursor) => /\d/.test(cr.read())],
        ['D', (cr: Cursor) => /\D/.test(cr.read())],
        ['s', (cr: Cursor) => /\s/.test(cr.read())],
        ['S', (cr: Cursor) => /\S/.test(cr.read())],
        ['eol', (cr: Cursor) => cr.read() === Cursor.EOL],
        ['.', (cr: Cursor) => cr.read() !== Cursor.EOL],
      ] as const
    ).forEach(([id, match]) => {
      allMatchers[id] = new RuleMatcher(match, id);
    });
  }

  private initHookMatchers(matchers: MatcherOptions) {
    if (matchers) {
      Object.keys(matchers).forEach((key) => {
        this.add(key, matchers[key]);
      });
    }
  }
}

interface MatcherContainerOption {
  matchers?: MatcherOptions;
}

export type MatcherOptions = Record<string, DefineMatcher>;
