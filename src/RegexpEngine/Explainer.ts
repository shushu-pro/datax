export class Explainer {
  run(code: string, payload): DataResult {
    return {
      error: Error(''),
      data: null,
    };
  }

  doc(tree): DocResult {
    return {
      error: Error(''),
      docList: [],
    };
  }
}

type DataResult = {
  error: Error;
  data: Record<string, any>;
};

type DocResult = {
  error: Error;
  docList: Array<any>;
};
