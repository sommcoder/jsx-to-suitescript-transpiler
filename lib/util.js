export function checkProps(reqPropsArr, props) {
  reqPropsArr.forEach((prop) => {
    if (!Object.keys(props).includes(prop)) {
      throw new Error(ERROR.missingRequiredProp(props.type, prop));
    }
  });
}

export function isObject(obj) {
  if (typeof obj === "object")
    return obj.identifier; // a binding, NOT a string!
  else return `'${obj}'`; // just a string
}
