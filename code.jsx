function Page() {
  const fileId = "654321";
  const client = "123456";
  return (
    <Form title="Distribution Form" fileId={fileId} module={client}>
      <Sublist label="Item History" type="EDITOR">
        <Field label="Transaction id" type="number" def={123} />
        <Field label="Rate" type="text" />
        <Field label="Date" type="text" />
        <Field label="Entity" type="select">
          <Select value="123" text="Google" isSelected />
          <Select value="123" text="Facebook" />
          <Select value="123" text="Netflix" />
          <Select value="123" text="Airbnb" />
        </Field>
        <Button label="Reset Button" />
      </Sublist>
      <Button id="submit_form_button" />
    </Form>
  );
}

/* we may have to consider something special for SELECT.isSelected as it is an attribute but can also be added in the .add() call
 */
