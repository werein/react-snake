import React from 'react';
import { shallow } from 'enzyme';
import Snake from '../index';
import { expect } from 'chai';
const { describe, it } = global;

describe('Snake', () => {
  it('should show the given text', () => {
    const text = 'The Text';
    const wrapper = shallow(<Snake />);
    expect(wrapper.text()).to.be.equal(text);
  });
});
