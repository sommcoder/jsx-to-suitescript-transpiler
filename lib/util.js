import { ERROR } from "./errors.js";

export function checkProps(reqPropsArr, compProps) {
  reqPropsArr.forEach((prop) => {
    if (!Object.keys(compProps).includes(prop)) {
      throw new Error(ERROR.missingRequiredProp(compProps.type, prop));
    }
  });
}

export function isObject(obj) {
  if (typeof obj === "object")
    return obj.identifier; // a binding, NOT a string!
  else return `'${obj}'`; // just a string
}
