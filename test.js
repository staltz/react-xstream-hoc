const test = require('tape');
const React = require('react');
const xs = require('xstream').default;
const {withXstreamProps} = require('./index');
const TestRenderer = require('react-test-renderer');

test('updates component state when xs stream updates', t => {
  class Input extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return React.createElement('span', null, `My age is ${this.props.age}`);
    }
  }

  const Output = withXstreamProps(Input, 'age');

  const stream = xs.create();

  const elem = React.createElement(Output, {age: stream});
  const testRenderer = TestRenderer.create(elem);

  stream.shamefullySendNext(20);
  const result1 = testRenderer.toJSON();
  t.ok(result1, 'should have rendered');
  t.equal(result1.children.length, 1, 'should have one child');
  t.equal(result1.children[0], 'My age is 20', 'should show 20');

  stream.shamefullySendNext(21);
  testRenderer.update(elem);

  const result2 = testRenderer.toJSON();
  t.ok(result2, 'should have rendered');
  t.equal(result2.children.length, 1, 'should have one child');
  t.equal(result2.children[0], 'My age is 21', 'should show 21');

  t.end();
});

test('supports many xs streams', t => {
  class Input extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return React.createElement(
        'span',
        null,
        `${this.props.lat},${this.props.lng}`,
      );
    }
  }

  const Output = withXstreamProps(Input, 'lat', 'lng');

  const lat$ = xs.create();
  const lng$ = xs.create();

  const elem = React.createElement(Output, {lat: lat$, lng: lng$});
  const testRenderer = TestRenderer.create(elem);
  lat$.shamefullySendNext(45);
  lng$.shamefullySendNext(30);

  const result1 = testRenderer.toJSON();
  t.ok(result1, 'should have rendered');
  t.equal(result1.children.length, 1, 'should have one child');
  t.equal(result1.children[0], '45,30', 'should show 45,30');

  lat$.shamefullySendNext(46);
  testRenderer.update(elem);

  const result2 = testRenderer.toJSON();
  t.ok(result2, 'should have rendered');
  t.equal(result2.children.length, 1, 'should have one child');
  t.equal(result2.children[0], '46,30', 'should show 46,30');

  lng$.shamefullySendNext(32);
  testRenderer.update(elem);

  const result3 = testRenderer.toJSON();
  t.ok(result3, 'should have rendered');
  t.equal(result3.children.length, 1, 'should have one child');
  t.equal(result3.children[0], '46,32', 'should show 46,32');

  t.end();
});
