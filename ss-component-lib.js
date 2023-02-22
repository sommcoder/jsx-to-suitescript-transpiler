export { Form, Field, Sublist, Button, Select };

const Form = {
  add: (ui, title) => {
    return `const ${title} = ${ui}.createForm({
                title: ${title},
            });`;
  },
  props: [
    {
      module: (form, path) => {
        `${form}.clientScriptModulePath = '${path}';
      `;
      },
    },
    {
      fileId: (form, id) => {
        `${form}.clientScriptFileId = ${id};
      `;
      },
    },
    { navBar: () => {} },
  ],
};
const Sublist = {
  add: (form, id, tab, type, label) => {
    `const ${label || id} = ${form}.addSublist({
      id: 'custpage_${id}',
      ${label ? `label: ${label}` : `label: ${id}`},
      tab: ${tab}
      type: '${type}',
    })`;
  },
  props: [
    {
      markAll: (sublist) => {
        `${sublist}.addMarkAllButtons();
      `;
      },
    },
  ],
};
const Field = {
  add: (form, id, type, source, container, label) => {
    `const ${label || id} = ${form}.addField({
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
        `${field}.isMandatory = ${mandatory};
        `;
      else "";
    },
    credential: (id, form, domain, scriptIds, restUser, container, label) => {
      `const ${label || id} = ${form}.addCredentialField({
            id: 'custpage_${id}',
            restrictToDomains: ${domain},
            ${scriptIds ? `restrictToScriptIds : ${scriptIds}` : ""},
            ${restUser ? `restrictToCurrentUser : ${restUser}` : ""},
            ${container ? `container: ${container}` : ""}
     })`;
    },
    def: (field, def) => {
      if (def)
        `${field}.defaultValue = ${def};
        `;
      else "";
    },
    help: (field, help) => {
      `${field}.setHelpText({
        help: '${help}'
      })
      `;
    },
    max: (field, max) => {
      `${field}.maxLength = ${max};
      `;
    },
    padding: () => {},
    layout: () => {},
    display: () => {},
    select: () => {},
    secret: (form, id, scriptIds, restUser, label) => {
      `
        const ${label || id} = ${form}.addSecretKeyField({
        id: 'custpage_${id}',
        ${label ? `label: ${label}` : `label: ${id}`},
        restrictToScriptIds: ${scriptIds},
        restrictToCurrentUser: ${restUser || false},
      })
      `;
    },
    // the id of the field:
    totalling: (sublist, id) => {
      `${sublist}.updateTotallingField({
          id: 'custpage_${id}',
    })`;
    },
    unique: (sublist, id) => {
      `${sublist}.updateUniqueFieldId({
      id: 'custpage_${id}',
    })`;
    },
  },
};
// Select is a component WITHIN a dropdown Field.
// field is populated ONLY IF Selected has an immediate parent of Field
// Select returns void in SuiteScript
const Select = {
  add: (value, text, isSelected, field) => {
    `${field}.addSelectOption({
    value : ${value},
    text : ${text},
    isSelected: ${isSelected},
});
`;
  },
};
const Button = {
  add: (form, id, label, func) => {
    ` const ${label || id} = ${form}.addButton({
      id: 'custpage_${id}',
      ${label ? `label: ${label}` : `label: ${id}`},
      ${func ? `func: ${func}` : ""},
    });`;
  },
  props: [
    {
      disabled: (button, path) => {
        `${button}.clientScriptModulePath = '${path}';
      `;
      },
    },
    {
      hidden: (button, id) => {
        `${button}.clientScriptFileId = custpage_${id};
      `;
      },
    },
    {
      // can be this
      submit: (form, label) => {
        `const submitBtn = ${form}.addSubmitButton({
        ${label ? `label: ${label}` : ""},
      })
      `;
      },
    },
    {
      reset: (form, label) => {
        `const ${label || "resetBtn"} = ${form}.addResetButton({
        label: ${label || "Reset Button"}
      })
      `;
      },
    },
    {
      refresh: (sublist) => {
        `const refreshBtn = ${sublist}.addRefreshButton();
      `;
      },
    },
  ],
};
// creates the Page, whether thats a Form, List or Assistant
const Write = (res, form) => `
    ${res}.writePage({
    pageObject: ${form}
    })  
`;
