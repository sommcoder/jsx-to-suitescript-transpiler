// const select = [
//   { text: "Brian Davies", value: 123 },
//   { text: "Jeff Jefferson", value: 432 },
//   { text: "Smith Smithson", value: 567 },
//   { text: "James Jameson", value: 987 },
//   { text: "Sarah Saronson", value: 934 },
// ];

// {
//   select.map(({ text, value }) => (
//     <Select text={text} value={value} selected />
//   ));
// }

const s = { h: 40, w: 30 };
const p = 15;

<Form title="Customer Form" fileId="654321">
  <Tab label="Customer Information">
    <Field
      secret
      label="Items Purchased"
      type="text"
      size={s}
      padding={p}
      restScriptIds="Brian"
    />
    <Sublist markAll label="item history">
      <Field label="SO" type="text" size={s} padding={p} />
      <Field label="Total Spend" type="text" size={s} padding={p} />
      <Field label="Date Added" type="text" size={s} padding={p} />
      <Field label="Customer" type="text" size={s} padding={p}>
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

/////////////////////////////////////////

const customerForm = serverWidget.createForm({
   title: 'Customer Form',
});
customerForm.addTab({
   id: 'custpage_customer_information_tab',
    label: 'Customer Information',
});
const itemsPurchasedField = customerForm.addSecretKeyField({
   id: 'custpage_items_purchased_field',
    label: 'Items Purchased',
    
   
   container: 'custpage_customer_information_tab',
});
const itemHistorySublist = customerForm.addSublist({
    id: 'custpage_item_history_sublist',
    label: 'item history',
    tab: 'custpage_customer_information_tab'
});
itemHistorySublist.addMarkAllButtons();
const soField = itemHistorySublist.addField({
    id: 'custpage_so_field',
   label: 'SO',
    type: 'text',
});
soField.updateDisplaySize({
   height: 40,
    width: 30,
  });
soField.padding = undefined
const totalSpendField = itemHistorySublist.addField({
    id: 'custpage_total_spend_field',
   label: 'Total Spend',
    type: 'text',
});
totalSpendField.updateDisplaySize({
   height: 40,
    width: 30,
  });
totalSpendField.padding = undefined
const dateAddedField = itemHistorySublist.addField({
    id: 'custpage_date_added_field',
   label: 'Date Added',
    type: 'text',
});
dateAddedField.updateDisplaySize({
   height: 40,
    width: 30,
  });
dateAddedField.padding = undefined
const customerField = itemHistorySublist.addField({
    id: 'custpage_customer_field',
   label: 'Customer',
    type: 'text',
});
customerField.updateDisplaySize({
   height: 40,
    width: 30,
  });
customerField.padding = undefined
customerField.addSelectOption({
    value : '123',
   text : 'Brian Davies',
});
customerField.addSelectOption({
    value : '432',
   text : 'Jeff Jefferson',
});
customerField.addSelectOption({
    value : '567',
   text : 'Smith Smithson',
});
customerField.addSelectOption({
    value : '987',
   text : 'James Jameson',
});
customerField.addSelectOption({
    value : '934',
   text : 'Sarah Saronson',
});
const clearButton = customerForm.addButton({
   id: 'custpage_clear_button',
   label: 'Clear Button',
});
context.response.writePage({
    pageObject: 'customerForm'
});