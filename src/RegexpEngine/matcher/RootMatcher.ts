import { Runtime, RuntimeError } from '../Runtime';
import { ParentMatcher } from './ParentMatcher';

export class RootMatcher extends ParentMatcher {
  // private runtime: Runtime;

  private runtimes: Runtime[];

  private error: {
    message: string;
    line: number;
    column: number;
    lineText: string;
  };

  constructor() {
    super();
    this.runtimes = [];
  }

  scan(parentRuntime: Runtime) {
    const { cr } = parentRuntime;
    try {
      while (cr.notEOF) {
        parentRuntime.getMatcher('Main').scan(parentRuntime);
      }
    } catch (err) {
      const { bIndex } = err;

      const info = cr.info(bIndex);
      const lineText = cr.text(...info.range);
      const debugLineText = `${lineText.slice(
        0,
        info.column - 1
      )} ┋ ${lineText.slice(info.column - 1)}`;

      this.error = {
        message: err.message,
        line: info.line,
        column: info.column,
        lineText: debugLineText,
      };
    }

    return {
      error: this.error,
      runtimes: this.runtimes,
    };
  }

  childSuccess(childRuntime: Runtime): void {
    this.runtimes.push(childRuntime);
  }

  childFailure(childRuntime: Runtime, error: RuntimeError): void {
    throw error;
  }
}
