import parser from "@babel/parser";
import traverse from "@babel/traverse";
import jsxToSS from "./jsx-to-ss-plugin";

console.log(jsxToSS);

const ast = parser.parse(code, {
  sourceType: "module",
  plugins: ["jsx"], // Babel parser only accepts INTERNAL plugins
});

console.log("ast:", ast);

// use traverse to update nodes
traverse(ast, {
  JSXElement(path, state) {
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
  },
});

const { code, map } = generate(ast, {
  sourceMaps: true,
});
