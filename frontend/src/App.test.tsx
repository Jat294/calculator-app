import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const mockedFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', mockedFetch);
  mockedFetch.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test('calculates a result through the backend API', async () => {
  mockedFetch.mockResolvedValue({
    ok: true,
    json: async () => ({ result: 12 }),
  });

  const user = userEvent.setup();
  render(<App />);

  await user.type(screen.getByLabelText(/first value/i), '7');
  await user.type(screen.getByLabelText(/second value/i), '5');
  await user.click(screen.getByRole('button', { name: /calculate/i }));

  await waitFor(() => {
    expect(screen.getByText('12')).toBeInTheDocument();
  });
  expect(mockedFetch).toHaveBeenCalledTimes(1);
});

test('renders long decimal results without breaking the layout', async () => {
  mockedFetch.mockResolvedValue({
    ok: true,
    json: async () => ({ result: Math.sqrt(7) }),
  });

  const user = userEvent.setup();
  render(<App />);

  await user.selectOptions(screen.getByLabelText(/operation/i), 'sqrt');
  await user.type(screen.getByLabelText(/first value/i), '7');
  await user.click(screen.getByRole('button', { name: /calculate/i }));

  await waitFor(() => {
    expect(screen.getByText('2.64575131')).toBeInTheDocument();
  });
});

test('shows client-side validation for invalid input', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole('button', { name: /calculate/i }));

  expect(screen.getByRole('alert')).toHaveTextContent(/first value must be a valid number/i);
  expect(mockedFetch).not.toHaveBeenCalled();
});
