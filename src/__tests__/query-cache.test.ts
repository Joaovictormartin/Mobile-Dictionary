import { QueryClient } from '@tanstack/react-query';

describe('dictionary query cache', () => {
  it('reuses a valid result without a second request', async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { staleTime: 60_000 } },
    });
    const request = jest.fn().mockResolvedValue([{ word: 'blue' }]);

    await client.fetchQuery({ queryKey: ['word', 'blue'], queryFn: request });
    await client.fetchQuery({ queryKey: ['word', 'blue'], queryFn: request });

    expect(request).toHaveBeenCalledTimes(1);
    client.clear();
  });
});
