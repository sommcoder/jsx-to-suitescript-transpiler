define(["N/ui/serverWidget", "N/search"], function (serverWidget, search) {
  // How do we get the serverWidget argument to use
  // in our page.create and page.write^^^^

  function onRequest(context) {
    // bindings outside of scope:
    const def = 123;
    s;
    function Page() {
      // bindings inside scope:
      const fileId = "654321";
      const client = "123456";
      return (
        <Form ui={serverWidget} title="Distribution Form" fileId={fileId}>
          <Sublist label="Item History" type="EDITOR">
            <Field label="Transaction id" type="number" def={def} />
            <Field label="Rate" type="text" />
            <Field label="Date" type="text" />
            <Field label="Entity" type="select">
              <Select value="123" text="Google" isSelected />
              <Select value="123" text="Facebook" />
              <Select value="123" text="Netflix" />
              <Select value="123" text="Airbnb" />
            </Field>
            <Button label="Reset Button" reset />
          </Sublist>
          <Button label="Submit Button" submit />
        </Form>
      );
    }

    return {
      onRequest: onRequest,
    };
  }
});
