#!/usr/bin/env node

import babel from "@babel/core";
import { SS } from "./ss-component-lib.js";
import process from "process";
import { ERROR } from "./errors.js";
import { access, constants, createWriteStream } from "node:fs";

// RUN CLI COMMAND: jssx <fileName>.jsx

// gets the file the user submits if it contains .jsx
let jsxFile = process.argv.find((arg) => arg.match(/^.*\.(jsx)$/)) || null;

if (!jsxFile) throw ERROR.notValidFileArg(process.argv);

access(jsxFile, constants.F_OK, (err) => {
  if (err) throw ERROR.noFileAccess(jsxFile, err);
});

let suiteScriptSyntax = ""; // the syntax string we're populating
// processed and concatenated after AST traverse:
let searchObj = {
  props: {},
  children: [],
  searchSyntax: "", // search syntax comes AFTER SS component calls
};
let pageVar = ""; // global variable, needs to be accessible by Node.js
let tabCount = 0; // tracks tabs, user gets informed if Form has < 2 tabs
const compStack = [];

babel.transformFileSync(jsxFile, {
  plugins: [
    "@babel/syntax-jsx", // plugin needed to parse JSX syntax
    function jsxToSS() {
      const { types: t } = babel;

      function handleNode(path) {
        // CHILDREN
        path.node.children = path.node.children.filter(
          (child) => child.type !== "JSXText"
        );
        // only validateChildren() if the child array has elements:
        if (path.node.children.length > 0)
          validateChildren(path.node.children, path.node.compType, path);

        // Arguments will get passed into Methods which return strings
        path.node.props = {
          arguments: {
            pageVar: pageVar,
          },
          methods: {},
        };

        // create new instance of component Object from component library:
        // populate path.node
        let compObj = SS[path.node.compType];
        assignProps(compObj, path);

        let parentPath = path.findParent((path) => path.isJSXElement()) || null;
        // PARENT: only if JSXElement
        if (parentPath && parentPath.node.compType === "Search") {
          // add this component to searchObj for processing after AST traversal
          searchObj.children.push(path.node);

          // re-assign to searches parent:
          parentPath =
            parentPath.findParent((path) => path.isJSXElement()) || null;
        }
        if (parentPath) validateParent(parentPath, compObj, path);

        return path.node;
      }

      function assignProps(compObj, path) {
        // PROP LOOP: loop through propsObj after they've been handled
        // assign them back to the current Node:

        for (let [key, value] of Object.entries(
          handleProps(
            path.node.compType,
            path.node.openingElement.attributes,
            path
          )
        )) {
          // after handling props, we handle how they are to be assigned back into NodePath, factoring for compVariants
          if (
            compObj.attributes.possibleVariants &&
            compObj.attributes.possibleVariants.includes(key)
          ) {
            // if key is one of the possibleVariants, assign variant to key
            // to be used later when we extract and concat our SS syntax
            path.node.variant = key;
          }
          // assign variables to node.arguments:
          if (compObj.props.variables.hasOwnProperty(key))
            if (path.node.props.arguments.parentType === "Search") {
              // add prop to searchObj if parent is Search
              searchObj.props[key] = value;
            }
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

      function validateParent(parentPath, compObj, path) {
        path.node.parentNode = parentPath.node;
        path.node.props.arguments.parentType = path.node.parentNode.compType;
        if (
          !compObj.attributes.possibleParents.includes(
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
        // New feature at some point
        if (path.node.compType === "Field") {
        }
        /*
      
         1) Check to ensure that the currComp, if Field, can have a parent of parentType BASED on the Field's type!
         
        */

        path.node.compType;

        if (
          path.node.parentNode.compType === "Tab" ||
          path.node.parentNode.compType === "FieldGroup"
        ) {
          // Only if parent is Tab of FieldGroup do we need to get and assign parentId to the current path.node
          path.node.props.arguments.parentId =
            path.node.parentNode.props.arguments.id;
        }
        path.node.props.arguments.parentVar =
          path.node.parentNode.props.arguments.varName;
      }

      // function validateType(compObj, compType, typeProp, parentType) {
      //   compType.toLowerCase();
      //   compObj.attributes.possibleTypes;
      // }

      function handleArrayBinding(array, propsObj, propName) {
        array.forEach((el, i) => {
          if (t.isObjectExpression(el)) {
            propsObj[propName].push({}); // add an object to the propsObj array
            el.properties.forEach((prop) => {
              // what if prop has a value of a binding?
              if (t.isIdentifier(prop)) {
                propsObj[propName].push({ identifier: el.name });
              }
              propsObj[propName][i][prop.key.name] = prop.value.value;
            });
          } else if (t.isArrayExpression(el)) {
            // array? push a new array to array and recursively call function again
            //  console.log("is array expression");
            //   console.log(el);
            propsObj[propName].push([
              ...el.elements.map((e) => {
                if (t.isIdentifier(e)) return { identifier: e.name };
                else return e.value;
              }),
            ]);
          } else if (t.isIdentifier(el)) {
            // console.log("identifier");
            propsObj[propName].push({ identifier: el.name });
          } else if (el) {
            // not array or Object? simply push value (ie. string/number literals)
            propsObj[propName].push(el.value);
          }
        });
      }

      function handleProps(compType, propsArr, path) {
        // props need to be handled depending on their type, binding and whether they're wrapped in a JSX Expression and the combinations thereof
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
          }
          // STRING LITERAL: ex: prop="yourProp"
          if (t.isStringLiteral(propValNode)) {
            propsObj[propName] = propValNode.value;
          }

          // ! PROP = JSX Expression Container guard clause:
          if (!t.isJSXExpressionContainer(propValNode)) return;

          // NUMBER: ex: prop={123}
          if (t.isNumericLiteral(propValExp)) {
            propsObj[propName] = propValExp.value;
          }

          // OBJECT: ex: prop={{h: 40, w: 6}}
          if (t.isObjectExpression(propValExp)) {
            propsObj[propName] = {};
            propValExp.properties.forEach(
              (prop) => (propsObj[propName][prop.key.name] = prop.value.value)
            );
          }

          // ARRAY: ex: prop={["1", "2", "3"]}
          // this has not been tested
          if (t.isArrayExpression(propValExp)) {
            propsObj[propName] = [];
            propValExp.elements.forEach((el) => {
              console.log("el:", el);
              propsObj[propName].push(el);
            });
          }
          console.log("check for early return");
          // ! PROP = BINDING: ex: prop={variable} (within lexical scope)
          if (!t.isIdentifier(propValExp)) return;
          console.log("is identifier");

          const identifiersObj = path.scope.bindings; // get bindings
          if (Object.keys(identifiersObj).length !== 0) {
            // if the prop variable is NOT a binding
            if (!identifiersObj[propValExp.name]) {
              console.log("is identifier, but not a binding");
              propsObj[propName] = propValExp.name;
            } else {
              let bindingIdNode = identifiersObj[propValExp.name].path.node;
              console.log("is identifier, AND ALSO a binding");
              console.log("bindingIdNode", bindingIdNode);
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
                // if binding has elements therefore binding is Array
              } else if (
                bindingIdNode.init.elements &&
                bindingIdNode.init.elements.length > 0
              ) {
                // assign to propsObj as array
                // loop through the array
                propsObj[propName] = [];

                // if binding is of an array such as with filters prop in Search
                handleArrayBinding(
                  bindingIdNode.init.elements,
                  propsObj,
                  propName
                );
              } else {
                console.log("propValExp:", propValExp);
                // handle a binding that is just a string or number:
                propsObj[propName] = bindingIdNode.init.value;
              }
            }
          }
        });
        // once props have been handled, pass to generateVarId's:
        if (!propsObj.label && !propsObj.title)
          propsObj.varName = `${compType}_${compStack.length}`;
        else {
          // ! Generate varName and id for comp if not provided:
          let { varName, id } = generateVarIdObj(propsObj, compType);
          propsObj.varName = varName;
          propsObj.id = id;
        }
        // initiate searchObj populating:
        if (compType === "Search") searchObj.props = propsObj;
        console.log("propsObj:", propsObj);
        return propsObj;
      }

      function validateIdStr(str) {
        const regex = /^[a-zA-Z_\s]+$/;
        if (!regex.test(str))
          throw path.buildCodeFrameError(ERROR.illegalChar(str));
      }

      function generateVarIdObj(propsObj, type) {
        let validId = false;
        const stringObj = {
          varName: "",
          id: "custpage",
        };

        if (propsObj.id) {
          validateIdStr(propsObj.id);
          validId = true;
          stringObj.id = propsObj.id;
        }

        let string = propsObj.title || propsObj.label;

        console.log("string:", string);
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
            // apply to all if valid id not provided:
            if (!validId) stringObj.id += `_${word}`;
            // last word type addition check:
            if (i === arr.length - 1 && word !== type.toLowerCase()) {
              if (!validId) stringObj.id += `_${type.toLowerCase()}`;
              stringObj.varName += type; // word should already be added above
            }
          });
        return stringObj;
      }

      //////////////////////////////////////////////
      /* Gets the SS syntax by passing arguments into methods returning dynamic string literals */
      function getSSComponentCalls(currNode) {
        // Search guard clause:
        if (currNode.compType === "Search") return;

        // Select w. Search guard clause:
        if (
          currNode.compType === "Select" &&
          Object.keys(searchObj.props).length > 0
        )
          return;

        // REGULAR COMPONENT:
        suiteScriptSyntax += `\n${SS[currNode.compType].add(
          currNode.props.arguments
        )}`;

        // COMPONENT VARIANT?:
        if (currNode.variant) {
          suiteScriptSyntax += `\n${SS[currNode.compType].props.methods[
            currNode.variant
          ](currNode.props.arguments)}`;
        }

        // HANDLE OTHER SS METHOD/PROPERTY CALLS:
        if (Object.keys(currNode.props.methods).length > 0) {
          for (let [key, value] of Object.entries(currNode.props.methods)) {
            // console.log("key:", key, "value:", value);
            suiteScriptSyntax += `\n${SS[currNode.compType].props.methods[key](
              currNode.props.arguments,
              value
            )}`;
          }
        }
        return suiteScriptSyntax;
      }

      return {
        name: "jssx", // name of this plugin
        visitor: {
          JSXElement(path) {
            let compType = path.node.openingElement.name.name;
            if (compType === "Tab") tabCount++; // tab tracking
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

/*
 
1) if component IS search, populate searchObj with the props
2) if PARENT is search, populate searchObj children array with children compObjs
 
*/
//console.log("suiteScriptSyntax:", suiteScriptSyntax);
//console.log("searchObj", searchObj);
if (Object.keys(searchObj.props).length > 0) {
  searchObj.searchSyntax += `\n${SS.Search.add(searchObj)}`;
}

// console.log("searchObj.searchSyntax:", searchObj.searchSyntax);
// do once after compiling the string:
suiteScriptSyntax += searchObj.searchSyntax;

suiteScriptSyntax += `\n${SS.Write(pageVar)}`;
console.log("suiteScriptSyntax:", suiteScriptSyntax);

// tabCount check:
if (tabCount === 1) console.error(ERROR.insufficientTabs());

let writeStream = createWriteStream(jsxFile, { flags: "a" });
writeStream.write(suiteScriptSyntax);
writeStream.end();

/*
 
1) Make it so that a user CAN add an id to their components. Reason being so that this tool could be adopted to existing projects that already have id's set

2) Complete the Field type conditions and transpilation error handling

3) Handle Field.updateDisplaySize()... a binding of an object with properties OR just an inline object with properties. 
  h: height
  w: width

4) Need to make it so that type can be handled regardless of case as well
 
*/
