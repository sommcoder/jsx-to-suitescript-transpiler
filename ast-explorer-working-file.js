exports.default = createPlugin;

const ui = "ui";

function createPlugin(babel) {
  const { types: t } = babel;

  //////////////////////////// SUITESCRIPT LIBRARY
  const SS = {
    // Page tracks state
    Page: {
      type: null,
    },
    Form: {
      // ui comes from outside the scope of the component function
      add: (ui, props) => {
        return `const ${props.varName} = ${ui}.createForm({
        title: '${props.title}',
      });`;
      },
      attributes: {
        isPage: true,
        canSelfClose: false,
        canHaveChildren: true,
        possibleChildren: ["Sublist", "Field", "Button", "Tab", "FieldGroup"],
        possibleParents: null,
      },
      props: {
        varName: null,
        title: null,
        module: (props) => {
          return `${props.pageVar}.clientScriptModulePath = '${props.path}';
        `;
        },
        fileId: (props) => {
          return `${props.pageVar}.clientScriptFileId = '${props.id}';
        `;
        },
        navBar: (props) => {
          return `${props.pageVar}.clientScriptFileId = '${props.id}';
        `;
        },
      },
    },
    // PascalCase
    FieldGroup: {
      add: (props) => {
        return `const ${props.varName} = ${props.pageVar}.addFieldGroup({
        id: '${props.id}',
        label: '${props.label}',
        ${props.tab ? `tab: ${props.tab}` : ""}
     })
    `;
      },
      attributes: {
        isPage: false,
        canSelfClose: false,
        canHaveChildren: true,
        possibleChildren: ["Field", "Button"],
        possibleParents: ["Form", "Assistant"],
      },
      props: {
        varName: null,
        id: null,
        label: null,
        tab: null,
        single: (props) => {
          return `${props.name}.isSingleColumn;`;
        },
        collapsible: (props) => {
          return `${props.name}.isCollapsible = true;`;
        },
        collapsed: (props) => {
          return `${props.name}.isCollapsed;`;
        },
        borderHidden: (props) => {
          return `${props.name}.isBorderHidden = true;`;
        },
      },
    },
    Sublist: {
      add: (props) => {
        return `const ${props.varName} = ${props.pageVar}.addSublist({
      id: '${props.id}',
      ${props.label ? `label: '${props.label}'` : `label: '${props.id}'`},
 	  ${props.type ? `type: ${props.type},` : ""}
      ${props.tab ? `tab: ${props.tab}` : ""}
    })`;
      },
      attributes: {
        isPage: false,
        canSelfClose: false,
        canHaveChildren: true,
        possibleChildren: ["Field", "Button"],
        possibleParents: ["Form", "Assistant", "Tab"],
      },
      props: {
        label: null,
        type: null,
        id: null,
        tab: null,
        varName: null,
        pageVar: null,
        markAll: (props) => {
          return `${props.varName}.addMarkAllButtons();
        `;
        },
      },
    },
    Field: {
      add: (props) => {
        return `const ${props.varName} = ${props.pageVar}.addField({
      id: '${props.id}',
      ${props.label ? `label: '${props.label}'` : `label: '${props.id}'`},
      type: '${props.type}',
      source: '${props.source}',
      container: '${props.container}'
    })`;
      },
      attributes: {
        isPage: false,
        canSelfClose: true,
        canHaveChildren: true,
        possibleChildren: ["Select"],
        possibleParents: ["Form", "Assistant", "Tab", "Sublist", "List"],
      },
      props: {
        label: null,
        type: null,
        id: null,
        pageVar: null,
        varName: null,
        source: null,
        container: null,
        mandatory: (props) => {
          if (mandatory)
            return `${props.field}.isMandatory = ${props.mandatory};
    `;
          else return "";
        },
        credential: (props) => {
          return `const ${props.varName} = ${props.pageVar}.addCredentialField({
        id: '${props.id}',
        restrictToDomains: '${props.domain}',
        ${props.scriptIds ? `restrictToScriptIds : '${props.scriptIds}'` : ""},
        ${props.restUser ? `restrictToCurrentUser : '${props.restUser}'` : ""},
        ${props.container ? `container: '${props.container}'` : ""}
 })`;
        },
        def: (props) => {
          if (def)
            return `${props.field}.defaultValue = '${props.def}';        `;
          else "";
        },
        help: (props) => {
          return `${props.field}.setHelpText({
    help: '${props.help}'
  });
  `;
        },
        max: (props) => {
          return `${props.field}.maxLength = ${props.max};
  `;
        },
        source: () => {},
        padding: () => {},
        layout: () => {},
        display: () => {},
        select: () => {},
        secret: (props) => {
          return `const ${props.varName} = ${props.pageVar}.addSecretKeyField({
              id: '${props.id}',
              ${props.label ? `label: '${props.label}'` : `label: ${props.id}`},
              restrictToScriptIds: '${props.scriptIds}',
              restrictToCurrentUser: ${props.restUser || false},
            })
  `;
        },
        // the id of the field:
        totalling: (props) => {
          return `${props.sublistVar}.updateTotallingField({
      id: '${props.id}',
})`;
        },
        unique: (props) => {
          return `${props.sublistVar}.updateUniqueFieldId({
  id: '${props.id}',
})`;
        },
      },
    },

    Select: {
      add: (props) => {
        return `${props.fieldVar}.addSelectOption({
                  value : '${props.value}',
                  text : '${props.text}',
                  ${props.isSelected ? `isSelected: true` : ""}
            });
`;
      },
      attributes: {
        isPage: false,
        canSelfClose: true,
        canHaveChildren: false,
        possibleChildren: null,
        possibleParents: ["Field"],
      },
      props: {
        isSelected: false,
        value: null,
        text: null,
        fieldVar: null,
      },
    },
    Button: {
      add: (props) => {
        return `const ${props.varName} = ${props.pageVar}.addButton({
                id: '${props.id}',
                ${
                  props.label
                    ? `label: '${props.label}'`
                    : `label: '${props.id}'`
                },
                ${props.func ? `func: ${props.func}` : ""}
            });`;
      },
      attributes: {
        isPage: false,
        canSelfClose: true,
        canHaveChildren: false,
        possibleChildren: null,
        possibleParents: ["Field", "Form", "Assistant"],
      },
      props: {
        label: null,
        id: null,
        varName: null, // the variable name of this button component
        pageVar: null, // the variable name of the page the button belongs to
        func: null,
        disabled: (props) => {
          return `${props.buttonVar}.clientScriptModulePath = '${props.path}';
        `;
        },
        hidden: (props) => {
          return `${props.buttonVar}.clientScriptFileId = '${props.id}';
        `;
        },
        submit: (props) => {
          return `const submitBtn = ${props.pageVar}.addSubmitButton({
          ${props.label ? `label: '${props.label}'` : ""},
        })
        `;
        },
        reset: (props) => {
          return `const ${props.label || "resetBtn"} = ${
            props.pageVar
          }.addResetButton({
          label: '${props.label || "Reset Button"}'
        })
        `;
        },
        refresh: (props) => {
          return `const refreshBtn = ${props.sublistVar}.addRefreshButton();
        `;
        },
      },
    },
    // creates the Page, whether thats a Form, List or Assistant
    // always gets called in the plugin
    Write: (res, props) => {
      return `
    ${res}.writePage({
        pageObject: ${props.pageVar}
    })  
`;
    },
  };
  ////////////////////////////////////////////////////////////////////
  ////////////////////////// UTILITY FUNCTIONS ///////////////////////

  const ERROR = {
    illegalChar: (label) =>
      `ERROR: jsx label: ${label} contains special characters that are not permitted`,
    invalidComp: (comp) =>
      `ERR: the jsx component: ${comp}, is NOT included in the ss library. Refer to docs to see included components`,
  };

  function createCompObj(type, attrObj, path) {
    try {
      let id = null;
      let varName;
      let props = handleProps(type, attrObj, path);
      console.log("props:", props);
      // if none of the below, must be SELECT component, which doesn't need a label/id/title/varName
      console.log("varName:", props.varName);
      let parentPath = path.findParent((path) => path.isJSXElement()) || null;
      let parentVar;
      // if parent exists:
      if (parentPath) {
        console.log("parent.node:", parentPath.node.openingElement);
        let parentAttrsArr = parentPath.node.openingElement.attributes;
        console.log(parentAttrsArr);
        parentVar = handleProps(
          parentPath.node.openingElement.name.name,
          parentAttrsArr,
          path
        );
      }
      console.log("parent:", parentVar);

      let siblingsArr = [
        ...path
          .getAllNextSiblings()
          .filter((sib) => sib.node.type !== "JSXText")
          .map((sib) => sib.node),
      ];
      let childArr = [
        ...path.node.children
          .filter((child) => child.type !== "JSXText")
          .map((child) => child.openingElement),
      ];
      console.log("childArr", childArr);

      return {
        parent: parentVar,
        props: props,
        type: type,
        siblings: siblingsArr,
        children: childArr,
      };
    } catch (err) {
      console.log("ERROR:", err);
    }
  }

  // controls how props are converted into variables/id's
  function handleVars(type, props, path) {
    console.log("handleVars props:", props);
    if (props.label || props.id || props.title) {
      // id NOT provided, create id from label or title
      if (!props.id && !SS[type].attributes.isPage) {
        props.id = createCompId(props.label || props.title, path);
      }
      props.varName = createVarName(
        props.label || props.id || props.title,
        type,
        path
      );
    } else props.varName = null; // component is a SELECT component
    return props;
  }

  // titles are autogenerated from label attribute, label is REQUIRED in JSSX
  function createCompId(label, path) {
    //  console.log("id: label:", label);
    const regex = /^[a-zA-Z_\s]+$/;
    if (label && regex.test(label)) {
      return `${"custpage_" + label.trim().toLowerCase().split(" ").join("_")}`;
    } else {
      throw path.buildCodeFrameError(ERROR.illegalChar(label));
    }
  }

  // creates a constant variable name of each component
  function createVarName(string, type, path) {
    //console.log("camel: string:", string);
    const regex = /^[a-zA-Z_\s]+$/;
    // No special character, underscore is allowed
    if (regex.test(string)) {
      // console.log("string", string);
      return string
        .trim()
        .toLowerCase()
        .split(" ")
        .map((word, i, arr) => {
          // if NOT first word, make 1st letter uppercase
          if (i !== 0) {
            return word.charAt(0).toUpperCase() + word.slice(1, word.length);
          } else if (word === arr.at(-1) && word !== type) {
            // if last word does not end in the type, concat type to word:
            return (word += type);
          } else return word;
        })
        .join("");
    } else {
      throw path.buildCodeFrameError(ERROR.illegalChar(string));
    }
  }

  // EXPORTED FUNCTIONS to INDEX.JS
  function getSSComponentCalls(compInput, path) {
    // if Page component, handle differently

    console.log("compInput", compInput);
    console.log("PROPS", compInput.props);

    // an array of the names of props that add syntax (ie. are functions/objects)
    let propCallsObj = {
      varName: compInput.props.varName,
      pageVar: pageVar,
    }; // gets varName by default
    let addPropsObj = {};
    let suiteScriptSyntax;

    // if component has a varName
    /*
    if (compInput.props.varName) {
      addPropsArr.set("varName", compInput.props.varName);
      propCallsArr.set("varName", compInput.props.varName);
    }
    */

    // categorize prop keys by whether they are part of the add Call or Other SS Calls:
    for (let [key, value] of Object.entries(compInput.props)) {
      // console.log("key:", key, "value:", value);
      if (typeof SS[compInput.type].props[key] !== "object") {
        propCallsObj[key] = value;
      } else {
        addPropsObj[key] = value;
      }
    }

    console.log("propCallsObj", propCallsObj);
    console.log("addPropsObj", addPropsObj);

    // ADD COMPONENT SYNTAX, arguments are spread because .add's parameters vary across components:
    // ADD Page component:
    if (SS[compInput.type].attributes.isPage) {
      console.log("PAGE!");
      suiteScriptSyntax = SS[compInput.type].add(ui, addPropsObj);
    } else {
      // ADD non-Page component:
      console.log("NOT PAGE!");
      suiteScriptSyntax = SS[compInput.type].add(addPropsObj);

      for (let [key, value] of Object.entries(propCallsObj)) {
        console.log("key:", key, "value:", value);

        if (typeof key === "object") {
          console.log(SS[compInput.type].props[key]);
          suiteScriptSyntax += SS[compInput.type].props[key](value);
        }
      }
    }

    console.log("suiteScriptSyntax: \n", suiteScriptSyntax);
  }

  function hasValidChildren(childrenNamesArr, comp) {
    return childrenNamesArr.every((child) =>
      SS[comp].attributes.possibleChildren.includes(child)
    );
  }

  function handleProps(comp, propsArr, path) {
    let properties = {}; // new props object per component visit

    propsArr.forEach((prop) => {
      const propName = prop.name.name;
      const propValNode = prop.value; // won't exist for some Nodes
      const propValExp = prop.value ? prop.value.expression : null; //  won't exist for some Nodes

      // valid prop of component?
      console.log(SS[comp].props.hasOwnProperty(propName));
      if (!SS[comp].props.hasOwnProperty(propName)) {
        throw path.buildCodeFrameError(
          `ERR: The prop called: '${propName}' is NOT a valid prop in the component: '${comp}'`
        );
      }
      // is duplicate?
      if (properties.hasOwnProperty(propName)) {
        throw path.buildCodeFrameError(
          `ERR: there is already an prop called: '${propName}' in the component: '${comp}. There cannot be duplicate props in a component'`
        );
      }
      // (ie. disable/mandatory/selected/hidden)
      if (propValNode === null) {
        properties[propName] = true;
        return;
      }
      // eg: prop="yourprop"
      if (t.isStringLiteral(propValNode)) {
        properties[propName] = propValNode.value;
        return;
      }
      // eg: prop={123}
      if (
        t.isJSXExpressionContainer(propValNode) &&
        t.isNumericLiteral(propValExp)
      ) {
        properties[propName] = propValExp.value;
        return;
      }
      // Props w. Bindings (IN FUNCTION SCOPE)
      if (
        t.isJSXExpressionContainer(propValNode) &&
        t.isIdentifier(propValExp)
      ) {
        const identifiersObj = path.scope.bindings;
        // if the identifier object has props:
        if (Object.keys(identifiersObj).length !== 0) {
          let bindingIdNode = identifiersObj[propValExp.name].path.node;
          properties[propName] = bindingIdNode.init.value;
          return;
        }
        // Props w. Bindings (OUTSIDE FUNCTION SCOPE) how do????????
      }
    });
    console.log("createVars", handleVars(comp, properties, path));
    return handleVars(comp, properties, path);
  }
  //////////////////////////////////////////////////////////////
  /////////////////// PLUGIN ///////////////////////////////////
  //////////////////////////////////////////////////////////////

  // Global Object: this is where we track the components insertion order
  const pageArr = []; // structure that indicated relationships
  const syntaxArr = []; // the queue of SS strings for replacing JSX
  let pageVar = "";

  return {
    name: "jssx",
    visitor: {
      JSXElement(path) {
        let compType = path.node.openingElement.name.name;
        console.log("compType:", compType);
        let currComp = {};
        // PascalCase check:
        if (compType.charAt(0) !== compType.charAt(0).toUpperCase()) {
          throw path.buildCodeFrameError(
            `ERROR: jsx compType: ${compType} needs to be in PascalCase with the first letter capitalized!`
          );
        }

        // if no attributes, the syntax/component is void
        let compAttrs = path.node.openingElement.attributes;
        if (compAttrs) {
          // assign pageObj its initial key/values
          currComp = createCompObj(compType, compAttrs, path);

          // first component is Page:
          console.log(pageArr.length);
          if (pageArr.length === 0) pageVar = currComp.props.varName;

          pageArr.push({ [compType]: currComp });
        } else {
          throw path.buildCodeFrameError(
            `ERROR: jsx compType: ${compType} does not have any attributes and therefore must be void!`
          );
        }

        console.log("pageArr", pageArr);

        getSSComponentCalls(currComp, path);
      },
    },
  };
}
