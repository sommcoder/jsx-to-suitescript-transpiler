function Page() {
  const title = "Item History";
  const client = 123456;
  const fart = "stinky";
  return (
    <Form fartAttr={fart} titleAttr={title} hideNav clientAttr={client}>
      <Sublist label="Item History" type="EDITOR">
        <Field label="Transaction id" type="number" def={123} />
        <Field label="Rate" type="text" />
        <Field label="Date" type="text" />
        <Field label="Entity" type="select">
          <Select value="" text="" isSelected />
          <Select value="" text="" />
          <Select value="" text="" />
          <Select value="" text="" />
        </Field>
        <Button label="Reset Button" />
      </Sublist>
      <Button id="submit_form_button" />
    </Form>
  );
}
