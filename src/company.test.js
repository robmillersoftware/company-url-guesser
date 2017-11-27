import React from 'react';
import ReactDOM from 'react-dom';
import Company from './company';

it('constructs itself and sets the name property with capitalization', () => {
  let co = new Company('testname');
  expect(co.name).toEqual('Testname');
});
