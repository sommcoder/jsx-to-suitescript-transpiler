import babel from "@babel/core";
import * as ss from "./ss-component-lib.js";

const output = babel.transformFileSync("./code.js", {
  plugins: [
    "syntax-jsx",
    function jsxToSS() {
      return {
        name: "jsx-to-ss-transpiler",
        visitor: {
          ReturnStatement(path) {
            // return statement must have an openingEl
            // openingEl must be of type 'JSXOpeningElement'
            const openingEl = path.node.argument.openingElement;
            if (!openingEl || openingEl.type !== 'JSXOpeningElement') return;
          },
          JSXElement(path) {
            console.log(state);
            console.log(path.get("children"));
            const { node } = path;
            console.log(node);
            const componentName = node.openingElement.name.name;
            const propsArr = node.openingElement.attributes;
            const children = node.children;
            // if no children, next element is a sibling
            console.log("children", children);
            const propsObj = {};

            // PROPS:
            if (node.openingElement.attributes.length > 0) {
              propsArr.forEach((el) => {
                if (!propsObj[el.name.name]) {
                  if (typeof el.value == "object" && el.value !== null) {
                    propsObj[el.name.name] = el.value.value;
                  } else {
                    propsObj[el.name.name] = el.value || true;
                  }
                } else
                  throw new Error(
                    "JSX components cannot have two different props of the same name"
                  );
              });
            }
            const parent = path.parent.type;

            // POPULATE
            const template = `SS.createComponent(${componentName}, ${propsObj}, ${
              parent !== "JSXElement" ? "" : node.children
            })`;
            console.log(template);
          },
        },
      };
    },
  ],
});

console.log("output.code:", output.code);
