import { Runtime, RuntimeError } from '../Runtime';
import { Matcher } from './Matcher';

/**
 * @description 包含子Matcher的Matcher
 */
export abstract class ParentMatcher extends Matcher {
  /**
   * @description 子Matcher匹配成功
   */
  abstract childSuccess(childRuntime: Runtime): void;

  /**
   * @description 子Matcher匹配失败
   */
  abstract childFailure(childRuntime: Runtime, error: RuntimeError): void;
}
