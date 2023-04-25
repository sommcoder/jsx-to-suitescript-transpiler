export const ERROR = {
  illegalChar: (label) =>
    `ERROR: jsx label: ${label} contains special characters that are not permitted`,
  invalidComp: (compType) =>
    `ERR: the jsx component: ${compType}, is NOT included in the ss library. Refer to docs to see included components`,
  invalidCase: (compType) =>
    `ERROR: jsx compType: ${compType} needs to be in PascalCase with the first letter capitalized!`,
  invalidProp: (propName, compType) =>
    `ERR: The prop called: '${propName}' is NOT a valid prop in the component: '${compType}'`,
  duplicateProp: (propName, compType) =>
    `ERR: there is already an prop called: '${propName}' in the component: '${compType}. There cannot be duplicate props in a component'`,
  noProps: (compType) =>
    `ERROR: jssx compType: ${compType} does not have any attributes/props and therefore is void! Components must have label/title at the very least!`,
  notValidFileArg: (argv) =>
    `You must specify a .jsx file after the npm command, ex: 'npm run jssx <file>.jsx'. There were no valid file name arguments passed in the following arguments: ${argv}`,
  invalidChild: (compType) =>
    `ERR: there is an invalid child in the component: '${compType}`,
};
