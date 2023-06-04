const filters = [
  ["item", "anyof", sublistItems],
  "AND",
  ["mainline", "is", "F"],
];
const settings = [
  {
    name: "consolidationtype",
    value: "AVERAGE",
  },
];

/*
 
1) wrap which components you want to apply a search to
2) add a filter and settings prop to Search if needed
 
*/
// PLOTTING JUST FIELDS:
<Form title="Customer Form" fileId="654321">
  <Tab label="Customer Information">
    <Sublist markAll label="item history">
      <Search settings={settings} filters={filters} type="sales">
        <Field label="Entity" type="text" column="name" />
        <Field label="Subsidiary" type="text" column="subsidiary" />
        <Field label="Name" type="text" column="location">
          <Select text="Sampson" value={2} />
          <Select text="Albert" value={1} />
          <Select text="Geoff" value={3} />
          <Select text="Lucky" value={5} />
        </Field>
        <Field label="Currency" type="number" column="currency" />
      </Search>
    </Sublist>
  </Tab>
  <Button label="Clear Button" />
</Form>;

// PLOTTING SELECT FIELDS:
{
  /* <Form title="Customer Form" fileId="654321">
  <Tab label="Customer Information">
    <Sublist markAll label="item history">
      <Field label="Entity" type="text" />
      <Field label="Subsidiary" type="text" />
      <Field label="Name" type="text">
        <Search settings={settings} filters={filters} type="sales">
          <Select column="name" />
          <Select column="subsidiary" />
          <Select column="number" />
          <Select column="location" />
        </Search>
      </Field>
      <Field label="Currency" type="number" column="currency" />
    </Sublist>
  </Tab>
  <Button label="Clear Button" />
</Form>; */
}
