const t = "text";

<Form title="Item History">
  <Sublist label="Item History Sublist" type="list">
    <Field label="Item" type={t} />
    <Field label="SO" type={t} />
    <Field label="Price" type={t} />
    <Field label="Date Created" type={t} />
    <Field label="Customer" type={t} />
  </Sublist>
</Form>;

// Transpiles Into:

const itemHistoryForm = serverWidget.createForm({
  title: "Item History",
});
const itemHistorySublist = itemHistoryForm.addSublist({
  id: "custpage_item_history_sublist",
  label: "Item History Sublist",
  type: "list",
});
const itemField = itemHistorySublist.addField({
  id: "custpage_item_field",
  label: "Item",
  type: "text",
});
const soField = itemHistorySublist.addField({
  id: "custpage_so_field",
  label: "SO",
  type: "text",
});
const priceField = itemHistorySublist.addField({
  id: "custpage_price_field",
  label: "Price",
  type: "text",
});
const dateCreatedField = itemHistorySublist.addField({
  id: "custpage_date_created_field",
  label: "Date Created",
  type: "text",
});
const customerField = itemHistorySublist.addField({
  id: "custpage_customer_field",
  label: "Customer",
  type: "text",
});
context.response.writePage({
  pageObject: "itemHistoryForm",
});
