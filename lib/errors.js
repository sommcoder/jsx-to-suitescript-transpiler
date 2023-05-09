export const ERROR = {
  illegalChar: (label) =>
    `\nERROR: jsx label: ${label} contains special characters that are not permitted`,
  invalidCase: (compType) =>
    `\nERROR: jsx compType: ${compType} needs to be in PascalCase with the first letter capitalized!`,
  invalidChild: (compType) =>
    `\nERROR: there is an invalid child in the component: ${compType}`,
  invalidComp: (compType) =>
    `\nERROR: the jsx component: ${compType}, is NOT included in the ss library. Refer to docs to see included components`,
  invalidProp: (propName, compType) =>
    `\nERROR: The prop called: '${propName}' is NOT a valid prop in the component: '${compType}'`,
  duplicateProp: (propName, compType) =>
    `\nERROR: there is already an prop called: '${propName}' in the component: '${compType}. There cannot be duplicate props in a component'`,
  noProps: (compType) =>
    `\nERROR: jssx compType: ${compType} does not have any attributes/props and therefore is void! Components must have label/title at the very least!`,
  notValidFileArg: (argv) =>
    `\nERROR:You must specify a .jsx file after the npm command, ex: 'npm run jssx <file>.jsx'. There were no valid file name arguments passed in the following arguments: ${argv}`,
  invalidChild: (compType) =>
    `\nERROR: there is an invalid child in the component: '${compType}`,
  noFileAccess: (jsxFile, err) =>
    `\nERROR: Cannot retrieve file: ${jsxFile}. Please Node error: ${err}`,
  insufficientTabs: () =>
    `\nERROR: JSSX successfully transpiled, however there aren't enough tab components for this Page. There must be a minimum of 2 tabs to render on a Form.`,
};
