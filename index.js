import babel from "@babel/core";
import * as ss from "./lib/ss-component-lib.js";

console.log("ss", ss);
console.log(babel.template);
const { template } = babel;

const output = babel.transformFileSync("./code.js", {
  plugins: ["syntax-jsx", jsxToSS],
});

function jsxToSS() {
  const { types: t } = babel;

  // this is where we track the components insertion order & their children
  const pageArr = new Array();

  function handleAttributes(attrsArr, path) {
    const attributes = new Object();

    attrsArr.forEach((attr) => {
      // no duplicate attribute names!
      if (attributes.hasOwnProperty(attr.name.name)) {
        throw path.buildCodeFrameError(
          `ERR: there is already an attribute called: ${attr.name.name} in the component: ${component}`
        );
      }
      // (ie. disable/mandatory/selected)
      if (attr.value == null) {
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
      // handle attributes that have a binding IN FUNCTION SCOPE
      if (
        t.isJSXExpressionContainer(attr.value) &&
        t.isIdentifier(attr.value.expression)
      ) {
        const identifiersObj = path.scope.bindings;
        if (!Object.keys(identifiersObj).length === 0) {
          let bindingIdNode =
            identifiersObj[attr.value.expression.name].path.node;
          attributes[attr.name.name] = bindingIdNode.init.value;
        } else {
          // outside scope! HOW DON WE GET THIS!!???
        }
        return;
      }
    });
    return attributes;
  }

  function getSSComponentCalls(comp, attr, children, path) {
    console.log("comp:", comp);
    // jsx is NOT included in the SS library: error!
    if (!Object.hasOwn(ss, comp)) {
      throw path.buildCodeFrameError(
        `ERR: the jsx component: ${comp}, is NOT included in the ss library. Refer to docs to see included components`
      );
    }

    // How do we use the comp object and its functions to produce the template we want???
    const suiteScriptSyntax = `${ss[comp].add(comp)}\n${ss[comp][attr]}`;

    console.log("suiteScriptSyntax:", suiteScriptSyntax);

    return suiteScriptSyntax;
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
        const attributes = handleAttributes(
          path.node.openingElement.attributes,
          path
        );

        let component = path.node.openingElement.name.name;
        // PascalCase check:
        if (component.charAt(0) !== component.charAt(0).toUpperCase()) {
          throw path.buildCodeFrameError(
            `ERROR: jsx component: ${component} needs to be in PascalCase with the first letter capitalized!`
          );
        }
        const childrenNodeArr = path.node.children;

        const childrenNamesArr =
          childrenNodeArr.length > 0
            ? childrenNodeArr
                // filter out "JSXText" (ie. whitespace):
                .filter((el) => el.type !== "JSXText")
                // return [strings]:
                .map((child) => child.openingElement.name.name)
            : // no children? assign null
              null;

        if (childrenNamesArr) {
          console.log("childrenNamesArr:", childrenNamesArr);
          // ensure every unique child name is inside the .possibleChildren prop
          for (const child of childrenNamesArr) {
            if (ss[component].possibleChildren.includes(child)) {
              throw path.buildCodeFrameError(
                `ERROR: jsx component: ${component} has an invalid child called: ${child}!`
              );
            }
          }
        }
        pageArr.push({
          [component]: {
            attributes: attributes,
            children: childrenNamesArr,
          },
        });

        const ssComponent = getSSComponentCalls(
          component,
          attributes,
          childrenNamesArr
        );

        console.log("ssComponent:", ssComponent);
      },
    },
  };
}

// console.log("output.code:", output.code);
