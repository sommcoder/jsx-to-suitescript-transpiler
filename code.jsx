const t = "text";

<Form title="Item History">
  <Sublist label="Item History Sublist" type="list">
    <Field label="Item" type={t} column="item" />
    <Field label="SO" type={t} column="tranid" />
    <Field label="Price" type={t} column="rate" />
    <Field label="Date Created" type={t} column="datecreated" />
    <Field label="Customer" type={t} column="entity" />
  </Sublist>
</Form>;
