# "JSSX" - JSX to SuiteScript Transpiler & Dev Tool using Babel

In SuiteScript development the 'ui/serverWidget' module used to create Suitelet scripts requires very verbose syntax in order to build a UI. Each component has it's own function call on the parent object that calls it with an options object that requires certain values in the correct format or the code fails.

These functions are verbose, requiring 100+ lines of code to build even a simple sublist on a form with only a few fields.

Using the much more readible JSX syntax from the React library this library transpilers JSX into SuiteScript API calls while also providing a preprocessing layer to test UI development before deployment/testing on the NetSuite platform.

This isn't reinventing the wheel, it just leverages a well known syntax to make SuiteScript UI's exponentially easier/faster to develop, maintain and read.

# How does it all work?

# Nesting Infers The Component's Relationships

Page components wrap valid child components within them like regular HTML/XML element nesting. This nesting infers the component's relationship. Once transpiled, auto-generated variables are used to connect child components to their parents components.

this:

```javascript
const Form = ui.createForm({
  title: "Distribution Form",
});
Form.addField({
  id: "custpage_rate_field",
  label: "Rate Field",
});
```

would be:

```javascript
<Form title="Distribution Form">
  <Field label="Rate Field" />
</Form>
```

... and this:

```javascript
const Sublist = Form.addSublist({
  id: "custpage_numbers_sublist",
  label: "Number Sublist",
  type: "editor",
});
Sublist.addButton({
  id: "custpage_enter_button",
  label: "Enter Button",
});
```

would be this:

```javascript
<Sublist type="editor" label="Number Sublist">
  <Button label="Enter Button" />
</Sublist>
```

id's are not necessary to include as they are automatically generated using this library!

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

As you can see, you do not need to specify a Tab id if you want a FieldGroup to have a Tab as it's parent. This relationship is inferred by wrapping the FieldGroup in the Tab component or a Field within a Sublist.

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

# No need to write component Id's Imperatively

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

One less verbose element to worry about!

# Small Changes, as Needed

- Edit your .jsx file
- run JSSX to transpile your changes
- Re-Deploy your script to NetSuite!

# Can also act as a preprocessor for SuiteScript API logic

JSSX will throw an error if you make a mistake preventing the need for you to have to deploy your Suitelet code in order to test it!
You'll get instance feedback once you enter the run command in your terminal.

# How to?

1. Always start with a page Component (Form, List, Assistant) just like with regular suitelet ui development
2. Components are wrapped in angle brackets just like HTML/XML.
3. Use PascalCase for components just like JSX
4. Select is a madeup component in JSSX. It is syntactic sugar for adding select options to a Field component and so Select is expressed as the child of Field
5. If you would have a component reference another component in its options Object, you simply express this by wrapping that component with it's parent
6. If you want to add a field to a Sublist, wrap the field in a sublist as its parent. If you want to add a field to the form the Field can be wrapped by a Tab or FieldGroup because in this instance the Field is added to the Page regardless.
7. Every component MUST have properties (or "props") and they can never be duplicates or JSSX will throw an error

# <Select> Component

In order to uphold our goal as a dev tool to allow for SuiteScript UI's to be more readable, we opted to create a new component which is essentially syntactic sugar for a Field.addSelectOptions(). By having select be it's own component we believe this provides better readability.

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

# Bindings are valid!

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

as you can see above, variables/bindings can be created to reduce character repitition.

# Components & Props

To reduce verbosity some of the API calls have been shortened to allow for better readability as JSX and id and container properties have been made reduntant:

reminder:

- id's are autogenerated
- containers are inferred through nesting, ie. The parent is the Object that the child is called on
- functions are called on their parents.
  example: If you nest a Field in a Sublist, the call generated will be: Sublist.addField() but if you nest a Field in a Form, the call generated will be: Form.addField()
- How to express types/values of props in JSX:

  | type      | syntax ex.                       |
  | --------- | -------------------------------- |
  | string:   | label=""                         |
  | number:   | label={123}                      |
  | object:   | label={{prop1: 123, prop2: 123}} |
  | variable: | label={var}                      |
  | array:    | label={[]}                       |

Here is a table of available **supported** SuiteScript components and their respective props.

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
6. Node.js will return the output code as a string below your jssx in your .jsx file
7. To edit, change your jssx as needed, delete the SuiteScript below, and run the command again!

# Version 2.0 to include List and Assistant compatibility
