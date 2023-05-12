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

/*
 
1) Make it so that a user CAN add an id to their components. Reason being so that this tool could be adopted to existing projects that already have id's set

2) Complete the Field type conditions and transpilation error handling

3) Handle Field.updateDisplaySize()... a binding of an object with properties OR just an inline object with properties. 
  h: height
  w: width

4) Need to make it so that type can be handled regardless of case
 
*/

let suiteScriptSyntax = ""; // the syntax string we're populating
let pageVar = ""; // global variable, needs to be accessible by Node.js
let tabCount = 0; // tracks tabs, user gets informed if a Form has under 2 tabs

babel.transformFileSync(jsxFile, {
  plugins: [
    "syntax-jsx", // needed to parse the JSX code
    function jsxToSS() {
      const { types: t } = babel;

      function handleNode(path) {
        // CHILDREN
        path.node.children = path.node.children.filter(
          (child) => child.type !== "JSXText"
        );
        validateChildren(path.node.children, path.node.compType, path);
        // Arguments will get passed into Methods which return strings
        path.node.props = {
          arguments: {
            pageVar: pageVar,
          },
          methods: {},
        };

        // create new instance of component Object from component library:
        let compObj = SS[path.node.compType];
        assignProps(compObj, path);

        // PARENT: only if JSXElement
        let parentPath = path.findParent((path) => path.isJSXElement()) || null;
        if (parentPath) validateParent(parentPath, compObj, path);

        return path.node;
      }

      function assignProps(compObj, path) {
        // PROP LOOP: loop through props after they've been handled
        // assign them back to the current Node:
        for (let [key, value] of Object.entries(
          handleProps(
            path.node.compType,
            path.node.openingElement.attributes,
            path
          )
        )) {
          if (
            compObj.attributes.possibleVariants &&
            compObj.attributes.possibleVariants.includes(key)
          ) {
            // if key is one of the possibleVariants, assign variant to key
            // to be used later when we extract and concat our SS syntax
            path.node.variant = key;
          }
          // assign varibles to node.arguments:
          if (compObj.props.variables.hasOwnProperty(key))
            path.node.props.arguments[key] = value;
          // assign methods to node.methods:
          if (compObj.props.methods.hasOwnProperty(key))
            path.node.props.methods[key] = value;
        }
      }

      function validateChildren(childNamesArr, compType, path) {
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
        let propsObj = {};

        propsArr.forEach((prop) => {
          // attributes of a prop:
          const propName = prop.name.name;
          const propValNode = prop.value;
          const propValExp = prop.value ? prop.value.expression : null;

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
          // KEYWORDS: ex. disable | mandatory | selected | hidden
          if (propName && propValNode === null) {
            propsObj[propName] = true;
            return;
          }
          // STRING LITERAL: ex: prop="yourProp"
          if (t.isStringLiteral(propValNode)) {
            propsObj[propName] = propValNode.value;
            return;
          }

          // NUMBER/EXP: ex: prop={123}
          if (
            t.isJSXExpressionContainer(propValNode) &&
            t.isNumericLiteral(propValExp)
          ) {
            propsObj[propName] = propValExp.value;
            return;
          }

          // OBJECT/EXP: ex: prop={{h: 40, w: 6}}
          if (
            t.isJSXExpressionContainer(propValNode) &&
            t.isObjectExpression(propValExp)
          ) {
            propsObj[propName] = {};
            propValExp.properties.forEach((prop) => {
              propsObj[propName][prop.key.name] = prop.value.value;
            });
            return;
          }

          // what about an expression container with an Array inside???
          // Would we ever need this for SuiteScript??

          // BINDING/EXP: ex: prop={variable}
          // Props w. Bindings in function lexical scope
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

                // Does binding have an array of properties?
                // ie. its a binding to an object with properties
                if (
                  bindingIdNode.init.properties &&
                  bindingIdNode.init.properties.length > 0
                ) {
                  propsObj[propName] = {};
                  bindingIdNode.init.properties.forEach((prop) => {
                    propsObj[propName][prop.key.name] = prop.value.value;
                  });
                  // otherwise, just assign the value
                } else {
                  propsObj[propName] = bindingIdNode.init.value;
                }
              }
            }
            return;
          }
        });
        // once props have been handled, pass to generateVarId's:
        if (!propsObj.label && !propsObj.title) {
          // Select or Special Button component:
          propsObj.varName = `${compType}_${compStack.length}`;
        } else {
          // ! Generate varName and id for component:
          let { varName, id } = generateVarIdObj(
            propsObj.title || propsObj.label,
            compType,
            path
          );
          propsObj.varName = varName;
          propsObj.id = id;
        }
        return propsObj;
      }

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

      function validateParent(parentPath, compObj, path) {
        path.node.parentNode = parentPath.node;
        path.node.props.arguments.parentType = path.node.parentNode.compType;

        console.log("path.node.parentNode:", path.node.parentNode);

        // Check to ensure that the currComp can have a parent of parentType

        if (
          !compObj.attribute.possibleParents.includes(
            path.node.props.arguments.parentType
          )
        ) {
          path.buildCodeFrameError(
            ERROR.invalidParent(
              compObj.compType,
              path.node.props.arguments.parentType
            )
          );
        }

        // if Field, can only have certain parents when it is a certain type
        if (path.node.compType === "Field") {
        }
        /*
      
         3) Check to ensure that the currComp, if Field, can have a parent of parentType BASED on the Field's type!
         
        */

        path.node.compType;

        // Handle instances where Tab | FieldGroup are the parents of currNode
        if (
          path.node.parentNode.compType === "Tab" ||
          path.node.parentNode.compType === "FieldGroup"
        ) {
          path.node.props.arguments.parentId =
            path.node.parentNode.props.arguments.id;
        }
        props.parentVar = path.node.parentNode.props.arguments.varName;
      }

      function validateType(compObj, compType, typeProp, parentType) {
        compType.toLowerCase();
        compObj.attributes.possibleTypes;
        /*
         
        Check compType against SS library to ensure that:
        1) compType can have a type of typeProp
        2) compType can have a type of typeProp WITH it's parentType's type


        Components with types:
        1) Field
         
        */
      }

      //////////////////////////////////////////////
      /* Gets the SS syntax by passing arguments into methods returning dynamic string literals */
      function getSSComponentCalls(currNode) {
        // PAGE COMPONENT:
        // console.log("currNode:", currNode);

        if (SS[currNode.compType].attributes.isPage) {
          suiteScriptSyntax = `\n${SS[currNode.compType].add(
            currNode.props.arguments
          )}`;
        } else {
          // COMPONENT VARIANTS:
          if (currNode.variant) {
            suiteScriptSyntax += `\n${SS[currNode.compType].props.methods[
              currNode.variant
            ](currNode.props.arguments)}`;
          } else {
            // NON PAGE COMPONENT:
            suiteScriptSyntax += `\n${SS[currNode.compType].add(
              currNode.props.arguments
            )}`;
            // HANDLE OTHER SS METHOD/PROPERTY CALLS:
            if (Object.keys(currNode.props.methods).length > 0) {
              for (let [key, value] of Object.entries(currNode.props.methods)) {
                console.log("key:", key, "value:", value);
                suiteScriptSyntax += `\n${SS[currNode.compType].props.methods[
                  key
                ](currNode.props.arguments, value)}`;
              }
            }
          }
        }
        //console.log("suiteScriptSyntax:", suiteScriptSyntax);
        return suiteScriptSyntax;
      }

      const compStack = [];
      return {
        name: "jssx",
        visitor: {
          JSXElement(path) {
            let compType = path.node.openingElement.name.name;
            if (compType === "Tab") {
              tabCount++; // tab tracking
            }
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

// do once after compiling the string:
suiteScriptSyntax += `\n${SS.Write(pageVar)}`;
// console.log("suiteScriptSyntax:", suiteScriptSyntax);

// tabCount check:
if (tabCount < 2) {
  console.error(ERROR.insufficientTabs());
}

//let readStream = createReadStream(jsxFile, { flags: "a" });
let writeStream = createWriteStream(jsxFile, { flags: "a" });
writeStream.write(suiteScriptSyntax);
writeStream.end();
