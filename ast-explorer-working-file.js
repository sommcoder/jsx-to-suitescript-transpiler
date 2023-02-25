exports.default = createPlugin;

function createPlugin(babel) {
  const { types: t } = babel;

  // library:
  const Form = {
    add: (ui, title) => {
      return `const ${title} = ${ui}.createForm({
                title: ${title},
            });`;
    },
  };

  // this is where we track the components and their insertion order
  const page = new Map();

  function createSSComponent(el, attr, children) {}

  return {
    name: "jssx",
    visitor: {
      ReturnStatement(path) {
        // early return if code is not JSX:
        const openingEl = path.node.argument.openingElement;
        if (!openingEl || openingEl.type !== "JSXOpeningElement") return;
      },
      JSXElement(path) {
        console.log("JSX Element path:", path);
        const component = path.node.openingElement.name.name;
        console.log("component:", component);
        const childArr = path.node.children;

        // filter out children that are JSXText (ie. whitespace)
        const children = childArr.filter((el) => el.type !== "JSXText");
        console.log("children:", children);

        // get attributes array
        const attrsArr = path.node.openingElement.attributes;
        console.log("attribute arr:", attrsArr);

        let attributes = {};

        attrsArr.forEach((attr) => {
          console.log("attribute pairing:", attr.name.name, ":", attr.value);
          console.log("attr:", attr);

          // handle attributes with no value / binding (ie. disable/mandatory/selected)
          console.log("attr.value:", attr.value);
          if (attr.value == null) {
            attributes[attr.name.name] = true;
            return; // return instead of continue becasue we're in a forEach function
            // and NOT a FOR loop!
          }

          // handle string literals
          if (t.isStringLiteral(attr.value)) {
            console.log("attr is a string literal");
            // attr.value.value
            // attr.name.name
            attributes[attr.name.name] = attr.value.value;
            console.log("attributesObj:", attributes);
          }

          // HOW DO WE HANDLE

          // handle attributes that have a binding in scope
          if (t.isJSXExpressionContainer(attr.value)) {
            console.log("attr is a JSX expression container");
            const identifiersObj = path.scope.bindings;
            console.log("id obj", identifiersObj);

            //console.log(attr.name.name); ---> this is the name of the JSXAttribute!

            // we need the name of the JSXExpression --> attr.value.expression.name
            let bindingIdNode =
              identifiersObj[attr.value.expression.name].path.node;
            console.log(bindingIdNode.id.name, ":", bindingIdNode.init.value);
            // .path.node.id.name
            // .path.node.init.value

            attributes[attr.name.name] = bindingIdNode.init.value;

            console.log("attributesObj:", attributes);
          }

          // handle attributes that have a StringLiteral value
        });

        page.set(component, attributes);
        console.log("PAGE:", page);
      },
    },
  };
}
