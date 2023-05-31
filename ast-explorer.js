exports.default = createPlugin;

function createPlugin(babel) {
  const { types: t } = babel;

  //////////////////////////// UTIL FUNCTIONS:
  const UTIL = {
    checkProps: (reqPropsArr, props) => {
      reqPropsArr.forEach((prop) => {
        if (!Object.keys(props).includes(prop)) {
          throw new Error(ERROR.missingRequiredProp(props.type, prop));
        }
      });
    },
  };
  //////////////////////////// SUITESCRIPT LIBRARY

  const SS = {
    Search: {
      attributes: {
        isPage: false,
        isSearch: true,
        canBeSearched: false,
        possibleChildren: ["Field", "Select"],
        possibleParents: ["Sublist"],
        possibleVariants: ["Field", "Select"],
      },
      props: {
        variables: {
          load: null, // a keyword for loading an existing saved search
          type: null,
          title: null,
          filters: null, // string or [string] or [object]
          settings: null, // string or [string] or [object]
          line: null,
          method: null,
          // ignore parentVar, should be ignored in the hierarchy.
          // if parent === Search, find Searches parent type of thing
          // parentVar: null,
          varName: null,
          title: null,
          module: null,
          fileId: null,
        },
        methods: {
          add: (props) => {
            return ``;
          },
          load: (props) => {
            return ``;
          },
          getValue: (props) => {
            return `result.getValue({\n   name: "${props.name}",\n}),`;
          },
          getText: (props) => {
            return `result.getText({\n   name: "${props.name}",\n}),`;
          },
          setSublistValue: (props) => {
            return `
           ${props.parentVar}.setSublistValue({\n   id: "${props.varName}",\n   line: ${props.line},\n    value: ${props.method}\n});
          `;
          },
        },
      },
    },
    Form: {
      add: (props) => {
        return `const ${
          props.varName
        } = serverWidget.createForm({\n   title: '${props.title}',${
          props.hideNav ? `\n   hideNavBar: true` : ""
        }\n});`;
      },
      attributes: {
        isPage: true,
        isSearch: false,
        canBeSearched: false,
        possibleChildren: ["Sublist", "Field", "Button", "Tab", "FieldGroup"],
        possibleParents: null,
      },
      props: {
        variables: {
          parentVar: null,
          varName: null,
          title: null,
          module: null,
          fileId: null,
        },
        methods: {
          module: (props) =>
            `${props.varName}.clientScriptModulePath = '${props.module}';`,
          fileId: (props) =>
            `${props.varName}.clientScriptFileId = '${props.fileId}';`,
          init: (props) => `
          ${props.varName}.addPageInitMessage(${props.init});
          `,
        },
      },
    },
    List: {
      add: (props) => {
        return `const ${props.varName} = serverWidget.createList({\n   title: '${props.title}',\n});`;
      },
      attributes: {
        isPage: true,
        isSearch: false,
        canBeSearched: false,
        possibleChildren: ["Column", "Row", "Button"],
        possibleParents: null,
      },
      props: {
        variables: {
          parentVar: null,
          varName: null,
          title: null,
          module: null,
          fileId: null,
        },
        methods: {},
      },
    },
    Assistant: {
      add: (props) => {
        return `const ${
          props.varName
        } = serverWidget.createAssistant({\n   title: '${props.title}',${
          props.navBar ? `\n   hideNavBar: true` : ""
        }\n});`;
      },
      attributes: {
        isPage: true,
        isSearch: false,
        canBeSearched: false,
        possibleChildren: [
          "Sublist",
          "Field",
          "Button",
          "Tab",
          "FieldGroup",
          "Step",
        ],
        possibleParents: null,
      },
      props: {
        variables: {
          parentVar: null,
          varName: null,
          title: null,
          module: null,
          fileId: null,
        },
        methods: {},
      },
    },
    Tab: {
      add: (props) => {
        return `${props.pageVar}.addTab({\n   id: '${props.id}',\n    label: '${props.label}',\n});`;
      },
      attributes: {
        isPage: false,
        isSearch: false,
        canBeSearched: false,
        possibleChildren: ["Field", "Button", "Sublist", "FieldGroup"],
        possibleParents: ["Form", "List", "Assistant"],
      },
      props: {
        variables: {
          varName: null,
          parentVar: null,
          id: null,
          label: null,
          tab: null,
        },
        methods: {
          help: (props) => `${props.varName}.helpText = '${props.help}'`,
        },
      },
    },
    // PascalCase
    FieldGroup: {
      add: (props) => {
        return `const ${props.varName} = ${
          props.pageVar
        }.addFieldGroup({\n     id: '${props.id}',\n      label: '${
          props.label
        }',${props.parentId ? `\n      tab: '${props.parentId}'` : ""}\n});`;
      },
      attributes: {
        isPage: false,
        isSearch: false,
        canBeSearched: false,
        possibleChildren: ["Field", "Button"],
        possibleParents: ["Form", "Assistant", "List", "Tab"],
      },
      props: {
        variables: {
          parentVar: null,
          varName: null,
          id: null,
          label: null,
          tab: null,
          parentId: null,
        },
        methods: {
          single: (props) => `${props.varName}.isSingleColumn;`,
          collapsible: (props) => `${props.varName}.isCollapsible = true;`,
          collapsed: (props) => `${props.varName}.isCollapsed;`,
          borderHidden: (props) => `${props.varName}.isBorderHidden = true;`,
        },
      },
    },
    Sublist: {
      add: (props) => {
        return `const ${props.varName} = ${
          props.pageVar
        }.addSublist({\n    id: '${props.id}',\n    label: '${props.label}',${
          props.type ? `\n type: ${props.type},` : ""
        }${props.parentId ? `\n    tab: '${props.parentId}'` : ""}\n});`;
      },
      attributes: {
        isPage: false,
        isSearch: false,
        canBeSearched: true,
        possibleChildren: ["Field", "Button", "Search"],
        possibleParents: ["Form", "Assistant", "List", "Tab"],
      },
      props: {
        // props are what are encapsulated in each JSSX component tag
        variables: {
          possibleTypes: ["inlineeditor", "editor", "list", "staticlist"],
          label: null, // what the user wants to call the component
          type: null, // the type of component
          id: null, // the autogenerated id
          tab: null, // the tab variable that the component belongs to, inferred?
          parentVar: null,
          parentId: null,
          varName: null,
          pageVar: null,
        },
        methods: {
          markAll: (props) => `${props.varName}.addMarkAllButtons();`,
        },
      },
    },
    Field: {
      add: (props) => {
        const requiredProps = ["label", "type"];
        UTIL.checkProps(requiredProps, props);
        return `const ${props.varName} = ${
          props.parentVar
        }.addField({\n    id: '${props.id}',${
          props.label
            ? `\n   label: '${props.label}'`
            : `\n    label: '${props.varName}'`
        },${props.type ? `\n    type: '${props.type}',` : ""}${
          props.parentId ? `\n   container: '${props.parentId}',` : ""
        }${props.source ? `\n    source: '${props.source}',` : ""}\n});`;
      },
      attributes: {
        isPage: false,
        isSearch: false,
        canBeSearched: true,
        possibleChildren: ["Select", "Search"],
        possibleParents: [
          "Form",
          "Assistant",
          "Tab",
          "Sublist",
          "List",
          "FieldGroup",
        ],
        possibleVariants: ["secret", "totalling", "unique"],
        // types are for normal Fields, type props on a variant component will throw a redundancy error and the type shouldn't transpile nor should the return of an add() call
        typeRules: {
          restrictSublistParent: [
            "checkbox",
            "datetime",
            "datetimetz",
            "richtext",
            "longtext",
            "multiselect",
            "help",
            "file",
            "radio",
          ],
          file: {
            permissions: {
              parent: ["Form", "Assistant"],
            },
          },
          image: {
            permissions: {
              parentType: ["staticlist"],
              parent: ["Sublist", "List", "Form"],
            },
          },
        },
      },
      props: {
        variables: {
          column: null,
          label: null,
          type: null,
          id: null,
          parentVar: null,
          parentId: null,
          pageVar: null,
          varName: null,
          source: null,
          breakType: null,
          restScriptIds: null,
          restrict: null,
        },
        methods: {
          // !! Credential is Currently untested!!!!
          credential: (props) => {
            return `const ${props.varName} = ${
              props.pageVar
            }.addCredentialField({\n    id: '${
              props.id
            }',\n    restrictToDomains: '${props.domain}',\n   ${
              props.scriptIds
                ? `restrictToScriptIds : '${props.scriptIds}',`
                : ""
            }${
              props.restUser
                ? `\n   restrictToCurrentUser : '${props.restUser}',`
                : ""
            }${
              props.parentId ? `\n   container: '${props.parentId}'` : ""
            }\n})`;
          },
          breakType: (props) => {
            return `${props.varName}.updateBreakType({\n    breakType: ${props.breakType}\n});`;
          },
          // example:    size={height: 40, width: 50}
          size: (props, value) => {
            return `${props.varName}.updateDisplaySize({\n   height: ${
              props.h || value.h
            },\n    width: ${props.w || value.w},\n  });`;
          },
          layout: (props) => {},
          alias: (props) => {},
          def: (props, value) => `${props.varName}.defaultValue = '${value}';`,
          help: (props, value) => {
            return `${props.varName}.setHelpText({\n   help: '${value}'\n});`;
          },
          mandatory: (props) =>
            `${props.field}.isMandatory = ${props.mandatory};`,
          link: (props) => `${props.varName}.linkText = '${props.link}';`,
          max: (props) => `${props.field}.maxLength = ${props.max};`,
          padding: (props) => `${props.varName}.padding = ${props.padding};`,
          // secret is a special variant of field
          // it's parent MUST BE a page a secret field cannot be nested in non-page components

          // special Field component variants:
          // if special, ignore .add()
          // if nested in a fieldGroup or Tab, this parent will be inferred as the container and props.parentId will be the value container is given
          secret: (props) => {
            if (props.hasOwnProperty("type")) {
              console.log(ERROR.redundantProp(props.type, props.compType));
            }
            const reqProps = ["label", "restScriptIds"];
            UTIL.checkProps(reqProps, props);

            return `const ${props.varName} = ${
              props.pageVar
            }.addSecretKeyField({\n   id: '${props.id}',\n    ${
              props.label ? `label: '${props.label}'` : `label: ${props.id}`
            },\n    ${
              props.scriptIds
                ? `restrictToScriptIds: '${props.restScriptIds}',`
                : ""
            }\n   ${
              props.restrict
                ? `restrictToCurrentUser: '${props.restrict}',`
                : ""
            }\n   ${
              props.parentId ? `container: '${props.parentId}',` : ""
            }\n});`;
          },
          // the id of the field:
          totalling: (props) => {
            return `${props.parentVar}.updateTotallingField({\n   id: '${props.id}',\n})`;
          },
          unique: (props) => {
            return `${props.parentVar}.updateUniqueFieldId({\n    id: '${props.id}',\n})`;
          },
        },
      },
    },

    Select: {
      add: (props) => {
        return `${props.parentVar}.addSelectOption({\n    value : '${
          props.value
        }',\n   text : '${props.text}',${
          props.isSelected ? `\n   isSelected: true` : ""
        }\n});`;
      },
      attributes: {
        isPage: false,
        isSearch: false,
        canBeSearched: false,
        possibleChildren: null,
        possibleParents: ["Field"],
      },
      props: {
        variables: {
          column: null,
          isSelected: false,
          value: null,
          text: null,
          varName: null,
          parentVar: null, // can only be Field anyways
        },
        methods: {},
      },
    },
    Button: {
      add: (props) => {
        return `const ${props.varName} = ${
          props.parentVar
        }.addButton({\n   id: '${props.id}',${
          props.label
            ? `\n   label: '${props.label}'`
            : `\n    label: '${props.id}'`
        },${
          props.pageVar === "Form" && props.fn
            ? `\n    functionName: ${props.fn}`
            : ""
        }\n});`;
      },
      attributes: {
        isPage: false,
        isSearch: false,
        canBeSearched: false,
        possibleChildren: null,
        possibleParents: ["List", "Form", "Assistant", "Sublist"],
        possibleVariants: ["hidden", "submit", "reset"],
      },
      props: {
        variables: {
          label: null,
          id: null,
          parentType: null,
          parentVar: null,
          varName: null, // the variable name of this button component
          pageVar: null, // the variable name of the page the button belongs to
          fn: null,
        },
        methods: {
          disabled: (props) =>
            `${props.buttonVar}.clientScriptModulePath = '${props.path}';`,
          hidden: (props) =>
            `${props.buttonVar}.clientScriptFileId = '${props.id}';`,
          // if submit, id disregarded, label accepted only, default: "Submit Button"
          submit: (props) => {
            return `const ${props.varName || "submitBtn"} = ${
              props.parentVar
            }.addSubmitButton({\n    ${
              props.label ? `label: '${props.label}'` : `label: "Submit Button"`
            },\n});`;
          },
          // if reset, id disregarded, label accepted only, default: "Reset Button"
          // parent MUST be a Page
          reset: (props) => {
            return `const ${props.varName || "resetBtn"} = ${
              props.parentVar
            }.addResetButton({\n    ${
              props.label ? `label: '${props.label}'` : `label: "Reset Button"`
            },\n});`;
          },
          // if reset, id AND label disregarded,
          refresh: (props) =>
            `const ${props.varName || "refreshBtn"} = ${
              props.parentVar
            }.addRefreshButton();`,
        },
      },
    },
    // creates the Page, whether thats a Form, List or Assistant
    // always gets called in the plugin
    Write: (pageVar) => {
      return `context.response.writePage({\n    pageObject: '${pageVar}'\n});`;
    },
  };

  ////////////////////////////////////////////////////////////////////
  ////////////////////////// UTILITY FUNCTIONS ///////////////////////

  const ERROR = {
    illegalChar: (label) =>
      `\nJSSX ERROR: jsx label: ${label} contains special characters that are not permitted`,
    invalidCase: (compType) =>
      `\nJSSX ERROR: jsx compType: ${compType} needs to be in PascalCase with the first letter capitalized!`,
    invalidChild: (compType) =>
      `\nJSSX ERROR: there is an invalid child in the component: ${compType}`,
    invalidParent: (compType, parentType) =>
      `\nJSSX ERROR: Parent type: ${parentType} is not a valid parentType for: "${compType}"`,
    invalidComp: (compType) =>
      `\nJSSX ERROR: the jsx component: ${compType}, is NOT included in the ss library. Refer to docs to see included components`,
    noProps: (compType) =>
      `\nJSSX ERROR: jssx compType: ${compType} does not have any attributes/props and therefore is void! Components must have label/title at the very least!`,
    invalidProp: (propName, compType) =>
      `\nJSSX ERROR: The prop called: '${propName}' is NOT a valid prop in the component: '${compType}'`,
    duplicateProp: (propName, compType) =>
      `\nJSSX ERROR: there is already an prop called: '${propName}' in the component: '${compType}. There cannot be duplicate props in a component'`,
    redundantProp: (prop, compType) =>
      `\nJSSX ERROR: The prop: "${prop}" is considered a redundant prop on component: "${compType}"`,
    missingRequiredProp: (type, prop) =>
      `\nJSSX ERROR: The "${type}" component is missing a required prop called "${prop}", please refer to the JSSX and/or NetSuite docs`,
    insufficientTabs: () =>
      `\nJSSX ERROR: JSSX successfully transpiled, however there aren't enough tab components for this Form. \nThere must be a minimum of 2 tabs for NetSuite to render Tabs on a Form.`,
    notValidFileArg: (argv) =>
      `\nNODE ERROR: You must specify a .jsx file after the npm command, ex: 'npm run jssx <file>.jsx'. There were no valid file name arguments passed in the following arguments: ${argv}`,
    noFileAccess: (jsxFile, err) =>
      `\nNODE ERROR: Cannot retrieve file: ${jsxFile}. Node error: ${err}`,
  };

  ////////////////////
  /////////////////////////////////////////////
  /////////////////////////////////////

  function handleNode(path) {
    // CHILDREN
    path.node.children = path.node.children.filter(
      (child) => child.type !== "JSXText"
    );
    console.log("path.node.children:", path.node.children);
    console.log(path.node);

    // only validateChildren() if the child array has elements:
    if (path.node.children.length > 0)
      validateChildren(path.node.children, path.node.compType, path);

    // Arguments will get passed into Methods which return strings
    path.node.props = {
      arguments: {
        pageVar: pageVar,
      },
      methods: {},
    };

    // create new instance of component Object from component library:
    // populate path.node
    let compObj = SS[path.node.compType];
    assignProps(compObj, path);

    let parentPath = path.findParent((path) => path.isJSXElement()) || null;
    console.log("BEFORE parentPath", parentPath);
    // PARENT: only if JSXElement
    if (parentPath && parentPath.node.compType === "Search") {
      // re-assign to searches parent:
      parentPath = parentPath.findParent((path) => path.isJSXElement()) || null;
      console.log("AFTER parentPath", parentPath);
    }
    if (parentPath) validateParent(parentPath, compObj, path);

    return path.node;
  }

  function assignProps(compObj, path) {
    // PROP LOOP: loop through propsObj after they've been handled
    // assign them back to the current Node:

    for (let [key, value] of Object.entries(
      handleProps(path.node.compType, path.node.openingElement.attributes, path)
    )) {
      if (
        compObj.attributes.possibleVariants &&
        compObj.attributes.possibleVariants.includes(key)
      ) {
        // if key is one of the possibleVariants, assign variant to key
        // to be used later when we extract and concat our SS syntax
        path.node.variant = key;
      }
      // assign variables to node.arguments:
      if (compObj.props.variables.hasOwnProperty(key))
        path.node.props.arguments[key] = value;
      // assign methods to node.methods:
      if (compObj.props.methods.hasOwnProperty(key))
        path.node.props.methods[key] = value;
    }
  }

  function validateChildren(childNamesArr, compType, path) {
    console.log("childNamesArr[0]:", childNamesArr[0]);
    // if 1st child is a JSX expressionContainer:
    if (t.isJSXExpressionContainer(childNamesArr[0])) {
      console.log("JSX EXPRESSION IS THE CHILD");
      if (childNamesArr[0].expression.callee.object.callee.name === "search") {
        console.log("JSX EXPRESSION IS A SEARCH");
        createSearch(childNamesArr[0]);
        // start building search syntax
      } // if not search, check to see if this is just a regular arr.map() JS call
    } else if (
      !childNamesArr.every((child) =>
        SS[compType].attributes.possibleChildren.includes(
          child.openingElement.name.name
        )
      )
    ) {
      throw path.buildCodeFrameError(ERROR.invalidChild(compType));
    }
  }

  function validateParent(parentPath, compObj, path) {
    path.node.parentNode = parentPath.node;
    path.node.props.arguments.parentType = path.node.parentNode.compType;

    console.log("path.node.parentNode:", path.node.parentNode);

    // Check to ensure that the currComp can have a parent of parentType
    console.log("working");
    if (
      !compObj.attributes.possibleParents.includes(
        path.node.props.arguments.parentType
      )
    ) {
      path.buildCodeFrameError(
        ERROR.invalidParent(
          compObj.compType,
          path.node.props.arguments.parentType
        )
      );
    }

    // if Field, can only have certain parents when it is a certain type
    if (path.node.compType === "Field") {
    }
    /*
      
         3) Check to ensure that the currComp, if Field, can have a parent of parentType BASED on the Field's type!
         
        */

    path.node.compType;

    if (
      path.node.parentNode.compType === "Tab" ||
      path.node.parentNode.compType === "FieldGroup"
    ) {
      // Only if parent is Tab of FieldGroup do we need to get and assign parentId to the current path.node
      path.node.props.arguments.parentId =
        path.node.parentNode.props.arguments.id;
    }
    path.node.props.arguments.parentVar =
      path.node.parentNode.props.arguments.varName;
  }

  function validateType(compObj, compType, typeProp, parentType) {
    compType.toLowerCase();
    compObj.attributes.possibleTypes;
    /*
         
        Check compType against SS library to ensure that:
        1) compType can have a type of typeProp
        2) compType can have a type of typeProp WITH it's parentType's type


        Components with types:
        1) Field
         
        */
  }

  function createSearch(searchNode) {
    console.log("searchNode", searchNode);
    let fieldCheck = searchNode.children.find(
      (child) => child.compType === "Field"
    );

    if (!fieldCheck) searchNode.props.arguments.variant = "Field";
    else searchNode.props.arguments.variant = "Select";
  }

  function handleProps(compType, propsArr, path) {
    // props need to be handled depending on their type, binding and whether they're wrapped in a JSX Expression and the combinations thereof
    let propsObj = {};
    console.log("working here!");

    console.log(propsArr);

    propsArr.forEach((prop) => {
      // attributes of a prop:
      const propName = prop.name.name;
      const propValNode = prop.value;
      const propValExp = prop.value ? prop.value.expression : null;

      // !GUARD CLAUSES:
      if (propsObj.hasOwnProperty(propName)) {
        throw path.buildCodeFrameError(ERROR.duplicateProp(prop, compType));
      }

      if (
        !SS[compType].props.variables.hasOwnProperty(propName) &&
        !SS[compType].props.methods.hasOwnProperty(propName)
      ) {
        throw path.buildCodeFrameError(ERROR.invalidProp(prop, compType));
      }

      // !PROP HANDLING:
      // KEYWORDS: ex. disable | mandatory | selected | hidden
      if (propName && propValNode === null) {
        propsObj[propName] = true;
        return;
      }
      // STRING LITERAL: ex: prop="yourProp"
      if (t.isStringLiteral(propValNode)) {
        propsObj[propName] = propValNode.value;
        return;
      }

      // NUMBER/EXP: ex: prop={123}
      if (
        t.isJSXExpressionContainer(propValNode) &&
        t.isNumericLiteral(propValExp)
      ) {
        propsObj[propName] = propValExp.value;
        return;
      }

      // OBJECT/EXP: ex: prop={{h: 40, w: 6}}
      if (
        t.isJSXExpressionContainer(propValNode) &&
        t.isObjectExpression(propValExp)
      ) {
        propsObj[propName] = {};
        propValExp.properties.forEach(
          (prop) => (propsObj[propName][prop.key.name] = prop.value.value)
        );
        return;
      }
      // what about an expression container with an Array inside???
      // Would we ever need this for SuiteScript??

      // BINDING/EXP: ex: prop={variable}
      // Props w. Bindings in function lexical scope
      if (
        t.isJSXExpressionContainer(propValNode) &&
        t.isIdentifier(propValExp)
      ) {
        const identifiersObj = path.scope.bindings;
        if (Object.keys(identifiersObj).length !== 0) {
          if (!identifiersObj[propValExp.name]) {
            propsObj[propName] = propValExp.name;
          } else {
            let bindingIdNode = identifiersObj[propValExp.name].path.node;

            // Does binding have an array of properties?
            // ie. its a binding to an object with properties
            if (
              bindingIdNode.init.properties &&
              bindingIdNode.init.properties.length > 0
            ) {
              propsObj[propName] = {};
              bindingIdNode.init.properties.forEach((prop) => {
                propsObj[propName][prop.key.name] = prop.value.value;
              });
              // otherwise, just assign the value
            } else {
              propsObj[propName] = bindingIdNode.init.value;
            }
          }
        }
        return;
      }
    });
    // once props have been handled, pass to generateVarId's:
    if (!propsObj.label && !propsObj.title) {
      // Select or Special Button component:
      propsObj.varName = `${compType}_${compStack.length}`;
    } else {
      // ! Generate varName and id for component:
      let { varName, id } = generateVarIdObj(
        propsObj.title || propsObj.label,
        compType,
        path
      );
      propsObj.varName = varName;
      propsObj.id = id;
    }
    return propsObj;
  }

  function generateVarIdObj(string, type, path) {
    console.log("type:", type);
    const stringObj = {
      varName: "",
      id: "custpage",
    };
    const regex = /^[a-zA-Z_\s]+$/;
    if (regex.test(string)) {
      string
        .trim()
        .toLowerCase()
        .split(" ")
        .forEach((word, i, arr) => {
          if (i !== 0) {
            // all words except 1st get their 1st letter capitalized:
            stringObj.varName +=
              word.charAt(0).toUpperCase() + word.slice(1, word.length);
          } else stringObj.varName += word;
          // apply to all:
          stringObj.id += `_${word}`;
          // last word type addition check:
          if (i === arr.length - 1 && word !== type.toLowerCase()) {
            stringObj.varName += type; // word should already be added above
            stringObj.id += `_${type.toLowerCase()}`;
          }
        });
    } else {
      throw path.buildCodeFrameError(ERROR.illegalChar(string));
    }
    return stringObj;
  }

  //////////////////////////////////////////////
  /* Gets the SS syntax by passing arguments into methods returning dynamic string literals */
  function getSSComponentCalls(currNode) {
    // PAGE COMPONENT:
    if (currNode.compType === "Search") {
      console.log("SEARCH", currNode);
      createSearch(currNode);
    }
    if (currNode.compType !== "Search") {
      if (SS[currNode.compType].attributes.isPage) {
        suiteScriptSyntax = `\n${SS[currNode.compType].add(
          currNode.props.arguments
        )}`;
      } else {
        // COMPONENT VARIANTS:
        if (currNode.variant) {
          suiteScriptSyntax += `\n${SS[currNode.compType].props.methods[
            currNode.variant
          ](currNode.props.arguments)}`;
        } else {
          // NON PAGE COMPONENT:
          suiteScriptSyntax += `\n${SS[currNode.compType].add(
            currNode.props.arguments
          )}`;
          // HANDLE OTHER SS METHOD/PROPERTY CALLS:
          if (Object.keys(currNode.props.methods).length > 0) {
            for (let [key, value] of Object.entries(currNode.props.methods)) {
              // console.log("key:", key, "value:", value);
              suiteScriptSyntax += `\n${SS[currNode.compType].props.methods[
                key
              ](currNode.props.arguments, value)}`;
            }
          }
        }
      }
      // if component is Search:
    } else searchSyntax = createSearch(currNode);

    //console.log("suiteScriptSyntax:", suiteScriptSyntax);
    return suiteScriptSyntax;
  }

  let suiteScriptSyntax = ""; // the syntax string we're populating
  let searchSyntax = ""; // search syntax comes AFTER API component calls
  let pageVar = ""; // global variable, needs to be accessible by Node.js
  let tabCount = 0; // tracks tabs, user gets informed if a Form has under 2 tabs

  const compStack = [];
  return {
    name: "jssx",
    visitor: {
      JSXElement(path) {
        let compType = path.node.openingElement.name.name;
        if (compType === "Tab") {
          tabCount++; // tab tracking
        }
        path.node.compType = compType;
        // PascalCase check:
        if (compType.charAt(0) !== compType.charAt(0).toUpperCase()) {
          throw path.buildCodeFrameError(ERROR.invalidCase(compType));
        }
        // Attribute/Prop check:
        if (path.node.openingElement.attributes.length < 1) {
          throw path.buildCodeFrameError(ERROR.noProps(compType));
        }
        let currNode = handleNode(path);
        // set pageVar for child components to reference easily
        if (compStack.length === 0) {
          pageVar = currNode.props.arguments.varName;
        }
        compStack.push(currNode);
        getSSComponentCalls(currNode, path);
      },
    },
  };
}
