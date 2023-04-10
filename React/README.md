## Using

Just download files and run following command in terminal:

```
npm install
``` 

After installing, you can use Login/Register form in your project Wherever you want

```jsx
<Switch>
  <Route path="/login" component={Login} />
  <Route path="/signup" component={SignUp} />
  <Redirect from="/" to="/signup" />
</Switch>
```
But don't forget to import react-router-dom and that components

```jsx
  import SignUp from "./components/SignUp";
  import Login from "./components/Login";
  import { Route, Switch, Redirect } from "react-router-dom";
```


