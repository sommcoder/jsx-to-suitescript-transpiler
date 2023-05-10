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
      <Field label="Customer" type="text" size={{ h: 40, w: 30 }}>
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

/*
 
Need to make it so that type can be handled regardless of case
 
*/

/////////////////////////////////////////
