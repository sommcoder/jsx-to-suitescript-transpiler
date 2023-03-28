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
      add: (ui, varName, title) => {
        return `const ${varName} = ${ui}.createForm({
        title: '${title}',
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
        title: null,
        module: (pageVar, path) => {
          return `${pageVar}.clientScriptModulePath = '${path}';
        `;
        },
        fileId: (pageVar, id) => {
          return `${pageVar}.clientScriptFileId = '${id}';
        `;
        },
        navBar: (pageVar, id) => {
          return `${pageVar}.clientScriptFileId = '${id}';
        `;
        },
      },
    },
    // PascalCase
    FieldGroup: {
      add: (pageVar, id, varName, label, tab) => {
        return `const ${varName} = ${pageVar}.addFieldGroup({
        id: '${id}',
        label: '${label}',
        ${tab ? `tab: ${tab}` : ""}
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
        single: (name) => {
          return `${name}.isSingleColumn;`;
        },
        collapsible: (name) => {
          return `${name}.isCollapsible = true;`;
        },
        collapsed: (name) => {
          return `${name}.isCollapsed;`;
        },
        borderHidden: (name) => {
          return `${name}.isBorderHidden = true;`;
        },
      },
    },
    Sublist: {
      add: (pageVar, id, varName, label, type, tab) => {
        return `const ${varName} = ${pageVar}.addSublist({
      id: '${id}',
      ${label ? `label: '${label}'` : `label: '${id}'`},
      tab: '${tab}'
      type: '${type}',
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
        markAll: (sublist) => {
          return `${sublist}.addMarkAllButtons();
        `;
        },
      },
    },
    Field: {
      add: (pageVar, id, varName, label, type, source, container) => {
        return `const ${varName} = ${pageVar}.addField({
      id: '${id}',
      ${label ? `label: '${label}'` : `label: '${id}'`},
      type: '${type}',
      source: '${source}',
      container: '${container}'
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
        mandatory: (field, mandatory) => {
          if (mandatory)
            return `${field}.isMandatory = ${mandatory};
    `;
          else return "";
        },
        credential: (
          id,
          pageVar,
          domain,
          varName,
          scriptIds,
          restUser,
          container
        ) => {
          return `const ${varName} = ${pageVar}.addCredentialField({
        id: '${id}',
        restrictToDomains: '${domain}',
        ${scriptIds ? `restrictToScriptIds : '${scriptIds}'` : ""},
        ${restUser ? `restrictToCurrentUser : '${restUser}'` : ""},
        ${container ? `container: '${container}'` : ""}
 })`;
        },
        def: (field, def) => {
          if (def) return `${field}.defaultValue = '${def}';        `;
          else "";
        },
        help: (field, help) => {
          return `${field}.setHelpText({
    help: '${help}'
  });
  `;
        },
        max: (field, max) => {
          return `${field}.maxLength = ${max};
  `;
        },
        source: () => {},
        padding: () => {},
        layout: () => {},
        display: () => {},
        select: () => {},
        secret: (pageVar, id, varName, scriptIds, restUser, label) => {
          return `const ${varName} = ${pageVar}.addSecretKeyField({
              id: '${id}',
              ${label ? `label: '${label}'` : `label: ${id}`},
              restrictToScriptIds: '${scriptIds}',
              restrictToCurrentUser: ${restUser || false},
            })
  `;
        },
        // the id of the field:
        totalling: (sublistVar, id) => {
          return `${sublistVar}.updateTotallingField({
      id: '${id}',
})`;
        },
        unique: (sublistVar, id) => {
          return `${sublistVar}.updateUniqueFieldId({
  id: '${id}',
})`;
        },
      },
    },

    Select: {
      add: (value, text, fieldVar, isSelected = false) => {
        return `${fieldVar}.addSelectOption({
                  value : '${value}',
                  text : '${text}',
                  ${isSelected ? `isSelected: true` : ""}
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
      add: (pageVar, id, label, varName, func) => {
        return `const ${varName} = ${pageVar}.addButton({
                id: '${id}',
                ${label ? `label: '${label}'` : `label: '${id}'`},
                ${func ? `func: ${func}` : ""}
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
        disabled: (buttonVar, path) => {
          return `${buttonVar}.clientScriptModulePath = '${path}';
        `;
        },
        hidden: (buttonVar, id) => {
          return `${buttonVar}.clientScriptFileId = '${id}';
        `;
        },
        submit: (pageVar, label) => {
          return `const submitBtn = ${pageVar}.addSubmitButton({
          ${label ? `label: '${label}'` : ""},
        })
        `;
        },
        reset: (pageVar, label) => {
          return `const ${label || "resetBtn"} = ${pageVar}.addResetButton({
          label: '${label || "Reset Button"}'
        })
        `;
        },
        refresh: (sublistVar) => {
          return `const refreshBtn = ${sublistVar}.addRefreshButton();
        `;
        },
      },
    },
    // creates the Page, whether thats a Form, List or Assistant
    // always gets called in the plugin
    Write: (res, pageVar) => {
      return `
    ${res}.writePage({
        pageObject: ${pageVar}
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

  // takes in attributes object for each component it is called on,
  // and returns an object of {varName and id} to add to our pageArr for further processing
  function createCompObj(type, attrObj, path) {
    try {
      let id = null;
      let varName;
      let props = handleprops(type, attrObj, path);
      console.log("props:", props);
      // if none of the below, must be SELECT component, which doesn't need a label/id/title/varName
      if (props.label || props.id || props.title) {
        // id NOT provided, create id from label or title
        if (!props.id) {
          id = createCompId(props.label || props.title, path);
          console.log("id:", id);
        } else {
          id = props.id;
        }
        varName = createVarName(
          props.label || props.id || props.title,
          type,
          path
        );
      } else varName = null; // component is a SELECT component

      props.varName = varName;
      props.id = id;
      console.log("varName:", varName);
      let parent = path.findParent((path) => path.isJSXElement()) || null;

      // if parent exists:
      if (parent) {
        console.log("parent.node:", parent.node.openingElement);
        parent = parent.node.openingElement;
      }
      console.log("parent:", parent);
      // console.log(parent.node.openingElement || '');

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
        parent: parent,
        props: props,
        type: type,
        siblings: siblingsArr,
        children: childArr,
      };
    } catch (err) {
      console.log("ERROR:", err);
    }
  }

  // titles are autogenerated from label attribute
  function createCompId(label, path) {
    //  console.log("id: label:", label);
    const regex = /^[a-zA-Z_\s]+$/;
    if (label && regex.test(label)) {
      return `${"custpage_" + label.trim().toLowerCase().split(" ").join("_")}`;
    } else {
      throw path.buildCodeFrameError(ERROR.illegalChar(label));
    }
  }

  // creates the variable string
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
    let propCallsArr = new Map();
    let addPropsArr = new Map();
    let suiteScriptSyntax;

    // if component has a varName
    if (compInput.props.varName) {
      addPropsArr.set("varName", compInput.props.varName);
      propCallsArr.set("varName", compInput.props.varName);
    }

    // categorize prop keys by whether they are part of the add Call or Other SS Calls:
    Object.entries(compInput.props).forEach((prop) => {
      console.log("prop key:", prop[0], ":", prop[1]);
      // if the prop has value
      if (compInput.props[prop]) {
        if (typeof SS[compInput.type].props[prop] !== "object") {
          propCallsArr.set(prop[0], prop[1]);
        } else {
          addPropsArr.set(prop[0], prop[1]);
        }
      }
    });

    console.log("propCallsArr", propCallsArr);
    console.log("addPropsArr", addPropsArr);

    // ADD COMPONENT SYNTAX, arguments are spread because .add's parameters vary across components:
    // Page component?
    if (SS[compInput.type].attributes.isPage) {
      console.log("IS PAGE: compInput.props", compInput.props);
      suiteScriptSyntax = SS[compInput.type].add(
        ui,
        compInput.props[addPropsArr]
      );
      // non-Page component:
    } else {
      suiteScriptSyntax = SS[compInput.type].add(...addPropsArr);

      console.log("suiteScriptSyntax: \n", suiteScriptSyntax);
      // Props API calls:
      propCallsArr.forEach((prop) => {
        suiteScriptSyntax += SS[compInput.type][prop];
      });
    }

    console.log("suiteScriptSyntax: \n", suiteScriptSyntax);
  }

  function hasValidChildren(childrenNamesArr, comp) {
    return childrenNamesArr.every((child) =>
      SS[comp].attributes.possibleChildren.includes(child)
    );
  }

  function handleprops(comp, propsArr, path) {
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
    return properties;
  }
  //////////////////////////////////////////////////////////////
  /////////////////// PLUGIN ///////////////////////////////////
  //////////////////////////////////////////////////////////////

  // Global Object: this is where we track the components insertion order
  const pageArr = []; // structure that indicated relationships
  const syntaxArr = []; // the queue of SS strings for replacing JSX
  let pageVar;

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
          currComp = { ...createCompObj(compType, compAttrs, path) };

          // first component is Page:
          if (pageArr.length === 0) pageVar = currComp.varName;

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
