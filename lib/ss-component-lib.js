export { suiteScriptLibrary as SS };
import { ERROR } from "./errors.js";
import * as UTIL from "./util.js";

const suiteScriptLibrary = {
  Search: {
    add: (search) => {
      const requiredProps = ["type"];
      UTIL.checkProps(requiredProps, search.props);
      /*
 
**** How to handle JOINs in a search?
 
*/

      // HANDLE SEARCH CREATE:
      let searchCompSyntax = `\nlet i = 0;\n\nsearch.create({\n   ${
        search.props.type ? `type: '${search.props.type}',\n` : ""
      }   ${search.props.title ? `title: '${search.props.title}',\n` : ""}    ${
        search.props.filters
          ? `filters: [\n   ${search.props.filters.map((filter) => {
              if (Array.isArray(filter)) {
                return `[${filter.map((el) => UTIL.isObject(el))}]`;
              } else return UTIL.isObject(filter);
            })}\n],\n`
          : ""
      }${
        search.children.length > 0
          ? `columns: [${search.children.map(
              (child) => `'${child.props.arguments.column}'`
            )}],\n`
          : ""
      }}).run().each((result) => {\n`;

      // HANDLE RESULTSET.EACH() TRAVERSAL:
      // FIELD CHILDREN
      if (search.children.every((child) => child.compType === "Field")) {
        search.children.map((child, i, arr) => {
          //  console.log("child", child.props.arguments);
          searchCompSyntax += `\n${
            child.props.arguments.parentVar
          }.setSublistValue({\n   id: '${
            child.props.arguments.id
          }',\n    line: i,\n    value: result.${
            // if type = result.getText(), else: result.getValue()
            child.props.arguments.type === "text"
              ? `getText({\n   name: '${child.props.arguments.column}',\n}),`
              : `getValue({\n    name: '${child.props.arguments.column}',\n}),`
          }
        });`;
        });
      } else if (
        // SELECT CHILDREN
        search.children.every((child) => child.compType === "Select")
      ) {
        search.children.map((child) => {
          searchCompSyntax += `\n${
            child.props.arguments.parentVar
          }.addSelectOptions({\n    ${
            child.props.arguments.text
              ? `text: '${child.props.arguments.text}'`
              : `text: result.getText({\n    name: '${child.props.arguments.column}',\n}),`
          }\n  ${
            child.props.arguments.value
              ? `value: '${child.props.arguments.value}'`
              : `value: result.getValue({\n    name: '${child.props.arguments.column}',\n}),`
          }\n});`;
        });
      } else
        throw new Error(
          "Every child of a Search component needs to either be all Field or all Select components exclusively"
        );
      return searchCompSyntax + "\n\ni++\n\nreturn true;\n});"; // close the each() method
    },
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
        save: (props) => {
          return ``;
        },
        load: (props) => {
          return ``;
        },
      },
    },
  },
  Form: {
    add: (props) => {
      const requiredProps = ["title"];
      UTIL.checkProps(requiredProps, props);
      return `const ${props.varName} = serverWidget.createForm({\n   title: '${
        props.title
      }',${props.hideNav ? `\n   hideNavBar: true` : ""}\n});`;
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
      const requiredProps = ["title"];
      UTIL.checkProps(requiredProps, props);
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
      const requiredProps = ["title"];
      UTIL.checkProps(requiredProps, props);
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
      const requiredProps = ["label"];
      UTIL.checkProps(requiredProps, props);
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
      const requiredProps = ["label"];
      UTIL.checkProps(requiredProps, props);
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
      const requiredProps = ["label"];
      UTIL.checkProps(requiredProps, props);
      return `const ${props.varName} = ${
        props.pageVar
      }.addSublist({\n    id: '${props.id}',\n    label: '${props.label}',${
        props.type ? `\n type: '${props.type}',` : ""
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
      // props are what are encapsulated in eachJSSX component tag
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
            props.scriptIds ? `restrictToScriptIds : '${props.scriptIds}',` : ""
          }${
            props.restUser
              ? `\n   restrictToCurrentUser : '${props.restUser}',`
              : ""
          }${props.parentId ? `\n   container: '${props.parentId}'` : ""}\n})`;
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
            props.restrict ? `restrictToCurrentUser: '${props.restrict}',` : ""
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
      const requiredProps = ["label"];
      UTIL.checkProps(requiredProps, props);
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
