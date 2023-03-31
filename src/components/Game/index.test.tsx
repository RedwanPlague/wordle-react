import React from 'react';
import { render, screen } from '@testing-library/react';
import Game from '.';

test('renders app', () => {
  render(<Game />);
  expect(screen.getByText('Game')).toBeInTheDocument();
});
