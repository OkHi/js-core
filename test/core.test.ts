import OkHiCore, { OkHiCoreConfiguration, OkHiMode } from '../src';

describe('okhi core dev tests', () => {
  const configuration: OkHiCoreConfiguration = {
    auth: 'SWF0ejlENkFOVDphZjNkZGQxMi00ZTI5LTQ1MDItODQyMS1iZTlkNmUzODcwZTU=',
    context: {
      mode: OkHiMode.DEV,
    },
  };
  const core = new OkHiCore(configuration);

  it('fetches and authorization token', async () => {
    const token = await core.fetchAuthorizationToken();
    expect(token).toBeTruthy();
  });

  it('fetches and user authorization token', async () => {
    const userId = 'i3c5W92cB8';
    const token = await core.fetchUserVerificationToken(userId);
    expect(token).toBeTruthy();
  });
});
