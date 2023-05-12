export const ERROR = {
  illegalChar: (label) =>
    `\nJSSX ERROR: jsx label: ${label} contains special characters that are not permitted`,
  invalidCase: (compType) =>
    `\nJSSX ERROR: jsx compType: ${compType} needs to be in PascalCase with the first letter capitalized!`,
  invalidChild: (compType) =>
    `\nJSSX ERROR: there is an invalid child in the component: ${compType}`,
  invalidParent: (compType, parentType) =>
    `\nJSSX ERROR: Parent type: ${parentType} is not a valid parentType for: "${compType}"`,
  invalidComp: (compType) =>
    `\nJSSX ERROR: the jsx component: ${compType}, is NOT included in the ss library. Refer to docs to see included components`,
  noProps: (compType) =>
    `\nJSSX ERROR: jssx compType: ${compType} does not have any attributes/props and therefore is void! Components must have label/title at the very least!`,
  invalidProp: (propName, compType) =>
    `\nJSSX ERROR: The prop called: '${propName}' is NOT a valid prop in the component: '${compType}'`,
  duplicateProp: (propName, compType) =>
    `\nJSSX ERROR: there is already an prop called: '${propName}' in the component: '${compType}. There cannot be duplicate props in a component'`,
  redundantProp: (prop, compType) =>
    `\nJSSX ERROR: The prop: "${prop}" is considered a redundant prop on component: "${compType}"`,
  missingRequiredProp: (type, prop) =>
    `\nJSSX ERROR: The "${type}" component is missing a required prop called "${prop}", please refer to the JSSX and/or NetSuite docs`,
  insufficientTabs: () =>
    `\nJSSX ERROR: JSSX successfully transpiled, however there aren't enough tab components for this Form. \nThere must be a minimum of 2 tabs to render on a Form to render.`,
  notValidFileArg: (argv) =>
    `\nNODE ERROR: You must specify a .jsx file after the npm command, ex: 'npm run jssx <file>.jsx'. There were no valid file name arguments passed in the following arguments: ${argv}`,
  noFileAccess: (jsxFile, err) =>
    `\nNODE ERROR: Cannot retrieve file: ${jsxFile}. Node error: ${err}`,
};
