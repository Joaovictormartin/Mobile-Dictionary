import { fireEvent, render, screen } from '@testing-library/react-native';

import { WordCard } from '@/components/word-card';

describe('WordCard', () => {
  it('opens a word when pressed', async () => {
    const onPress = jest.fn();
    await render(<WordCard word="blue" onPress={onPress} />);

    fireEvent.press(screen.getByText('blue'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
