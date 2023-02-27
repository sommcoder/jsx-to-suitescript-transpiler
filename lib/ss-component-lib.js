import * as util from "./util.js";
export const SS = {
    Form: {
        isPage: true,
        canSelfClose: false,
        canHaveChildren: true,
        possibleChildren: ["sublist", "field", "button", "tab", "fieldGroup"],
        add: (ui, title) => {
            return `const ${util.createComponentId(title)} = ${ui}.createForm({
      title: ${title},
    });`;
        },
        module: (formName, path) => {
            return `${formName}.clientScriptModulePath = '${path}';
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
        isPage: false,
        canSelfClose: false,
        canHaveChildren: true,
        possibleChildren: ["field", "button"],
        possibleParent: ["form", "assistant"],
        add: (formName, label, id, tab) => {
            `const ${label.split(" ").join("")} = ${formName}.addFieldGroup({
        id: ${id},
        label: ${label},
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
        possibleChildren: ["field", "button"],
        add: (form, id, tab, type, label) => {
            return `const ${label || id} = ${form}.addSublist({
      id: 'custpage_${id}',
      ${label ? `label: ${label}` : `label: ${id}`},
      tab: ${tab}
      type: '${type}',
    })`;
        },
        markAll: (sublist) => {
            return `${sublist}.addMarkAllButtons();
      `;
        },
    },
    Field: {
        isPage: false,
        canSelfClose: true,
        canHaveChildren: true,
        possibleChildren: ["select"],
        add: (form, id, type, source, container, label) => {
            return `const ${label || id} = ${form}.addField({
      id: 'custpage_${id}',
      ${label ? `label: ${label}` : `label: ${id}`},
      type: '${type}',
      source: '${source}',
      container: '${container}'
    })`;
        },
        mandatory: (field, mandatory) => {
            if (mandatory)
                return `${field}.isMandatory = ${mandatory};
        `;
            else
                return "";
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
            else
                "";
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
        padding: () => { },
        layout: () => { },
        display: () => { },
        select: () => { },
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
    // THIS IS A MADE-UP component, it is not a SuiteScript component
    // BUT in JSSX it is represented as it's own field to allow for better readability.
    // field is populated ONLY IF Selected has an immediate parent of Field
    // Select returns void in SuiteScript
    Select: {
        isPage: false,
        canSelfClose: true,
        canHaveChildren: false,
        children: null,
        add: (value, text, isSelected, field) => {
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
