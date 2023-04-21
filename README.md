# "JSSX" - a JavaScript to SuiteScript Babel Plugin & Dev Tool

# The ui/serverWidget module requires very verbose syntax to build a UI. The API calls are verbose, requiring 100+ lines of code to build even a simple table with only a few fields

# Less Code, Quicker UI Development

JSSX dramatically cuts down on dev time and increases code readability expressed as simple JSX, which many developers are famililar with if they've ever used the React.

# Component Nesting Infers the Relationship

Page Components wrap valid child components within them like regular HTML/XML element nesting. This nesting infers the component's relationship. Once transpiled, auto-generated variables are used to connect child components to their parents components.

example:
Form.addField() =

<Form>
    <Field/>
</Form>

Sublist.addField() =
<Sublist>
<Field/>
</Sublist>

# Removes Verbosity

No need to sift through dozens of lines of code to find to find the variable names of your UI components. Everything is expressed within 20-50 lines of code for most UI's.

# Small Changes as Needed

- Edit your .jsx file
- run JSSX to transpile your changes
- Re-Deploy your script!
