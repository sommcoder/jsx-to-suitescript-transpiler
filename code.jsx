define(["N/ui/serverWidget", "N/search"], function (serverWidget, search) {
  // How do we get the serverWidget argument to use
  // in our page.create and page.write^^^^

  function onRequest(context) {
    // Page component function to be replaced by the string that we create through the babel custom plugin:

    function Page() {
      // bindings inside scope:
      const fileId = "654321";
      const def = 123;
      const clear = () => {};

      // we can only utilize bindings within the function scope unfortunately...
      //

      return (
        <Form title="Customer" fileId={fileId}>
          <Tab label="Customer Number">
            <FieldGroup label="Customer Number">
              <Field label="Customer Number" type="integer" def={def} />
            </FieldGroup>
          </Tab>
          <Tab label="Customer Information">
            <Sublist label="item history">
              <Field label="Items Purchased" type="text" />
              <Field label="SO" type="text" />
              <Field label="Total Spend" type="text" />
              <Field label="Date Added" type="text" />
              <Field label="Customer" type="text" />
            </Sublist>
          </Tab>
          <Button fn={clear} />
        </Form>
      );
    }

    return {
      onRequest: onRequest,
    };
  }
});
