import babel from "@babel/core";
import { SS } from "./ss-component-lib.js";
import * as util from "./util.js";
console.log("SS", SS);
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
        const attributes = {};
        attrsArr.forEach((attr) => {
            // no duplicate attribute names!
            if (attributes.hasOwnProperty(attr.name.name)) {
                throw path.buildCodeFrameError(`ERR: there is already an attribute called: ${attr.name.name} in the component: ${component}`);
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
            if (t.isJSXExpressionContainer(attr.value) &&
                t.isNumericLiteral(attr.value.expression)) {
                attributes[attr.name.name] = attr.value.expression.value;
                return;
            }
            // handle attributes that have a binding IN FUNCTION SCOPE
            if (t.isJSXExpressionContainer(attr.value) &&
                t.isIdentifier(attr.value.expression)) {
                const identifiersObj = NodePath.scope.bindings;
                if (!Object.keys(identifiersObj).length === 0) {
                    let bindingIdNode = identifiersObj[attr.value.expression.name].NodePath.node;
                    attributes[attr.name.name] = bindingIdNode.init.value;
                }
                else {
                    // outside scope! HOW DON WE GET THIS!!???
                }
                return;
            }
        });
        return attributes;
    }
    return {
        name: "jssx",
        visitor: {
            ReturnStatement(NodePath) {
                // early return if code is not JSX:
                const openingEl = NodePath.node.argument.openingElement;
                if (!openingEl || openingEl.type !== "JSXOpeningElement")
                    return;
            },
            JSXElement(path) {
                let component = path.node.openingElement.name.name;
                const attributes = handleAttributes(path.node.openingElement.attributes, path);
                // PascalCase check:
                if (component.charAt(0) !== component.charAt(0).toUpperCase()) {
                    throw path.buildCodeFrameError(`ERROR: jsx component: ${component} needs to be in PascalCase with the first letter capitalized!`);
                }
                const childrenNodeArr = path.node.children;
                const childrenNamesArr = childrenNodeArr.length > 0
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
                        if (SS[component].possibleChildren.includes(child)) {
                            throw path.buildCodeFrameError(`ERROR: jsx component: ${component} has an invalid child called: ${child}!`);
                        }
                    }
                }
                pageArr.push({
                    [component]: {
                        attributes: attributes,
                        children: childrenNamesArr,
                    },
                });
                const ssComponent = util.getSSComponentCalls(component, attributes, childrenNamesArr);
                console.log("ssComponent:", ssComponent);
            },
        },
    };
}
// console.log("output.code:", output.code);
