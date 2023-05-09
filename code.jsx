<Form title="Customer Form" fileId="654321">
  <Tab label="Customer Number">
    <FieldGroup label="Customer">
      <Field label="Customer Number" type="integer" def={123} />
    </FieldGroup>
  </Tab>
  <Tab label="Customer Information">
    <Sublist markAll label="item history">
      <Field secret label="Items Purchased" type="text" />
      <Field label="SO" type="text" />
      <Field label="Total Spend" type="text" />
      <Field label="Date Added" type="text" />
      <Field label="Customer" type="text">
        <Select text="Brian Davies" value={123} />
        <Select text="Jeff Jefferson" value={432} />
        <Select text="Smith Smithson" value={567} />
        <Select text="James Jameson" value={987} />
        <Select text="Sarah Saronson" value={934} />
      </Field>
    </Sublist>
  </Tab>
  <Button label="Clear Button" />
</Form>;

<Form label="Customer Form">
  <Sublist label="Customers" type="Editor">
    <Field label="" />
    <Field />
    <Field />
  </Sublist>
</Form>;

/////////////////////////////////////////

const customerForm = serverWidget.createForm({
  title: "Customer Form",
});
customerForm.addTab({
  id: "custpage_customer_number_tab",
  label: "Customer Number",
});
const customerFieldGroup = customerForm.addFieldGroup({
  id: "custpage_customer_fieldgroup",
  label: "Customer",
  tab: "custpage_customer_number_tab",
});
const customerNumberField = customerFieldGroup.addField({
  id: "custpage_customer_number_field",
  label: "Customer Number",
  type: "integer",
  container: "custpage_customer_fieldgroup",
});
customerNumberField.defaultValue = "123";
customerForm.addTab({
  id: "custpage_customer_information_tab",
  label: "Customer Information",
});
const itemHistorySublist = customerForm.addSublist({
  id: "custpage_item_history_sublist",
  label: "item history",
  tab: "custpage_customer_information_tab",
});
itemHistorySublist.addMarkAllButtons();

undefined;

const soField = itemHistorySublist.addField({
  id: "custpage_so_field",
  label: "SO",
  type: "text",
});

const totalSpendField = itemHistorySublist.addField({
  id: "custpage_total_spend_field",
  label: "Total Spend",
  type: "text",
});

const dateAddedField = itemHistorySublist.addField({
  id: "custpage_date_added_field",
  label: "Date Added",
  type: "text",
});

const customerField = itemHistorySublist.addField({
  id: "custpage_customer_field",
  label: "Customer",
  type: "text",
});

customerField.addSelectOption({
  value: "123",
  text: "Brian Davies",
});

customerField.addSelectOption({
  value: "432",
  text: "Jeff Jefferson",
});

customerField.addSelectOption({
  value: "567",
  text: "Smith Smithson",
});

customerField.addSelectOption({
  value: "987",
  text: "James Jameson",
});

customerField.addSelectOption({
  value: "934",
  text: "Sarah Saronson",
});

const clearButton = customerForm.addButton({
  id: "custpage_clear_button",
  label: "Clear Button",
});

context.response.writePage({
  pageObject: "customerForm",
});
