import babel from "@babel/core";
import { SS } from "./ss-component-lib.js";
import * as util from "./util.js";

/*
Project Relationship:

                 babel
                   |  
                   v 
lib -> util <-> index.js <- lib

*/

const { template } = babel;

const output = babel.transformFileSync("code.js", {
  plugins: ["syntax-jsx", jsxToSS],
});

function jsxToSS() {
  const { types: t } = babel;
  // this is where we track the components insertion order & their children
  const pageArr = new Array();

  function handleAttributes(comp, attrsArr, path) {
    const attributes = {};
    attrsArr.forEach((attr) => {
      // is duplicate?
      console.log("attr:", attr);
      if (attributes.hasOwnProperty(attr.name.name)) {
        throw path.buildCodeFrameError(
          `ERR: there is already an attribute called: '${attr.name.name}' in the component: '${comp}. There cannot be duplicate attributes in a component'`
        );
      }
      // valid attribute of component?
      if (!SS[comp][attr.name.name]) {
        throw path.buildCodeFrameError(
          `ERR: The attribute called: '${attr.name.name}' is NOT a valid attribute in the component: '${comp}'`
        );
      }
      // (ie. disable/mandatory/selected/hidden)
      if (attr.value === null) {
        attributes[attr.name.name] = true;
        return;
      }
      // attribute="yourAttribute"
      if (t.isStringLiteral(attr.value)) {
        attributes[attr.name.name] = attr.value.value;
        return;
      }
      // attribute={123}
      if (
        t.isJSXExpressionContainer(attr.value) &&
        t.isNumericLiteral(attr.value.expression)
      ) {
        attributes[attr.name.name] = attr.value.expression.value;
        return;
      }
      // handle attributes that have a binding that is IN the PAGE's FUNCTION SCOPE
      if (
        t.isJSXExpressionContainer(attr.value) &&
        t.isIdentifier(attr.value.expression)
      ) {
        const identifiersObj = path.scope.bindings;
        // if the identifier object has attrs:
        if (!Object.keys(identifiersObj).length === 0) {
          let bindingIdNode =
            identifiersObj[attr.value.expression.name].path.node;

          attributes[attr.name.name] = bindingIdNode.init.value;
          return;
        } else {
          // outside scope! HOW DO WE GET THIS FROM WITHIN THE JSXELEMENT VISITOR?
          return;
        }
      }
      console.log("attributes:", attributes);
    });
    console.log("attributes:", attributes);
    return attributes;
  }

  return {
    name: "jssx",
    visitor: {
      ReturnStatement(path) {
        // early return if code is not JSX:
        const openingEl = path.node.argument.openingElement;
        if (!openingEl || openingEl.type !== "JSXOpeningElement") return;
      },
      JSXElement(path) {
        let component = path.node.openingElement.name.name;
        const attributes = handleAttributes(
          component,
          path.node.openingElement.attributes,
          path
        );
        // PascalCase check:
        if (component.charAt(0) !== component.charAt(0).toUpperCase()) {
          throw path.buildCodeFrameError(
            `ERROR: jsx component: ${component} needs to be in PascalCase with the first letter capitalized!`
          );
        }
        // filter out "JSXText" (ie. whitespace):
        // no children? assign null
        // return as[strings]:
        const childrenNodeArr = path.node.children;
        const childrenNamesArr =
          childrenNodeArr.length > 0
            ? childrenNodeArr
                .filter((el) => el.type !== "JSXText")
                .map((child) => child.openingElement.name.name)
            : null;

        if (childrenNamesArr) {
          console.log(util.hasValidChildren(childrenNamesArr, component));
          // need
          if (!util.hasValidChildren(childrenNamesArr, component)) {
            throw path.buildCodeFrameError(
              `ERROR: jsx component: ${component} has an invalid child that is not compatible to be nested within this component!`
            );
          }
        }
        console.log("attributes:", attributes);
        // add new component to the ui array:
        pageArr.push({
          [component]: {
            attributes: attributes,
            children: childrenNamesArr,
          },
        });
        console.log("pageArr:", pageArr);

        const ssComponent = util.getSSComponentCalls(
          component,
          attributes,
          path
        );
        console.log("ssComponent:", ssComponent);
      },
    },
  };
}
// console.log("output.code:", output.code);
