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

      // handle attributes with null value (ie. disable/mandatory/selected)
      console.log("attr.value:", attr.value);
      if (attr.value == null) {
        attributes[attr.name.name] = true;
        return;
      }

      // handle string literals:
      if (t.isStringLiteral(attr.value)) {
        attributes[attr.name.name] = attr.value.value;
        return;
      }

      // handle numeric literals:
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
        console.log(Object.keys(identifiersObj).length === 0);

        // inside scope?
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

        // CHILDREN HANDLING********************
        const childArr = path.node.children;
        const children = childArr.filter((el) => el.type !== "JSXText");
        // ATTRIBUTE HANDLING*******************
        const attrsArr = path.node.openingElement.attributes;
        const attributes = handleAttributes(attrsArr, path);

        pageArr.push({
          [component]: { attributes: attributes, children: children },
        });

        console.log("PAGE:", pageArr);
      },
    },
  };
}
