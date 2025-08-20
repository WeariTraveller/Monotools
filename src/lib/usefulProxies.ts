function noExtending(): boolean {
  throw new TypeError("Readonly!");
}

export const readonlyHandler: ProxyHandler<Object> = {
  set: noExtending,
  defineProperty: noExtending,
  deleteProperty: noExtending,
  setPrototypeOf: noExtending,
  isExtensible() {
    return false;
  },
  getOwnPropertyDescriptor(obj, name) {
    // `in` returns true for inherited properties while it below doesn't
    if (!Object.getOwnPropertyDescriptor(obj, name)) return undefined;
    return {
      value: (obj as any)[name],
      writable: false,
      enumerable: true,
      configurable: false,
    };
  },
};
