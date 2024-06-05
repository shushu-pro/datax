import { RegexpEngine } from '../RegexpEngine';
import { Builder } from './builder';
import { Explainer } from './explainer';
import { matchers } from './matchers';

class DataX {
  static getDocument(code: string) {
    return builtin.compile(code).getDocument();
  }

  static getJSON(code: string, payload = {}) {
    return builtin.compile(code).getJSON(payload);
  }

  static getCode(code: string) {
    return builtin.compile(code).getCode();
  }

  static compile(code: string) {
    return builtin.compile(code);
  }

  private regexpEngine: RegexpEngine;

  constructor() {
    this.regexpEngine = new RegexpEngine({
      matchers,
      Builder,
      Explainer,
    });
  }

  private compile(code: string) {
    return this.regexpEngine.compile(code);
  }
}

const builtin = new DataX();

export { DataX };
