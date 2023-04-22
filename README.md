# "JSSX" - a JavaScript to SuiteScript Babel Plugin & Dev Tool

The ui/serverWidget module requires very verbose syntax to build a UI. The API calls are verbose, requiring 100+ lines of code to build even a simple table with only a few fields

We're not reinventing the wheel, we're just leveraging a well known syntax to make SuiteScript UI's exponentially easier/faster to develop, maintain and read.

# Less Code, Quicker UI Development

JSSX dramatically cuts down on dev time and increases code readability expressed as simple JSX, which many developers are famililar with if they've ever used the React.

# Nesting Infers the Relationship

Page components wrap valid child components within them like regular HTML/XML element nesting. This nesting infers the component's relationship. Once transpiled, auto-generated variables are used to connect child components to their parents components.

this:

```javascript
const Form = ui.createForm({});
Form.addField({});
```

would be:

```javascript
<Form>
  <Field />
</Form>
```

this:

```javascript
const Sublist = Form.addSublit({});
Sublist.addButton({});
```

would be:

```javascript
<Sublist>
  <Button />
</Sublist>
```

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

CAN BE EXPRESSED LIKE THIS:

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

As you can see, you do not need to specify a FieldGroup to have a Tab as it's parent. This relationship is inferred by wrapping the FieldGroup in the Tab component.

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

# Small Changes, as Needed

- Edit your .jsx file
- run JSSX to transpile your changes
- Re-Deploy your script!

# Can also act as a preprocessor for SuiteScript API logic

JSSX will throw an error if you make a mistake!
Avoiding the need for you to have to deploy your Suitelet code in order to test it!
You'll get instance feedback once you enter the 'npm run jssx' command in your IDE.

# How to?

1. Always start with a page Component (Form, List, Assistant)
2. Use PascalCase for components just like JSX
3. Select is syntactic sugar for adding select options to a Field
4. If a component references another component in its options Object, it needs to be wrapped by that component.
5. If you want to add a field to a Sublist, wrap the field in a sublist as its parent. If you want to add a field to the form the Field can be wrapped by a Tab or FieldGroup because in this instance the Field is added to the Page regardless.
6. Every component MUST have properties (or "props") and they can never be duplicates or JSSX will throw an error.
7. Will read and transpile every .jsx file into a SuiteScipt compatible .js file that you can use to deploy on NetSuite.

```JavaScript
Form.addSublist({
    tab: "",
});
```

Would be expressed like this:

```JavaScript
<Tab>
  <Sublist>
  </Sublist>
</Tab>
```

# No need to write component Id's Imperatively

The custpage prefix is automatically added to each component based on their label or title (if Page).

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
