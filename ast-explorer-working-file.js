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
      add: (ui, title, varName) => {
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
        title: null,
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
                ${func ? `func: ${func}` : ""},
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
    let attrObj = compInput.component.details.attrs;
    let attrArr = Object.keys(attrObj).filter(
      (attr) => typeof attrObj[attr] !== "object"
    );
    let id = compInput.component.details.id;

    console.log("attrArr", attrArr);

    // page components:
    if (SS[type].isPage) {
      suiteScriptSyntax = SS[type].add(ui, attrObj.title, varName);
    } else {
      // non-page components:
      if (type === "Sublist") {
        suiteScriptSyntax = SS[type].add(
          SS[type].pageVar,
          id,
          varName,
          attrObj.type,
          attrObj.label,
          attrObj.tab
        );

        // loop through each attribute in the attrObj and += to ssSyntax
        attrArr.map((attr) => {
          console.log("attr:", attrObj[attr]);

          // suiteScriptSyntax += SS[type].props[attrObj[attr]], id, varName, attrObj.label, attrObj.type, attrObj.source, attrObj.container);
        });
      }
      if (type === "Field") {
        // sometimes Field has the Page as a parent, sometimes it has Sublist as parent
        suiteScriptSyntax = SS[type].add(
          SS[type].pageVar,
          id,
          varName,
          attrObj.label,
          attrObj.type,
          attrObj.source,
          attrObj.container
        );
      }
      if (type === "Button") {
        suiteScriptSyntax = SS[type].add(
          SS[type].pageVar,
          id,
          varName,
          attrObj.label,
          attrObj.func
        );
      }
      if (type === "FieldGroup") {
        suiteScriptSyntax = SS[type].add(
          SS[type].pageVar,
          id,
          varName,
          attrObj.type,
          attrObj.label,
          attrObj.tab
        );
      }

      // handle attribute calls:
    }
  }

  function hasValidChildren(childrenNamesArr, comp) {
    return childrenNamesArr.every((child) =>
      SS[comp].attributes.possibleChildren.includes(child)
    );
  }

  function handleprops(comp, propsArr, path) {
    let properties = {}; // new props object per component visit

    propsArr.forEach((prop) => {
      // console.log(comp);
      // console.log(prop);
      // console.log("start check:", props);
      const propName = prop.name.name;
      const propValNode = prop.value; // won't exist for some Nodes
      //   console.log("propValNode:", propValNode);
      const propValExp = prop.value ? prop.value.expression : null; //  won't exist for some Nodes

      // valid propibute of component?
      console.log(SS[comp].props.hasOwnProperty(propName));
      if (!SS[comp].props.hasOwnProperty(propName)) {
        throw path.buildCodeFrameError(
          `ERR: The prop called: '${propName}' is NOT a valid prop in the component: '${comp}'`
        );
      }

      //   console.log("propName:", propName);
      if (propValNode) {
        //    console.log("propValNode.value:", propValNode.value);
        //     console.log("propValExp:", propValExp);
      }
      // is duplicate?
      if (properties.hasOwnProperty(propName)) {
        throw path.buildCodeFrameError(
          `ERR: there is already an prop called: '${propName}' in the component: '${comp}. There cannot be duplicate props in a component'`
        );
      }
      //   console.log("SS[comp]:", SS[comp]);
      //  console.log("propName:", propName);
      //  console.log(SS[comp][propName]);

      // (ie. disable/mandatory/selected/hidden)
      if (propValNode === null) {
        properties[propName] = true;
        return;
      }
      //   console.log(t.isStringLiteral(propValNode));
      // eg: propibute="yourpropibute"
      if (t.isStringLiteral(propValNode)) {
        // console.log("propName string literal", propName);
        properties[propName] = propValNode.value;
        return;
      }
      // eg: propibute={123}
      //  console.log("numeric propibute check:", props);
      if (
        t.isJSXExpressionContainer(propValNode) &&
        t.isNumericLiteral(propValExp)
      ) {
        //   console.log("propName numeric:", propName);
        //   console.log("propValExp.value:", propValExp.value);
        //   console.log(props);
        properties[propName] = propValExp.value;
        //    console.log(props);
        return;
      }
      //  console.log(props);
      // handle props that have a binding that is IN the PAGE's FUNCTION SCOPE
      if (
        t.isJSXExpressionContainer(propValNode) &&
        t.isIdentifier(propValExp)
      ) {
        const identifiersObj = path.scope.bindings;
        //   console.log("binding block:", props);
        //   console.log("identifiersObj", identifiersObj);

        // if the identifier object has props:
        if (Object.keys(identifiersObj).length !== 0) {
          let bindingIdNode = identifiersObj[propValExp.name].path.node;
          //    console.log("bindingIdNode:", bindingIdNode);
          properties[propName] = bindingIdNode.init.value;
          //  console.log("post binding check:", props);
          return;
        }
        // outside scope! HOW DO WE GET THIS FROM WITHIN THE JSXELEMENT VISITOR?
      }
    });
    //  console.log("comp props return check:", props);
    return properties;
  }

  //////////////////////////////////////////////////////////////
  /////////////////// PLUGIN ///////////////////////////////////
  //////////////////////////////////////////////////////////////

  // this is where we track the components insertion order & their children
  const pageObj = {};

  return {
    name: "jssx",
    visitor: {
      JSXElement(path) {
        let compType = path.node.openingElement.name.name;
        // PascalCase check:
        if (compType.charAt(0) !== compType.charAt(0).toUpperCase()) {
          throw path.buildCodeFrameError(
            `ERROR: jsx compType: ${compType} needs to be in PascalCase with the first letter capitalized!`
          );
        }

        let compAttrs = path.node.openingElement.attributes;

        /*
        ////////////////// handle PARENT
        const parentPath = path.findParent((path) => t.isJSXElement(path.node));
        // console.log("parentPath", parentPath);

        let parentObj; // populate below:
        if (parentPath) {
          let parentType = parentPath.node.openingElement.name.name;

          // console.log("parentPath.openingElement", parentPath.node.openingElement);

          let parentAttrs = handleprops(parentType, parentPath.node.openingElement.attributes, path);
          // console.log("parentAttrs:", parentAttrs);
          parentObj = createCompObj(parentAttrs, parentType, path);
          // console.log("parentObj", parentObj);
        }
        */

        // HANDLE VISITED NODE:
        if (compAttrs) {
          let props = handleprops(compType, compAttrs, path);
          let compObj = createCompObj(compType, compAttrs, path);
          // plot the pageObj with current node
          pageObj[compType] = {
            props: props,
            compObj: compObj,
            siblings: [],
            children: [],
          };
        }

        console.log(pageObj);

        // HANDLE SIBLINGS:
        const siblingsArr = path
          .getAllNextSiblings()
          .filter((sib) => sib.node.type !== "JSXText")
          .map((sib) => sib.node);

        siblingsArr.forEach((s, i) => {
          let sibType = s.openingElement.name.name;
          let sibAttrs = s.openingElement.attributes; // get raw attributes
          let sibProps = handleprops(sibType, sibAttrs, path); // handle them by their type
          let compObj = createCompObj(sibType, sibAttrs, path);

          // add siblings to page:
          pageObj[compType].siblings.push(compObj);

          console.log(pageObj);

          if (s.children.length === 0) {
            return; // if no children, next sibling!
          } else {
            let childArr = s.children
              .filter((child) => child.type !== "JSXText")
              .map((child) => child.openingElement);
            console.log("childArr", childArr);

            childArr.forEach((c, n) => {
              let childType = c.openingElement.name.name;
              let childAttrs = c.openingElement.attributes; // get raw attributes
              let childProps = handleprops(childType, childAttrs, path); // handle them by their type
              let compObj = createCompObj(childType, childAttrs, path);

              // add child to sibling:
              pageObj[compType].siblings[i].children.push(compObj);
            });
          }
        });

        console.log(pageObj);

        console.log("siblingsArr", siblingsArr);

        /*
        ///////////////////// handle CHILDREN:

        if (path.node.children.length !== 0) {
          // console.log("path.node.children", path.node.children);
          const childrenNodeArr = path.node.children.filter((el) => el.type !== "JSXText");
          const childrenNamesArr = childrenNodeArr.length > 0 ? childrenNodeArr.map((child) => child.openingElement.name.name) : null;
          //console.log("childrenNodeArr", childrenNodeArr);
          //console.log("childrenNamesArr", childrenNamesArr);

          // validate children:
          if (!hasValidChildren(childrenNamesArr, compType)) {
            throw path.buildCodeFrameError(
              `ERROR: jsx compType: ${compType} has an invalid child that is not compatible to be nested within this component!`
            );
          }
          childrenArr = childrenNodeArr.map((child, i) => {
            // console.log("child", child);

            // console.log("opening child:", child.openingElement);
            let childAttrs = handleprops(childrenNamesArr[i], child.openingElement.attributes, path);
            let childObj = createCompObj(childAttrs, childrenNamesArr[i], path);
            // console.log("childObj", childObj);
            return childObj;
          });
          // console.log("childrenArr", childrenArr);
        }

        // Handle component attributes:
        let compObj;

        // console.log(path.node.openingElement);
        if (path.node.openingElement.attributes) {
          compAttrs = handleprops(compType, path.node.openingElement.attributes, path);
          compObj = createCompObj(compAttrs, compType, path);
        }

        compInput = {
          component: { details: compObj, parent: parentObj, sibling: "", children: childrenArr }
        };

        // populate our rendering queue with the currently visited component

        // get the syntax
        const suitescriptcalls = getSSComponentCalls(compInput, path);
        compInput.suitescript = suitescriptcalls;

        pageObj[compType] = compInput;

        console.log("pageObj:", pageObj);
        */
      },
    },
  };
}
