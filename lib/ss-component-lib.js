export { suiteScriptLibrary as SS };

const suiteScriptLibrary = {
  Form: {
    // component props:
    isPage: true,
    canSelfClose: false,
    canHaveChildren: true,
    possibleChildren: ["Sublist", "Field", "Button", "Tab", "FieldGroup"],
    possibleParents: null,
    add: (ui, title, varTitle) => {
      return `const ${varTitle} = ${ui}.createForm({
      title: ${title},
    });`;
    },
    // user-provided props & methods:
    title: "",
    formName: "",
    module: (formName, modulePath) => {
      return `${formName}.clientScriptModulePath = '${modulePath}';
      `;
    },
    fileId: (formName, id) => {
      return `${formName}.clientScriptFileId = ${id};
      `;
    },
    navBar: (formName, id) => {
      return `${formName}.clientScriptFileId = ${id};
      `;
    },
  },
  // PascalCase
  FieldGroup: {
    // component props & methods:
    isPage: false,
    canSelfClose: false,
    canHaveChildren: true,
    possibleChildren: ["Field", "Button"],
    possibleParents: ["Form", "Assistant"],
    add: (formName, label, id, tab) => {
      return `const ${label.split(" ").join("")} = ${formName}.addFieldGroup({
        id: ${id},
        label: ${label},
     })
    `;
    },
    // user-provided props & methods:
    label: "",
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
    // component props & methods:
    isPage: false,
    canSelfClose: false,
    canHaveChildren: true,
    possibleChildren: ["Field", "Button"],
    possibleParents: ["Form", "Assistant", "Tab"],
    tab: "",
    add: (form, id, tab, type, label) => {
      return `const ${label || id} = ${form}.addSublist({
      id: 'custpage_${id}',
      ${label ? `label: ${label}` : `label: ${id}`},
      tab: ${tab}
      type: '${type}',
    })`;
    },
    // user-provided props & methods:
    label: "",
    type: "",
    markAll: (sublist) => {
      return `${sublist}.addMarkAllButtons();
      `;
    },
  },
  Field: {
    // component props & methods:
    isPage: false,
    canSelfClose: true,
    canHaveChildren: true,
    possibleChildren: ["Select"],
    possibleParents: ["Form", "Assistant", "Tab", "Sublist", "List"],
    add: (form, id, type, source, container, label) => {
      return `const ${label || id} = ${form}.addField({
      id: 'custpage_${id}',
      ${label ? `label: ${label}` : `label: ${id}`},
      type: '${type}',
      source: '${source}',
      container: '${container}'
    })`;
    },
    // user-provided props & methods:
    label: "",
    mandatory: (field, mandatory) => {
      if (mandatory)
        return `${field}.isMandatory = ${mandatory};
        `;
      else return "";
    },
    credential: (id, form, domain, scriptIds, restUser, container, label) => {
      return `const ${label || id} = ${form}.addCredentialField({
            id: 'custpage_${id}',
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
    secret: (form, id, scriptIds, restUser, label) => {
      return `const ${label || id} = ${form}.addSecretKeyField({
                  id: 'custpage_${id}',
                  ${label ? `label: ${label}` : `label: ${id}`},
                  restrictToScriptIds: ${scriptIds},
                  restrictToCurrentUser: ${restUser || false},
                })
      `;
    },
    // the id of the field:
    totalling: (sublist, id) => {
      return `${sublist}.updateTotallingField({
          id: 'custpage_${id}',
    })`;
    },
    unique: (sublist, id) => {
      return `${sublist}.updateUniqueFieldId({
      id: 'custpage_${id}',
    })`;
    },
  },
  // Select is a component WITHIN a dropdown Field.
  // THIS IS A MADE-UP component, it is NOT a SuiteScript component
  // BUT in JSSX it is represented as it's own field to allow for better readability.
  // Select MUST have a parent of Field
  // Select returns void in SuiteScript
  Select: {
    // component props:
    isPage: false,
    canSelfClose: true,
    canHaveChildren: false,
    possibleChildren: null,
    possibleParents: ["Field"],
    add: (value, text, field, isSelected = false) => {
      return `${field}.addSelectOption({
                  value : ${value},
                  text : ${text},
                  ${isSelected ? `isSelected: true` : ""}
            });
`;
    },
    isSelected: false,
    value: "",
    text: "",
    field: "", // parent
  },
  Button: {
    isPage: false,
    canSelfClose: true,
    canHaveChildren: false,
    possibleChildren: null,
    possibleParents: ["Field", "Form", "Assistant"],
    add: (form, id, label, func) => {
      return `const ${label || id} = ${form}.addButton({
                id: 'custpage_${id}',
                ${label ? `label: ${label}` : `label: ${id}`},
                ${func ? `func: ${func}` : ""},
            });`;
    },
    disabled: (button, path) => {
      return `${button}.clientScriptModulePath = '${path}';
      `;
    },
    hidden: (button, id) => {
      return `${button}.clientScriptFileId = custpage_${id};
      `;
    },
    submit: (form, label) => {
      return `const submitBtn = ${form}.addSubmitButton({
        ${label ? `label: ${label}` : ""},
      })
      `;
    },
    reset: (form, label) => {
      return `const ${label || "resetBtn"} = ${form}.addResetButton({
        label: ${label || "Reset Button"}
      })
      `;
    },
    refresh: (sublist) => {
      return `const refreshBtn = ${sublist}.addRefreshButton();
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
