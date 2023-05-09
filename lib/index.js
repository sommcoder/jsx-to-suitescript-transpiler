import babel from "@babel/core";
import { SS } from "./ss-component-lib.js";
import process from "process";
import { ERROR } from "./errors.js";
import { access, constants, createWriteStream } from "node:fs";

// COMMAND: npm run jssx <fileName>.jsx

// gets the file the user submits if it contains .jsx
let jsxFile = process.argv.find((arg) => arg.match(/^.*\.(jsx)$/)) || null;

if (!jsxFile) throw ERROR.notValidFileArg(process.argv);

access(jsxFile, constants.F_OK, (err) => {
  if (err) throw ERROR.noFileAccess(jsxFile, err);
});

let suiteScriptSyntax = ""; // the syntax string we're populating
let pageVar = ""; // global variable, needs to be accessible by Node.js
let tabCount = 0; // tracks tabs, user gets informed if a Form has under 2 tabs

babel.transformFileSync(jsxFile, {
  plugins: [
    "syntax-jsx", // needed to parse the JSX code
    function jsxToSS() {
      const { types: t } = babel;
      /* WHY: 
      handles getting the props, children and parents of the node,
      then populating the component object with the values we need to get our SuiteScript calls from the SS library
      */
      function handleNode(path) {
        // CHILDREN
        path.node.children = path.node.children.filter(
          (child) => child.type !== "JSXText"
        );
        hasValidChildren(path.node.children, path.node.compType, path);

        // Arguments get passed into the methods:
        path.node.props = {
          arguments: {
            pageVar: pageVar,
          },
          methods: {},
        };
        // Handle Node props:
        let props = handleProps(
          path.node.compType,
          path.node.openingElement.attributes,
          path
        );
        // PARENT, only if JSXElement
        let parentPath = path.findParent((path) => path.isJSXElement()) || null;

        if (parentPath) {
          path.node.parentNode = parentPath.node;
          path.node.props.arguments.parentType = path.node.parentNode.compType;
          // Handle instances where Tab | FieldGroup are the parents of currNode
          if (
            path.node.parentNode.compType === "Tab" ||
            path.node.parentNode.compType === "FieldGroup"
          ) {
            tabCount++; // needs two tabs to render, throws error for user if not enough tabs for NetSuite
            path.node.props.arguments.parentId =
              path.node.parentNode.props.arguments.id;
          }
          props.parentVar = path.node.parentNode.props.arguments.varName;
        }

        // create new instance of component Object from component library:
        let compObj = SS[path.node.compType];
        // loop through props handled and assign them back to the current Node:
        for (let [key, value] of Object.entries(props)) {
          if (
            compObj.attributes.possibleVariants &&
            compObj.attributes.possibleVariants.includes(key)
          ) {
            // if key is one of the possibleVariants, assign variant to key
            path.node.variant = key;
          }
          // assign varibles to node.arguments:
          if (compObj.props.variables.hasOwnProperty(key))
            path.node.props.arguments[key] = value;
          // assign methods to node.methods:
          if (compObj.props.methods.hasOwnProperty(key))
            path.node.props.methods[key] = value;
        }
        return path.node;
      }

      // creates a varName and Id for component:
      function generateVarIdObj(string, type, path) {
        console.log("type:", type);
        const stringObj = {
          varName: "",
          id: "custpage",
        };
        const regex = /^[a-zA-Z_\s]+$/;
        if (regex.test(string)) {
          string
            .trim()
            .toLowerCase()
            .split(" ")
            .forEach((word, i, arr) => {
              if (i !== 0) {
                // all words except 1st get their 1st letter capitalized:
                stringObj.varName +=
                  word.charAt(0).toUpperCase() + word.slice(1, word.length);
              } else stringObj.varName += word;
              // apply to all:
              stringObj.id += `_${word}`;
              // last word type addition check:
              if (i === arr.length - 1 && word !== type.toLowerCase()) {
                stringObj.varName += type; // word should already be added above
                stringObj.id += `_${type.toLowerCase()}`;
              }
            });
        } else {
          throw path.buildCodeFrameError(ERROR.illegalChar(string));
        }
        return stringObj;
      }

      //////////////////////////////////////////////
      /* Gets the SS syntax by passing arguments into methods returning dynamic string literals */
      function getSSComponentCalls(currNode) {
        // PAGE COMPONENT:
        if (SS[currNode.compType].attributes.isPage) {
          suiteScriptSyntax = `\n ${SS[currNode.compType].add(
            currNode.props.arguments
          )}`;
        } else {
          // COMPONENT VARIANTS:
          if (currNode.variant) {
            suiteScriptSyntax += `\n\n ${SS[currNode.compType].props.methods[
              currNode.variant
            ](currNode.props.arguments)}`;
          } else {
            // NON PAGE COMPONENT:
            suiteScriptSyntax += `\n\n ${SS[currNode.compType].add(
              currNode.props.arguments
            )}`;
            // HANDLE OTHER SS METHOD/PROPERTY CALLS:
            if (Object.keys(currNode.props.methods).length > 0) {
              for (let [key, value] of Object.entries(currNode.props.methods)) {
                suiteScriptSyntax += `\n\n ${SS[
                  currNode.compType
                ].props.methods[key](currNode.props.arguments, value)}`;
              }
            }
          }
        }
        return suiteScriptSyntax;
      }

      // Child Check:
      function hasValidChildren(childNamesArr, compType, path) {
        if (
          !childNamesArr.every((child) =>
            SS[compType].attributes.possibleChildren.includes(
              child.openingElement.name.name
            )
          )
        ) {
          throw path.buildCodeFrameError(ERROR.invalidChild(compType));
        }
      }

      function handleProps(compType, propsArr, path) {
        // To populate per JSXElement visit
        let propsObj = {};

        propsArr.forEach((prop) => {
          const propName = prop.name.name;
          // won't exist for some Nodes:
          //////////////////////////////
          const propValNode = prop.value;
          const propValExp = prop.value ? prop.value.expression : null;
          //////////////////////////////

          // !GUARD CLAUSES:
          if (propsObj.hasOwnProperty(propName)) {
            throw path.buildCodeFrameError(ERROR.duplicateProp(prop, compType));
          }
          if (
            !SS[compType].props.variables.hasOwnProperty(propName) &&
            !SS[compType].props.methods.hasOwnProperty(propName)
          ) {
            throw path.buildCodeFrameError(ERROR.invalidProp(prop, compType));
          }

          // !PROP HANDLING:
          // eg. disable | mandatory | selected | hidden
          if (propName && propValNode === null) {
            propsObj[propName] = true;
            return;
          }
          // eg: prop="yourprop"
          if (t.isStringLiteral(propValNode)) {
            propsObj[propName] = propValNode.value;
            return;
          }
          // eg: prop={123}
          if (
            t.isJSXExpressionContainer(propValNode) &&
            t.isNumericLiteral(propValExp)
          ) {
            propsObj[propName] = propValExp.value;
            return;
          }
          // Props w. Bindings in function scope
          if (
            t.isJSXExpressionContainer(propValNode) &&
            t.isIdentifier(propValExp)
          ) {
            const identifiersObj = path.scope.bindings;

            if (Object.keys(identifiersObj).length !== 0) {
              if (!identifiersObj[propValExp.name]) {
                propsObj[propName] = propValExp.name;
              } else {
                let bindingIdNode = identifiersObj[propValExp.name].path.node;
                propsObj[propName] = bindingIdNode.init.value;
              }
              return;
            }
          }
        });
        // once props have been handled, pass to generateVarId's:
        if (!propsObj.label && !propsObj.title) {
          propsObj.varName = `${compType}_${compStack.length}`;
        } else {
          // only generate varName and Id if NOT a SELECT of special Button component:
          let { varName, id } = generateVarIdObj(
            propsObj.title || propsObj.label,
            compType,
            path
          );
          // only add these properties if needed (ie. if not SELECT or special Button):
          propsObj.varName = varName;
          propsObj.id = id;
        }
        console.log("propsObj:", propsObj);
        return propsObj;
      }
      const compStack = [];
      return {
        name: "jssx",
        visitor: {
          JSXElement(path) {
            let compType = path.node.openingElement.name.name;
            if (compType === "Tab") tabCount++; // tab tracking:
            path.node.compType = compType;
            // PascalCase check:
            if (compType.charAt(0) !== compType.charAt(0).toUpperCase()) {
              throw path.buildCodeFrameError(ERROR.invalidCase(compType));
            }
            // Attribute/Prop check:
            if (path.node.openingElement.attributes.length < 1) {
              throw path.buildCodeFrameError(ERROR.noProps(compType));
            }
            let currNode = handleNode(path);
            // set pageVar for child components to reference easily
            if (compStack.length === 0) {
              pageVar = currNode.props.arguments.varName;
            }
            compStack.push(currNode);
            getSSComponentCalls(currNode, path);
          },
        },
      };
    },
  ],
  comments: false, // ignores comments for optimization
});

// tabCount check:
if (tabCount < 2 && pageVar === "Form") console.log(ERROR.insufficientTabs());

// do once after compiling the string:
suiteScriptSyntax += `\n\n${SS.Write(pageVar)}\n`;
// console.log("suiteScriptSyntax:", suiteScriptSyntax);

//let readStream = createReadStream(jsxFile, { flags: "a" });
let writeStream = createWriteStream(jsxFile, { flags: "a" });
writeStream.write(suiteScriptSyntax);
writeStream.end();
