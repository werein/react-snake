import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Snake from '../index';

storiesOf('Snake', module)
  .add('play', () => <Snake />);
