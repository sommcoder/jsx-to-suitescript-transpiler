export { Form, Field, Sublist, Button, Select };
// each component object contains the functions and property API calls associated with the component
const pageArr = [];
function createSSComponent(el, ss) {
    // component identified: use add() method
    //
    //
}
function checkNextComponent() {
    // check the possibleChildren component of the current component
    // if this array does NOT include a match of the next component, throw Error
}
const Form = {
    isPage: true,
    canSelfClose: false,
    canHaveChildren: true,
    possibleChildren: ["sublist", "field", "button", "tab", "fieldGroup"],
    add: (ui, title) => {
        return `const ${title} = ${ui}.createForm({
      title: ${title},
    });`;
    },
    props: [
        {
            module: (form, path) => {
                return `${form}.clientScriptModulePath = '${path}';
      `;
            },
        },
        {
            fileId: (form, id) => {
                return `${form}.clientScriptFileId = ${id};
      `;
            },
        },
        {
            navBar: (form) => {
                return `${form}.clientScriptFileId = ${id};
      `;
            },
        },
    ],
};
const Sublist = {
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
    props: [
        {
            markAll: (sublist) => {
                return `${sublist}.addMarkAllButtons();
      `;
            },
        },
    ],
};
const Field = {
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
    // props are LOOKED up as they appear in the JSX component
    props: {
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
};
// Select is a component WITHIN a dropdown Field.
// field is populated ONLY IF Selected has an immediate parent of Field
// Select returns void in SuiteScript
const Select = {
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
};
const Button = {
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
    props: [
        {
            disabled: (button, path) => {
                return `${button}.clientScriptModulePath = '${path}';
      `;
            },
        },
        {
            hidden: (button, id) => {
                return `${button}.clientScriptFileId = custpage_${id};
      `;
            },
        },
        {
            // can be this
            submit: (form, label) => {
                return `const submitBtn = ${form}.addSubmitButton({
        ${label ? `label: ${label}` : ""},
      })
      `;
            },
        },
        {
            reset: (form, label) => {
                return `const ${label || "resetBtn"} = ${form}.addResetButton({
        label: ${label || "Reset Button"}
      })
      `;
            },
        },
        {
            refresh: (sublist) => {
                return `const refreshBtn = ${sublist}.addRefreshButton();
      `;
            },
        },
    ],
};
// creates the Page, whether thats a Form, List or Assistant
const Write = (res, form) => {
    return `
    ${res}.writePage({
        pageObject: ${form}
    })  
`;
};
