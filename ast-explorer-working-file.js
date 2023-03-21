exports.default = createPlugin;

const ui = "ui";

function createPlugin(babel) {
  const { types: t } = babel;

  //////////////////////////// SUITESCRIPT LIBRARY
  const SS = {
    Form: {
      isPage: true,
      canSelfClose: false,
      canHaveChildren: true,
      possibleChildren: ["Sublist", "Field", "Button", "Tab", "FieldGroup"],
      possibleParents: null,
      title: null,
      varName: null,
      pageVar: null,
      add: (ui, title, varName) => {
        return `const ${varName} = ${ui}.createForm({
      title: '${title}',
    });`;
      },
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
    // PascalCase
    FieldGroup: {
      isPage: false,
      canSelfClose: false,
      canHaveChildren: true,
      possibleChildren: ["Field", "Button"],
      possibleParents: ["Form", "Assistant"],
      add: (pageVar, id, varName, label, tab) => {
        return `const ${varName} = ${pageVar}.addFieldGroup({
        id: '${id}',
        label: '${label}',
        ${tab ? `tab: ${tab}` : ""}
     })
    `;
      },
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
    Sublist: {
      isPage: false,
      canSelfClose: false,
      canHaveChildren: true,
      possibleChildren: ["Field", "Button"],
      possibleParents: ["Form", "Assistant", "Tab"],
      add: (pageVar, id, varName, label, type, tab) => {
        return `const ${varName} = ${pageVar}.addSublist({
      id: '${id}',
      ${label ? `label: '${label}'` : `label: '${id}'`},
      tab: '${tab}'
      type: '${type}',
    })`;
      },
      label: null,
      type: null,
      markAll: (sublist) => {
        return `${sublist}.addMarkAllButtons();
      `;
      },
    },
    Field: {
      isPage: false,
      canSelfClose: true,
      canHaveChildren: true,
      possibleChildren: ["Select"],
      possibleParents: ["Form", "Assistant", "Tab", "Sublist", "List"],
      add: (pageVar, id, varName, label, type, source, container) => {
        return `const ${varName} = ${pageVar}.addField({
      id: '${id}',
      ${label ? `label: '${label}'` : `label: '${id}'`},
      type: '${type}',
      source: '${source}',
      container: '${container}'
    })`;
      },
      label: null,
      type: null,

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

    Select: {
      isPage: false,
      canSelfClose: true,
      canHaveChildren: false,
      possibleChildren: null,
      possibleParents: ["Field"],
      add: (value, text, fieldVar, isSelected = false) => {
        return `${fieldVar}.addSelectOption({
                  value : '${value}',
                  text : '${text}',
                  ${isSelected ? `isSelected: true` : ""}
            });
`;
      },
      fieldVar: null,
      isSelected: false,
      value: null,
      text: null,
      field: null,
    },

    Button: {
      isPage: false,
      canSelfClose: true,
      canHaveChildren: false,
      possibleChildren: null,
      possibleParents: ["Field", "Form", "Assistant"],
      add: (pageVar, id, label, varName, func) => {
        return `const ${varName} = ${pageVar}.addButton({
                id: '${id}',
                ${label ? `label: '${label}'` : `label: '${id}'`},
                ${func ? `func: ${func}` : ""},
            });`;
      },
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
    // creates the Page, whether thats a Form, List or Assistant
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
  function createCompObj(attrObj, type, path) {
    try {
      let id = null;
      let varName;
      // if none of the below, must be SELECT component:
      if (attrObj.label || attrObj.id || attrObj.title) {
        // if no id provided, create id from label or title
        if (!attrObj.id) {
          id = createCompId(attrObj.label || attrObj.title, path);
          // console.log("id:", id);
        } else {
          id = attrObj.id;
        }
        varName = createVarName(
          attrObj.label || attrObj.id || attrObj.title,
          path
        );
        //console.log("varName:", varName);
        //console.log("id:", id);
      }
      return {
        compType: type,
        varName: varName,
        id: id || null,
        attrs: attrObj,
      };
    } catch (err) {
      console.log("ERROR:", err);
    }
  }

  // titles are autogenerated from label attribute
  function createCompId(label, path) {
    //console.log("id: label:", label);
    const regex = /^[a-zA-Z_\s]+$/;
    if (label && regex.test(label))
      return `${"custpage_" + label.trim().toLowerCase().split(" ").join("_")}`;
    else {
      throw path.buildCodeFrameError(ERROR.illegalChar(label));
    }
  }

  // creates the variable string
  function createVarName(string, path) {
    // console.log("camel: string:", string);
    const regex = /^[a-zA-Z_\s]+$/;
    // No special character, underscore is allowed
    if (regex.test(string))
      return (
        string
          .trim()
          .toLowerCase()
          .split(" ")
          // divide into words
          .map((word, i) => {
            if (i !== 0)
              return word.charAt(0).toUpperCase() + word.slice(1, word.length);
            else return word;
          })
          .join("")
      );
    else {
      throw path.buildCodeFrameError(ERROR.illegalChar(string));
    }
  }

  // EXPORTED FUNCTIONS to INDEX.JS
  function getSSComponentCalls(compInput, path) {
    // if Page component, handle differently
    let suiteScriptSyntax;
    let varName;

    console.log("compInput", compInput);

    let type = compInput.component.details.compType;
    let attrArr = compInput.component.details.attrs;
    let id = compInput.component.details.id;

    // page components:
    if (SS[type].isPage) {
      suiteScriptSyntax = SS[type].add(ui, attrArr.title, varName);
      SS[type].pageVar = varName; // update state with a pageVar value
    } else {
      // non-page components:
      if (type === "Sublist") {
        suiteScriptSyntax = SS[type].add(
          SS[type].pageVar,
          id,
          varName,
          attrArr.type,
          attrArr.label,
          attrArr.tab
        );
      }
      if (type === "Field") {
        // sometimes Field has the Page as a parent, sometimes it has Sublist as parent
        suiteScriptSyntax = SS[type].add(
          SS[type].pageVar,
          id,
          varName,
          attrArr.label,
          attrArr.type,
          attrArr.source,
          attr.container
        );
      }
      if (type === "Button") {
        suiteScriptSyntax = SS[type].add(
          SS[type].pageVar,
          id,
          varName,
          attrArr.label,
          attrArr.func
        );
      }
      if (type === "FieldGroup") {
        suiteScriptSyntax = SS[type].add(
          SS[type].pageVar,
          id,
          varName,
          attrArr.type,
          attrArr.label,
          attrArr.tab
        );
      }

      // handle attribute calls:
      // SS[comp][attr];
    }
    //  console.log("suiteScriptSyntax:", suiteScriptSyntax);
    return suiteScriptSyntax;
  }

  function hasValidChildren(childrenNamesArr, comp) {
    return childrenNamesArr.every((child) =>
      SS[comp].possibleChildren.includes(child)
    );
  }

  function handleAttributes(comp, attrsArr, path) {
    let attributes = {}; // new attributes object per component visit

    attrsArr.forEach((attr) => {
      //   console.log(comp);
      //   console.log(attr);
      //  console.log("start check:", attributes);
      const attrName = attr.name.name;
      const attrValNode = attr.value; // won't exist for some Nodes
      //   console.log("attrValNode:", attrValNode);
      const attrValExp = attr.value ? attr.value.expression : null; //  won't exist for some Nodes

      // valid attribute of component?
      console.log(SS[comp].hasOwnProperty(attrName));
      if (!SS[comp].hasOwnProperty(attrName)) {
        throw path.buildCodeFrameError(
          `ERR: The attribute called: '${attrName}' is NOT a valid attribute in the component: '${comp}'`
        );
      }

      //   console.log("attrName:", attrName);
      if (attrValNode) {
        //    console.log("attrValNode.value:", attrValNode.value);
        //     console.log("attrValExp:", attrValExp);
      }
      // is duplicate?
      if (attributes.hasOwnProperty(attrName)) {
        throw path.buildCodeFrameError(
          `ERR: there is already an attribute called: '${attrName}' in the component: '${comp}. There cannot be duplicate attributes in a component'`
        );
      }
      //   console.log("SS[comp]:", SS[comp]);
      //  console.log("attrName:", attrName);
      //  console.log(SS[comp][attrName]);

      // (ie. disable/mandatory/selected/hidden)
      if (attrValNode === null) {
        attributes[attrName] = true;
        return;
      }
      //   console.log(t.isStringLiteral(attrValNode));
      // eg: attribute="yourAttribute"
      if (t.isStringLiteral(attrValNode)) {
        // console.log("attrName string literal", attrName);
        attributes[attrName] = attrValNode.value;
        return;
      }
      // eg: attribute={123}
      //  console.log("numeric attribute check:", attributes);
      if (
        t.isJSXExpressionContainer(attrValNode) &&
        t.isNumericLiteral(attrValExp)
      ) {
        //   console.log("attrName numeric:", attrName);
        //   console.log("attrValExp.value:", attrValExp.value);
        //   console.log(attributes);
        attributes[attrName] = attrValExp.value;
        //    console.log(attributes);
        return;
      }
      //  console.log(attributes);
      // handle attributes that have a binding that is IN the PAGE's FUNCTION SCOPE
      if (
        t.isJSXExpressionContainer(attrValNode) &&
        t.isIdentifier(attrValExp)
      ) {
        const identifiersObj = path.scope.bindings;
        //   console.log("binding block:", attributes);
        //   console.log("identifiersObj", identifiersObj);

        // if the identifier object has attrs:
        if (Object.keys(identifiersObj).length !== 0) {
          let bindingIdNode = identifiersObj[attrValExp.name].path.node;
          //    console.log("bindingIdNode:", bindingIdNode);
          attributes[attrName] = bindingIdNode.init.value;
          //  console.log("post binding check:", attributes);
          return;
        }
        // outside scope! HOW DO WE GET THIS FROM WITHIN THE JSXELEMENT VISITOR?
      }
    });
    //  console.log("comp attributes return check:", attributes);
    return attributes;
  }

  //////////////////////////////////////////////////////////////
  /////////////////// PLUGIN ///////////////////////////////////
  //////////////////////////////////////////////////////////////

  // this is where we track the components insertion order & their children
  const pageArr = new Array();

  return {
    name: "jssx",
    visitor: {
      JSXElement(path) {
        let compType = path.node.openingElement.name.name;
        let compInput; // what we use to populate

        // PascalCase check:
        if (compType.charAt(0) !== compType.charAt(0).toUpperCase()) {
          throw path.buildCodeFrameError(
            `ERROR: jsx compType: ${compType} needs to be in PascalCase with the first letter capitalized!`
          );
        }

        // handle PARENT CompType
        const parentPath = path.findParent((path) => t.isJSXElement(path.node));
        // console.log("parentPath", parentPath);

        let parentObj; // populate below:
        if (parentPath) {
          let parentType = parentPath.node.openingElement.name.name;

          console.log(
            "parentPath.openingElement",
            parentPath.node.openingElement
          );

          let parentAttrs = handleAttributes(
            parentType,
            parentPath.node.openingElement.attributes,
            path
          );
          // console.log("parentAttrs:", parentAttrs);
          parentObj = createCompObj(parentAttrs, parentType, path);
          // console.log("parentObj", parentObj);
        }

        // handle CHILDREN:
        let childrenArr = [];
        if (path.node.children) {
          const childrenNodeArr = path.node.children.filter(
            (el) => el.type !== "JSXText"
          );
          const childrenNamesArr =
            childrenNodeArr.length > 0
              ? childrenNodeArr.map((child) => child.openingElement.name.name)
              : null;
          // console.log(childrenNamesArr);
          // validate children:
          if (!hasValidChildren(childrenNamesArr, compType)) {
            throw path.buildCodeFrameError(
              `ERROR: jsx compType: ${compType} has an invalid child that is not compatible to be nested within this component!`
            );
          }
          childrenArr = childrenNodeArr.map((child, i) => {
            // console.log("child", child);

            // console.log("opening child:", child.openingElement);
            let childAttrs = handleAttributes(
              childrenNamesArr[i],
              child.openingElement.attributes,
              path
            );
            let childObj = createCompObj(childAttrs, childrenNamesArr[i], path);
            // console.log("childObj", childObj);
            return childObj;
          });
          // console.log("childrenArr", childrenArr);
        }

        // Handle component attributes:
        let compAttrs;
        let compObj;

        console.log(path.node.openingElement);
        if (path.node.openingElement.attributes) {
          compAttrs = handleAttributes(
            compType,
            path.node.openingElement.attributes,
            path
          );
          compObj = createCompObj(compAttrs, compType, path);
        }

        compInput = {
          component: {
            details: compObj,
            parent: parentObj,
            children: childrenArr,
          },
        };

        // populate our rendering queue with the currently visited component
        pageArr.push({
          [compType]: compInput,
        });

        console.log("pageArr:", pageArr);

        // get the syntax
        const ssComponent = getSSComponentCalls(compInput, path);

        console.log("ssComponent:", ssComponent);
      },
    },
  };
}
