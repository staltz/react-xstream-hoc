# react-xstream-hoc

```
npm install --save react-xstream-hoc
```

A utility function (higher-order component, 'HOC') that takes a React component as input, and returns a React component that behaves like the input but knows how to listen to [xstream](https://github.com/staltz/xstream) streams from props.

## What problem this package solves

Let's say you have a normal React component that accepts normal props:

```jsx
<MyComponent isBlue={true} />
```

But you want the component to accept `isBlue` as an xstream stream, and have that component automatically listen to the stream and update accordingly.

## Usage

```js
import {withXstreamProps} from 'react-xstream-hoc';

const MyXSComponent = withXstreamProps(MyComponent, 'isBlue');

// ... then in a render function ...
<MyXSComponent isBlue={obs} />
```
