import * as util from "./util.js";

interface SS {
  Form: {};
  FieldGroup: {};
  Sublist: {};
  Field: {};
  Select: {};
  Button: {};
  Write: () => {};
}

export const SS: SS = {
  Form: {
    isPage: true,
    canSelfClose: false,
    canHaveChildren: true,
    possibleChildren: ["sublist", "field", "button", "tab", "fieldGroup"],
    add: (ui: string, title: string) => {
      return `const ${util.createComponentId(title)} = ${ui}.createForm({
      title: ${title},
    });`;
    },
    module: (formName: string, path: string) => {
      return `${formName}.clientScriptModulePath = '${path}';
      `;
    },
    fileId: (formName: string, id: number) => {
      return `${formName}.clientScriptFileId = ${id};
      `;
    },
    navBar: (formName: string, id: number) => {
      return `${formName}.clientScriptFileId = ${id};
      `;
    },
  },
  // PascalCase
  FieldGroup: {
    isPage: false,
    canSelfClose: false,
    canHaveChildren: true,
    possibleChildren: ["field", "button"],
    possibleParent: ["form", "assistant"],
    add: (formName: string, label: string, id: string, tab?: string) => {
      `const ${label.split(" ").join("")} = ${formName}.addFieldGroup({
        id: ${id},
        label: ${label},
     })
    `;
    },
    single: (name: string) => {
      return `${name}.isSingleColumn;`;
    },
    collapsible: (name: string) => {
      return `${name}.isCollapsible = true;`;
    },
    collapsed: (name: string) => {
      return `${name}.isCollapsed;`;
    },
    borderHidden: (name: string) => {
      return `${name}.isBorderHidden = true;`;
    },
  },

  Sublist: {
    isPage: false,
    canSelfClose: false,
    canHaveChildren: true,
    possibleChildren: ["field", "button"],
    add: (
      form: string,
      id: string,
      tab: string,
      type: string,
      label?: string
    ) => {
      return `const ${label || id} = ${form}.addSublist({
      id: 'custpage_${id}',
      ${label ? `label: ${label}` : `label: ${id}`},
      tab: ${tab}
      type: '${type}',
    })`;
    },
    markAll: (sublist: string) => {
      return `${sublist}.addMarkAllButtons();
      `;
    },
  },

  Field: {
    isPage: false,
    canSelfClose: true,
    canHaveChildren: true,
    possibleChildren: ["select"],
    add: (
      form: string,
      id: string,
      type: string,
      source: string,
      container: string,
      label?: string
    ) => {
      return `const ${label || id} = ${form}.addField({
      id: 'custpage_${id}',
      ${label ? `label: ${label}` : `label: ${id}`},
      type: '${type}',
      source: '${source}',
      container: '${container}'
    })`;
    },
    mandatory: (field: string, mandatory: boolean) => {
      if (mandatory)
        return `${field}.isMandatory = ${mandatory};
        `;
      else return "";
    },
    credential: (
      id: string,
      form: string,
      domain: string | [string],
      scriptIds: string | [string],
      restUser?: boolean,
      container?: string,
      label?: string
    ) => {
      return `const ${label || id} = ${form}.addCredentialField({
            id: 'custpage_${id}',
            restrictToDomains: ${domain},
            ${scriptIds ? `restrictToScriptIds : ${scriptIds}` : ""},
            ${restUser ? `restrictToCurrentUser : ${restUser}` : ""},
            ${container ? `container: ${container}` : ""}
     })`;
    },
    def: (field: string, def: string) => {
      if (def)
        return `${field}.defaultValue = ${def};
        `;
      else "";
    },
    help: (field: string, help: string) => {
      return `${field}.setHelpText({
        help: '${help}'
      })
      `;
    },
    max: (field: string, max: number) => {
      return `${field}.maxLength = ${max};
      `;
    },
    padding: () => {},
    layout: () => {},
    display: () => {},
    select: () => {},
    secret: (
      form: string,
      id: string,
      scriptIds: string | [string],
      restUser: boolean,
      label?: string
    ) => {
      return `const ${label || id} = ${form}.addSecretKeyField({
                  id: 'custpage_${id}',
                  ${label ? `label: ${label}` : `label: ${id}`},
                  restrictToScriptIds: ${scriptIds},
                  restrictToCurrentUser: ${restUser || false},
                })
      `;
    },
    // the id of the field:
    totalling: (sublist: string, id: string) => {
      return `${sublist}.updateTotallingField({
          id: 'custpage_${id}',
    })`;
    },
    unique: (sublist: string, id: string) => {
      return `${sublist}.updateUniqueFieldId({
      id: 'custpage_${id}',
    })`;
    },
  },

  // Select is a component WITHIN a dropdown Field.
  // THIS IS A MADE-UP component, it is not a SuiteScript component
  // BUT in JSSX it is represented as it's own field to allow for better readability.
  // field is populated ONLY IF Selected has an immediate parent of Field
  // Select returns void in SuiteScript
  Select: {
    isPage: false,
    canSelfClose: true,
    canHaveChildren: false,
    children: null,
    add: (value: string, text: string, isSelected: boolean, field: string) => {
      return `${field}.addSelectOption({
                  value : ${value},
                  text : ${text},
                  isSelected: ${isSelected},
            });
`;
    },
  },

  Button: {
    isPage: false,
    canSelfClose: true,
    canHaveChildren: false,
    children: null,
    add: (form: string, id: string, label: string, func?: string) => {
      return `const ${label || id} = ${form}.addButton({
                id: 'custpage_${id}',
                ${label ? `label: ${label}` : `label: ${id}`},
                ${func ? `func: ${func}` : ""},
            });`;
    },
    disabled: (button: string, path: string) => {
      return `${button}.clientScriptModulePath = '${path}';
      `;
    },
    hidden: (button: string, id: string) => {
      return `${button}.clientScriptFileId = custpage_${id};
      `;
    },
    submit: (form: string, label: string) => {
      return `const submitBtn = ${form}.addSubmitButton({
        ${label ? `label: ${label}` : ""},
      })
      `;
    },
    reset: (form: string, label?: string) => {
      return `const ${label || "resetBtn"} = ${form}.addResetButton({
        label: ${label || "Reset Button"}
      })
      `;
    },
    refresh: (sublist: string) => {
      return `const refreshBtn = ${sublist}.addRefreshButton();
      `;
    },
  },
  // creates the Page, whether thats a Form, List or Assistant
  Write: (res: string, form: string) => {
    return `
    ${res}.writePage({
        pageObject: ${form}
    })  
`;
  },
};
