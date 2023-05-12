export function checkProps(reqPropsArr, props) {
  reqPropsArr.forEach((prop) => {
    if (!Object.keys(props).includes(prop)) {
      throw new Error(ERROR.missingRequiredProp(props.type, prop));
    }
  });
}
