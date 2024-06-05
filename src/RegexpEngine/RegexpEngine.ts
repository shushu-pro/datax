import { MyBuilder } from './Builder';
import { Cursor } from './Cursor';
import { Explainer } from './Explainer';
import { RootMatcher } from './matcher/RootMatcher';
import { MatcherContainer, MatcherOptions } from './MatcherContainer';
import { Runtime } from './Runtime';

export class RegexpEngine {
  private matcherContainer: MatcherContainer;

  private Builder: typeof MyBuilder;

  private Explainer: typeof Explainer;

  constructor(option: RegexpEngineOption) {
    this.matcherContainer = new MatcherContainer({
      matchers: option.matchers,
    });
    this.Builder = option.Builder;
    this.Explainer = option.Explainer;
  }

  addMatcher(...args: Parameters<MatcherContainer['add']>) {
    this.matcherContainer.add(...args);
  }

  compile(code: string) {
    const cr = new Cursor(code);
    const rootMatcher = new RootMatcher();
    const rootRuntime = new Runtime(null, rootMatcher, {
      cr,
      matchers: this.matcherContainer.matchers,
    });

    const { error, runtimes } = rootMatcher.scan(rootRuntime);

    let builderCache: MyBuilder;

    const builder = () => {
      if (!builderCache) {
        builderCache = new this.Builder();
        builderCache.build(runtimes);
      }
      return builderCache;
    };

    const explainer = new this.Explainer();

    return {
      error,
      getJSON(payload: Record<string, any> = {}) {
        if (error) {
          return { error, data: null };
        }
        return explainer.run(builder().code(), payload);
      },
      getDocument() {
        if (error) {
          return { error, docList: null };
        }

        return explainer.doc(builder().tree());
      },
      getCode() {
        if (error) {
          return { error, code: null };
        }
        return { error: null, code: builder().code() };
      },
    };
  }
}

export interface RegexpEngineOption {
  Builder: typeof MyBuilder;
  Explainer: typeof Explainer;
  matchers: MatcherOptions;
}
