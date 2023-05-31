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

<Form title="Customer Form" fileId="654321">
  <Tab label="Customer Information">
    <Sublist markAll label="item history">
      <Search settings={settings} filters={filters}>
        <Field label="Entity" type="text" column="name" />
        <Field label="Subsidiary" type="text" column="subsidiary" />
        <Field label="Name" type="text" column="name">
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
