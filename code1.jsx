<Form title="Quantity Distribution">
  <Sublist label="Item Sublist" type="list">
    <Field label="Name" type="text" />
    <Field label="Line Key" type="text" />
    <Field label="Ratio Number" type="text" />
    <Field label="Current Qty" type="text" />
    <Field label="New Qty" type="text" />
    <Button label="Reset Button" />
  </Sublist>
  <Button label="Submit Button" />
</Form>;

// Transpiles Into:

const quantityDistributionForm = serverWidget.createForm({
  title: "Quantity Distribution",
});
const itemSublist = quantityDistributionForm.addSublist({
  id: "custpage_item_sublist",
  label: "Item Sublist",
  type: "list",
});
const nameField = itemSublist.addField({
  id: "custpage_name_field",
  label: "Name",
  type: "text",
});
const lineKeyField = itemSublist.addField({
  id: "custpage_line_key_field",
  label: "Line Key",
  type: "text",
});
const ratioNumberField = itemSublist.addField({
  id: "custpage_ratio_number_field",
  label: "Ratio Number",
  type: "text",
});
const currentQtyField = itemSublist.addField({
  id: "custpage_current_qty_field",
  label: "Current Qty",
  type: "text",
});
const newQtyField = itemSublist.addField({
  id: "custpage_new_qty_field",
  label: "New Qty",
  type: "text",
});
const resetButton = itemSublist.addButton({
  id: "custpage_reset_button",
  label: "Reset Button",
});
const submitButton = quantityDistributionForm.addButton({
  id: "custpage_submit_button",
  label: "Submit Button",
});
context.response.writePage({
  pageObject: "quantityDistributionForm",
});
