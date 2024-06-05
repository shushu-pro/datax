import { MyBuilder } from '../Builder';

export interface DefineMatcher {
  match: string | ((cr) => boolean);
  enter?: (builder: MyBuilder, text: string) => void;
  leave?: (builder: MyBuilder, text: string) => void;
  document?: (builder: MyBuilder, text: string) => void;
}
