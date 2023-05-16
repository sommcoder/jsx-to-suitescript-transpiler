// search props/bindings:
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
const columns = ["entity", "subsidiary", "name", "currency"];

// if we do this technique, it's almost redundant to specify columns when the column that we need will be specified in the value prop of the respective component that we wish to populate that column value on

// because column EQUALS

// label and column name won't necessarily be same/similar. the column name is based on Records, whereas the label will be whatever is best for te user/client
const fieldArr = [
  {
    label: "Entity",
    type: "text",
    value: "",
  },
  {
    label: "Subsidiary",
    type: "text",
    value: "",
  },
  {
    label: "Name",
    type: "text",
    value: "",
  },
  {
    label: "Currency",
    type: "number",
    value: "currency",
  },
];
//////////////////////////////////////////////////////
/*
 
The search functionality here is basic because compared to a callback function, there are limitations on what we can and cannot express with just JSX syntax.

We do however have the ability to cut down on verbosity and produce simple search functionality in extremely simple syntax that is highly readable BUT we'll just never be able to express anything THAT complex within the Search component


1) we haven't even tested basic syntax with arr.map() for jsx
 
*/

//////////////

<Form title="Customer Form" fileId="654321">
  <Tab label="Customer Information">
    <Sublist markAll label="item history">
      <Search
        type="sales order"
        columns={columns}
        filters={filters}
        settings={settings}
      >
        {fieldArr.map(({ l, t, v }) => (
          <Field label={l} type={t} value={v} />
        ))}
      </Search>
    </Sublist>
  </Tab>
  <Button label="Clear Button" />
</Form>;

{
  /* <Form title="Customer Form" fileId="654321">
  <Tab label="Customer Information">
    <Sublist markAll label="item history">
      <Search
        type="sales order"
        columns={columns}
        filters={filters}
        settings={settings}
      >
        {fieldArr.map(({ l, t, v }) => (
          <Field label={l} type={t} value={v} />
        ))}
      </Search>
    </Sublist>
  </Tab>
  <Button label="Clear Button" />
</Form>; */
}

//  <Field label="Entity" type="text" value={{ name: "" }} />
//       <Field label="Subsidiary" type="text" value={{ name: "" }} />
//       <Field label="Name" type="text" value={{ name: "" }} />
//       <Field label="Currency" type="text" value={{ name: "" }} />

{
  /* <Form title="Customer Form" fileId="654321">
  <Tab label="Customer Information">
    <Field label="Items Purchased" type="text" />
    <Sublist markAll label="item history">
      <Field label="SO" type="text" />
      <Field label="Total Spend" type="text" />
      <Field label="Date Added" type="text" />
      <Field label="Customer" type="text">
        <Select text="Brian Davies" value={123} />
        <Select text="Jeff Jefferson" value={432} />
        <Select text="Smith Smithson" value={567} />
        <Select text="James Jameson" value={987} />
        <Select text="Sarah Sarahson" value={934} />
      </Field>
    </Sublist>
  </Tab>
  <Button label="Clear Button" />
</Form>; */
}

/////////////////////////////////////////
