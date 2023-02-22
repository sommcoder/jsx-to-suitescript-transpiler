

function Page() {
  return (
    <Form ui={ui} title="Quantity Distribution">
      <Sublist label="Item Sublist" type="list">
        <Field label="Name" type="text" />
        <Field label="Line Key" type="text" hidden />
        <Field label="Ratio Number" type="float" />
        <Field label="Current Qty" type="float" display="entry" mandatory />
        <Field label="New Qty" type="float" display="entry" mandatory />
        <Button label="Reset Button" />
      </Sublist>
      <Button label="Submit Button" />
    </Form>
  );
}
