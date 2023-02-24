export { Form, Field, Sublist, Button, Select };
// each component object contains the functions and property API calls associated with the component

// we need an object that "remembers" insertion order to map the ui with our components is the correct order
// first
const page = new Map();

interface SS {
  isPage: boolean;
  add: object;
  props: object;
}

function createSSComponent(el: object, ss: object) {
  // component identified: use add() method
  //
  //
}

const Form = {
  isPage: true,
  add: (ui: string, title: string) => {
    return `const ${title} = ${ui}.createForm({
      title: ${title},
    });`;
  },
  props: [
    {
      module: (form: string, path: string) => {
        return `${form}.clientScriptModulePath = '${path}';
      `;
      },
    },
    {
      fileId: (form: string, id: number) => {
        return `${form}.clientScriptFileId = ${id};
      `;
      },
    },
    {
      navBar: (form: string) => {
        return `${form}.clientScriptFileId = ${id};
      `;
      },
    },
  ],
};

const Sublist = {
  isPage: false,
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
  props: [
    {
      markAll: (sublist: string) => {
        return `${sublist}.addMarkAllButtons();
      `;
      },
    },
  ],
};

const Field = {
  isPage: false,
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
  // props are LOOKED up as they appear in the JSX component
  props: {
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
};

// Select is a component WITHIN a dropdown Field.
// field is populated ONLY IF Selected has an immediate parent of Field
// Select returns void in SuiteScript
const Select = {
  isPage: false,
  add: (value: string, text: string, isSelected: boolean, field: string) => {
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
  add: (form: string, id: string, label: string, func?: string) => {
    return `const ${label || id} = ${form}.addButton({
                id: 'custpage_${id}',
                ${label ? `label: ${label}` : `label: ${id}`},
                ${func ? `func: ${func}` : ""},
            });`;
  },
  props: [
    {
      disabled: (button: string, path: string) => {
        return `${button}.clientScriptModulePath = '${path}';
      `;
      },
    },
    {
      hidden: (button: string, id: string) => {
        return `${button}.clientScriptFileId = custpage_${id};
      `;
      },
    },
    {
      // can be this
      submit: (form: string, label: string) => {
        return `const submitBtn = ${form}.addSubmitButton({
        ${label ? `label: ${label}` : ""},
      })
      `;
      },
    },

    {
      reset: (form: string, label?: string) => {
        return `const ${label || "resetBtn"} = ${form}.addResetButton({
        label: ${label || "Reset Button"}
      })
      `;
      },
    },
    {
      refresh: (sublist: string) => {
        return `const refreshBtn = ${sublist}.addRefreshButton();
      `;
      },
    },
  ],
};

// creates the Page, whether thats a Form, List or Assistant
const Write = (res: string, form: string) => {
  return `
    ${res}.writePage({
        pageObject: ${form}
    })  
`;
};
