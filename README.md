# "JSSX" - JSX to SuiteScript Transpiler & Dev Tool using Babel

"JSSX" brings Component-based UI development to Netsuite.

JSSX transpiles Suitelet UI calls into hierarchical, modern, component-based UI architecture as seen in popular JavaScript frameworks like React.

A Suitelet UI could be expressed in condensed, hierarchical syntax like this with JSSX:

```javascript
<Form title="Customer Form" fileId="654321">
  <Sublist markAll label="item history">
    <Field label="Entity" type="text" />
    <Field label="Subsidiary" type="text" />
    <Field label="Name" type="text" />
    <Field label="Currency" type="number" />
  </Sublist>
  <Button label="Clear Button" />
</Form>
```

If you already know JSX, much of this dev tool is intuitive. Most of the SuiteScript properties should be written the same as you're used to. Skip ahead to the table at the bottom of this README for which components and properties are compatible in this package.

Create your Suitelet UI in a .jsx file in your project directory and run to transpile into SuiteScript!

# run:

```javascript
jssx <fileName>.jsx
```

# so, what is JSX?

[Official JSX docs](https://facebook.github.io/jsx/)

But it's even simpler with "JSSX". The Babel compiler will be able to parse JSX Elements all on their own. No need to have the JSX be the return of a greater UI function component like in React development.

Once your jssx is compiled and appended to your .jsx file, simply copy and paste this SuiteScript into your project and voila!

# Nesting Infers Component Relationships

Page components and parent components wrap child components within them like regular HTML/XML element nesting. This nesting is what infers the component's relationship. Each component will be given properties or "props", which syntactically look like HTML/XML attributes.

The props and their values are essentially the options object that you pass to most SuiteScript api calls. However, in "JSSX" some of the property/key names have been condensed for better readability.

Once transpiled, auto-generated variables are used to connect child components to their parents components. Since this is JavaScript, the variables are in camelCase.

It works just like SuiteScript, create a Form object from the ui.createForm() call and from that returned object you can call Form.addField() for example.

The SuiteScript for this looks like:

```javascript
const distributionForm = ui.createForm({
  title: "Distribution Form",
});
distributionForm.addField({
  id: "custpage_rate_field",
  label: "Rate Field",
});
```

but in "JSSX" would represented as this:

```javascript
<Form title="Distribution Form">
  <Field label="Rate Field" />
</Form>
```

In order to properly transpile, ensure that the required props are provided for each component and that component names are in PascalCase as is the JSX standard.

NOTE: id's are not necessary to include as properties as they are automatically generated using this library based on your label. The component type (ie. Form, Field, Sublist) is appended as a suffix to the id as well as the variable generated by this library.

You can of course include your own component id's so that you can adopt this dev tool to an existing Suitelet project!

# Reduces Verbosity

No need to sift through dozens of lines of code to find the variable names of your UI components from which to reference. Everything is expressed within 20-50 lines of code for most common UI setups.

For Example:

THESE 50+ lines of code:

```javascript
const CustomerForm = serverWidget.createForm({
  title: "Customer Form",
  hideNavBar: true,
});
CustomerForm.addTab({
  id: "custpage_history_tab",
  label: "History",
});
CustomerForm.addFieldGroup({
  id: "fieldgroupid",
  label: "Field Group",
  tab: "custpage_history_tab",
});
CustomerForm.addField({
  id: "custpage_sublist_field_id_item",
  label: "Item",
  type: "text",
  container: "fieldgroupid",
});
CustomerForm.addTab({
  id: "custpage_history_tab",
  label: "History",
});
const suiteletSublist = CustomerForm.addSublist({
  id: "custpage_item_history_sublist",
  label: "item history",
  type: "list",
  tab: "custpage_history_tab",
});
suiteletSublist.addField({
  id: "custpage_sublist_field_id_item",
  label: "Item",
  type: "text",
});
suiteletSublist.addField({
  id: "custpage_sublist_field_id_tranid",
  label: "SO",
  type: "text",
});
suiteletSublist.addField({
  id: "custpage_sublist_field_id_rate",
  label: "Price",
  type: "text",
});
suiteletSublist.addField({
  id: "custpage_sublist_field_id_date",
  label: "Date Created",
  type: "text",
});
suiteletSublist.addField({
  id: "custpage_sublist_field_id_entity",
  label: "Customer",
  type: "text",
});
```

Can be expressed and managed in a more readable way:

```javascript
<Form title="Customer Form">
  <Tab label="Customer Number">
    <FieldGroup label="Customer Number">
      <Field label="Customer Number" type="integer" />
    </FieldGroup>
  </Tab>
  <Tab label="Customer Information">
    <Sublist label="item history">
      <Field label="Items Purchased" type="text" />
      <Field label="SO" type="text" />
      <Field label="Total Spend" type="text" />
      <Field label="Date Added" type="text" />
      <Field label="Customer" type="text" />
    </Sublist>
  </Tab>
</Form>
```

As you can see, you do not need to specify a Tab id if you want a FieldGroup to have a Tab as it's parent. This relationship is inferred by wrapping the FieldGroup in the Tab component or a Field within a Sublist. An id for Tab is automatically created and given to the SuiteScript call that is generated when babel visits the FieldGroup component.

The same applies to a Field in a FieldGroup. If Field's parent is FieldGroup, the Field API call will have the FieldGroups id as the value for the options.container key.

To elaborate, this:

```javascript
<FieldGroup label="Customer Number">
  <Field label="Items Purchased" type="text" />
</FieldGroup>
```

...infers the relationship and transpiles to this:

```javascript
Form.addFieldGroup({
    id: "custpage_customer_number_fieldgroup"
});
Form.addField({
    id: "custpage_items_purchased_field",
    label: "Items Purchased".
    type: "text",
    container: "custpage_customer_number_fieldgroup"
});
```

# No need to write component Id's Explicitly

In fact there's no need to specify id's with JSSX in general.

The custpage\_ prefix is automatically added to each component based on their label or title (if Page).

The component type is added to the end of the component id if it isn't already specified.

so

```JavaScript
<Sublist label="Item History" />
```

will contain this in the Sublist's options object:

```JavaScript
id: custpage_item_history_sublist
```

One less thing to worry about!

# JSSX Can also act as a preprocessor for SuiteScript API logic

JSSX will throw an error if you make a mistake preventing the need for you to have to deploy your Suitelet code in order to test it!

You'll get instance feedback once you enter the run command in your terminal.

# How to?

1. Always start with a page Component (Form, List, Assistant) just like with regular suitelet ui development
2. Components are wrapped in angle brackets just like HTML/XML.
3. Use PascalCase for components just like JSX
4. Select is a made-up component in JSSX. It is syntactic sugar for adding select options to a Field component and so Select is expressed as the child of Field
5. If you would have a component reference another component in its options Object, you simply express this by wrapping that component with it's parent
6. If you want to add a field to a Sublist, wrap the field in a sublist as its parent. If you want to add a field to the form the Field can be wrapped by a Tab or FieldGroup because in this instance the Field is added to the Page regardless.
7. Every component MUST have properties (or "props") and they can never be duplicates or JSSX will throw an error

# Select Component

In order to uphold our goal as a dev tool to allow for SuiteScript UI's to be more readable, we opted to create a new component which is essentially syntactic sugar for a Field.addSelectOptions(). By having a Select component in JSSX, we believe this provides better readability to the developer.

THIS:

```JavaScript
    <Field>
        <Select value="true" text="true" isSelected/>
        <Select value="false" text="false"/>
    </Field>
```

Would be transpiled to this:

```JavaScript
      Field.addSelectOptions({
          value: "true",
          text: "true",
          isSelected: true
      });
      Field.addSelectOptions({
          value: "false",
          text: "false",
      });
```

# Bindings are Valid Too!

```javascript
const t = "text";

<Form title="Customer" fileId="654321">
  <Tab label="Customer Information">
    <Sublist markAll label="item history">
      <Field label="Items Purchased" type={t} />
      <Field label="SO" type={t} />
      <Field label="Total Spend" type={t} />
      <Field label="Date Added" type={t} />
      <Field label="Customer" type={t} />
    </Sublist>
  </Tab>
  <Button label="Clear Button" />
</Form>;
```

As you can see above, variables/bindings can be created to reduce repetition and enforce DRY ("Do Not Repeat Yourself") principles of programming.

# Components & Props

To reduce verbosity some of the API calls have been shortened to allow for better readability as JSX and id and container properties have been made redundant:

reminder:

- id's are autogenerated
- containers are inferred through nesting, ie. The parent is the Object that the child is called on
- functions are called on their parents.
  example: If you nest a Field in a Sublist, the call generated will be: Sublist.addField() but if you nest a Field in a Form, the call generated will be: Form.addField()
- This should become intuitive as you use this and will come natural to those who've already built applications using JSX with React.
- How to express types/values of props in JSX:

  | type      | syntax ex.                       |
  | --------- | -------------------------------- |
  | string:   | label=""                         |
  | number:   | label={123}                      |
  | object:   | label={{prop1: 123, prop2: 123}} |
  | variable: | label={var}                      |
  | array:    | label={[]}                       |

Here is a table of **supported** SuiteScript components and their respective props.

| Comp.      | API Call (transpiles to)     | Prop: type                     | JSSX translation ex.                    |     |
| ---------- | ---------------------------- | ------------------------------ | --------------------------------------- | --- |
| Form       | serverWidget.createForm      | title: string                  | `<Form title="" />`                     | \*  |
|            |                              | navBar: string                 | `<Form navBar />`                       |     |
|            | Form.addPageInitMessage      | init: message                  | `<Form init={message} />`               |     |
|            |                              |                                |                                         |     |
| Tab        | Form.addTab                  | label: string                  | `<Tab label="" />`                      | \*  |
|            | Tab.helpText                 | helpText: string               | `<Tab help="" />`                       |     |
|            |                              |                                |                                         |     |
| FieldGroup | Form.addFieldGroup           | label: string                  | `<FieldGroup label="" />`               | \*  |
|            |                              |                                |                                         |     |
| Sublist    | Form.AddSublist              | label: string                  | `<Sublist label="" />`                  | \*  |
|            |                              | type: string                   | `<Sublist type="" />`                   | \*  |
|            | Sublist.addMarkAllButtons    | markAll: keyword               | `<Sublist markAll />`                   |     |
|            |                              |                                |                                         |     |
| Field      | Form && Sublist.addField     | label: string                  | `<Field label="" />`                    | \*  |
|            |                              | type: string                   | `<Field type="" />`                     | \*  |
|            |                              | source: string                 | `<Field source="" />`                   |     |
|            |                              |                                |                                         |     |
|            | Form.addSecretKeyField       | label: string                  | `<Field secret label="" />`             | \*  |
|            |                              | restrictToScriptIds: string[]  | `<Field secret restScriptIds={[""]} />` | \*  |
|            |                              | restrictToCurrentUser: keyword | `<Field secret restrict />`             |     |
|            |                              |                                |                                         |     |
|            | Field.defaultValue           | def: string                    | `<Field def="" />`                      |     |
|            | Field.isMandatory            | mandatory: keyword             | `<Field mandatory />`                   |     |
|            | Field.maxLength              | maxLength: number              | `<Field max={123} />`                   |     |
|            | Field.helpText               | helpText: string               | `<Field help:"" />`                     |     |
|            | Field.updateBreakType        | breakType: string              | `<Field breakType="" />`                |     |
|            | Field.updateDisplaySize      | size: object                   | `<Field size={{h: 1, w: 2}} />`         |     |
|            | Sublist.updateTotallyFieldId | totalling: keyword             | `<Field totalling />`                   |     |
|            | Sublist.updateUniqueFieldId  | unique: keyword                | `<Field unique />`                      |     |
|            |                              |                                |                                         |     |
| Button     | Sublist && Form.addButton    | label: string                  | `<Button label="" />`                   | \*  |
|            |                              | functionName: object           | `<Button fn={functionId} />`            |     |
|            | Form.addResetButton          | reset: keyword                 | `<Button reset />`                      |     |
|            | Form.addSubmitButton         | submit: keyword                | `<Button submit />`                     |     |
|            | Sublist.addRefreshButton     | refresh: keyword               | `<Button refresh />`                    |     |
|            |                              |                                |                                         |     |
| Select     | Field.addSelectOptions       | text: string                   | `<Select text="" value=""/> `           | \*  |
|            |                              | value: str or num              | `<Select value=""/> `                   | \*  |
|            |                              |                                |                                         |     |
| Search     | search.create()              | type: string                   | `<Select text="" value=""/> `           | \*  |
|            |                              | title: string                  | `<Select value=""/> `                   |     |
|            |                              | settings: object               | `<Select settings={settings}/> `        |     |
|            |                              | filters: object                | `<Select filters={filters}/> `          |     |
|            |                              |                                |                                         |     |
|            |                              |                                |                                         |     |
|            |                              |                                |                                         |     |

\* required props in your JSSX component!

**JSSX has currently only been created and tested on Suitelet Forms.**

# Run using the following command in your terminal:

```
npm run jssx <fileName>.jsx

```

1. Download the package
2. Create a .jsx file in your current directory.
3. Create your JSSX page UI in the .jsx file and ///// below it to separate the JSX from the Javascript that will be written to the file
4. Ensure you are in the correct directory
5. Run the above npm command
6. Node.js will return the output code as a string below your JSSX in your .jsx file
7. To edit, change your JSSX as needed, delete the SuiteScript below, and run the command again!

# SAVED SEARCH USE CASE:

Creating a UI for a Suitelet is nice and all but ONLY creating a static UI isn't useful in many situations. Often, we want fields to be populated dynamically using something like a Saved Search in NetSuite.

Enter the the <Search> component. Search can allow us to populate our Fields and declare them simultaneously if we wrap <Field>'s in a <Search> component. Only wrap the components you need to populate, and provide the column prop on the Field that you'd like to populate the search with.

```javascript
const filters = [["item", "anyof", "name"], "AND", ["mainline", "is", "F"]];
const settings = [
  {
    name: "consolidationtype",
    value: "AVERAGE",
  },
];

<Form title="Customer Form" fileId="654321">
  <Sublist markAll label="item history">
    <Search type="salesorder" settings={settings} filters={filters}>
      <Field label="Entity" type="text" column="name" />
      <Field label="Subsidiary" type="text" column="subsidiary" />
      <Field label="Name" type="text" column="name" />
      <Field label="Currency" type="number" column="currency" />
    </Search>
  </Sublist>
  <Button label="Clear Button" />
</Form>;
```

NOTE: the columns are imperatively coded here as a prop.

The following will be generated from the above code! (No, the strings provided don't make sense, it's just an example)

```javascript
const customerForm = serverWidget.createForm({
  title: "Customer Form",
});
customerForm.clientScriptFileId = "654321";
const itemHistorySublist = customerForm.addSublist({
  id: "custpage_item_history_sublist",
  label: "item history",
});
itemHistorySublist.addMarkAllButtons();
const entityField = itemHistorySublist.addField({
  id: "custpage_entity_field",
  label: "Entity",
  type: "text",
});
const subsidiaryField = itemHistorySublist.addField({
  id: "custpage_subsidiary_field",
  label: "Subsidiary",
  type: "text",
});
const nameField = itemHistorySublist.addField({
  id: "custpage_name_field",
  label: "Name",
  type: "text",
});
const currencyField = itemHistorySublist.addField({
  id: "custpage_currency_field",
  label: "Currency",
  type: "number",
});
const clearButton = customerForm.addButton({
  id: "custpage_clear_button",
  label: "Clear Button",
});

let i = 0;

search
  .create({
    type: "salesorder",
    filters: [["item", "anyof", "name"], "AND", ["mainline", "is", "F"]],
    columns: ["name", "subsidiary", "name", "currency"],
  })
  .run()
  .each((result) => {
    itemHistorySublist.setSublistValue({
      id: "custpage_entity_field",
      line: i,
      value: result.getText({
        name: "name",
      }),
    });
    itemHistorySublist.setSublistValue({
      id: "custpage_subsidiary_field",
      line: i,
      value: result.getText({
        name: "subsidiary",
      }),
    });
    itemHistorySublist.setSublistValue({
      id: "custpage_name_field",
      line: i,
      value: result.getText({
        name: "name",
      }),
    });
    itemHistorySublist.setSublistValue({
      id: "custpage_currency_field",
      line: i,
      value: result.getValue({
        name: "currency",
      }),
    });

    i++;

    return true;
  });
context.response.writePage({
  pageObject: "customerForm",
});
```

**Eventually we want to make JSSX compatible with Array.map() inside of a JSX Expression container in order to enhance our ability to express logic and also generate components based on a List like in React.**

Here is an example of what this would look like:

```javascript
<Form title="Customer Form" fileId="654321">
  <Tab label="Customer Information">
    <Sublist markAll label="item history">
      {search(fieldArr, settings, filters).map(({ l, t, c }) => (
        // logic would be added here to handle components
        // each element of the array created a new Field component
        // this would act like the N/search module's ResultSet.run().each() callback function
        <Field label={l} type={t} column={c} />
      ))}
    </Sublist>
  </Tab>
  <Button label="Clear Button" />
</Form>
```

# Version 2.0 to include List and Assistant compatibility
