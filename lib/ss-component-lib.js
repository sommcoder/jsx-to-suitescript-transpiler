export { suiteScriptLibrary as SS };

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
      title: ${title},
    });`;
    },
    module: (pageVar, path) => {
      return `${pageVar}.clientScriptModulePath = ${path};
      `;
    },
    fileId: (pageVar, id) => {
      return `${pageVar}.clientScriptFileId = ${id};
      `;
    },
    navBar: (pageVar, id) => {
      return `${pageVar}.clientScriptFileId = ${id};
      `;
    },
  },
  // List: {
  //   isPage: true,
  //   canSelfClose: false,
  //   canHaveChildren: true,
  //   possibleChildren: ["Column", "Row", "Button"],
  //   possibleParents: null,
  //   title: null,
  //   varName: null,
  //   pageVar: null,
  //   add: (ui, title, varName) => {
  //     return `const ${varName} = ${ui}.createList({
  //   title: ${title},
  // });`;
  //   },
  //   module: (pageVar, path) => {
  //     return `${pageVar}.clientScriptModulePath = '${path}';
  //   `;
  //   },
  //   fileId: (pageVar, id) => {
  //     return `${pageVar}.clientScriptFileId = ${id};
  //   `;
  //   },
  //   navBar: (pageVar, id) => {
  //     return `${pageVar}.clientScriptFileId = ${id};
  //   `;
  //   },
  // },
  // Column: {
  //   isPage: false,
  //   canSelfClose: true,
  //   canHaveChildren: true,
  //   possibleChildren: ["Column", "Row", "Button"],
  //   possibleParents: ["List"],
  //   title: null,
  //   varName: null,
  //   pageVar: null,
  //   add: (varList, label, type, align, varName) => {
  //     return `const ${varName} = ${varList}.addColumn({
  //       id: ${id},
  //       type: ${type},
  //       label: ${label},
  //       align: ${align}
  // });`;
  //   },
  //   edit: (pageVar, path) => {
  //     return `${pageVar}.clientScriptModulePath = '${path}';
  //   `;
  //   },
  // },
  // Row: {
  //   isPage: false,
  //   canSelfClose: false,
  //   canHaveChildren: true,
  //   possibleChildren: ["Column", "Row", "Button"],
  //   possibleParents: ["List"],
  //   title: null,
  //   varName: null,
  //   pageVar: null,
  //   add: (ui, title, varName) => {
  //     return `const ${varName} = ${ui}.createList({
  //   title: ${title},
  // });`;
  //   },
  //   module: (pageVar, path) => {
  //     return `${pageVar}.clientScriptModulePath = '${path}';
  //   `;
  //   },
  //   fileId: (pageVar, id) => {
  //     return `${pageVar}.clientScriptFileId = ${id};
  //   `;
  //   },
  //   navBar: (pageVar, id) => {
  //     return `${pageVar}.clientScriptFileId = ${id};
  //   `;
  //   },
  // },
  // PascalCase
  FieldGroup: {
    isPage: false,
    canSelfClose: false,
    canHaveChildren: true,
    possibleChildren: ["Field", "Button"],
    possibleParents: ["Form", "Assistant"],
    add: (pageVar, id, varName, label, tab) => {
      return `const ${varName} = ${pageVar}.addFieldGroup({
        id: ${id},
        label: ${label},
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
      id: ${id},
      ${label ? `label: ${label}` : `label: ${id}`},
      tab: ${tab}
      type: ${type},
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
    // container should be determined programatically
    add: (pageVar, id, varName, label, type, source, container) => {
      return `const ${varName} = ${pageVar}.addField({
      id: ${id},
      ${label ? `label: ${label}` : `label: ${id}`},
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
            id: ${id},
            restrictToDomains: ${domain},
            ${scriptIds ? `restrictToScriptIds : ${scriptIds}` : ""},
            ${restUser ? `restrictToCurrentUser : ${restUser}` : ""},
            ${container ? `container: ${container}` : ""}
     })`;
    },
    def: (field, def) => {
      if (def)
        return `${field}.defaultValue = ${def};
        `;
      else "";
    },
    help: (field, help) => {
      return `${field}.setHelpText({
        help: '${help}'
      })
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
                  id: ${id},
                  ${label ? `label: ${label}` : `label: ${id}`},
                  restrictToScriptIds: ${scriptIds},
                  restrictToCurrentUser: ${restUser || false},
                })
      `;
    },
    // the id of the field:
    totalling: (sublistVar, id) => {
      return `${sublistVar}.updateTotallingField({
          id: ${id},
    })`;
    },
    unique: (sublistVar, id) => {
      return `${sublistVar}.updateUniqueFieldId({
      id: ${id},
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
                  value : ${value},
                  text : ${text},
                  ${isSelected ? `isSelected: true` : ""}
            });
`;
    },
    fieldVar: null,
    isSelected: false,
    value: null,
    text: null,
  },

  Button: {
    isPage: false,
    canSelfClose: true,
    canHaveChildren: false,
    possibleChildren: null,
    possibleParents: ["Field", "Form", "Assistant"],
    add: (pageVar, id, varName, label, func) => {
      return `const ${varName} = ${pageVar}.addButton({
                id: ${id},
                ${label ? `label: ${label}` : `label: ${id}`},
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
      return `${buttonVar}.clientScriptFileId = ${id};
      `;
    },
    submit: (pageVar, label) => {
      return `const submitBtn = ${pageVar}.addSubmitButton({
        ${label ? `label: ${label}` : ""},
      })
      `;
    },
    reset: (pageVar, label) => {
      return `const ${label || "resetBtn"} = ${pageVar}.addResetButton({
        label: ${label || "Reset Button"}
      })
      `;
    },
    refresh: (sublistVar) => {
      return `const refreshBtn = ${sublistVar}.addRefreshButton();
      `;
    },
  },
  // creates the Page, whether thats a Form, List or Assistant
  Write: (res, form) => {
    return `
    ${res}.writePage({
        pageObject: ${form}
    })  
`;
  },
};

// How the components connects. This is essentially what Babel creates for us so we just need to figure out how to filter/narrow down options so the we can transpile the code into a flat array of strings then join them as one big string as an output.
FORM = {
  SUBLIST: {
    FIELD: {},
    FIELD: {
      SELECT: {},
      SELECT: {},
    },
    BUTTON: {},
  },
  BUTTON: {},
};

// How the syntax is laid out:
PAGE = [{ SUBLIST }, { FIELD }, { FIELD }, { SELECT }];
