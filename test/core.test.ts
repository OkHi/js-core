import OkHiCore, { OkHiCoreConfiguration, OkHiMode } from '../src';

describe('okhi core dev tests', () => {
  const configuration: OkHiCoreConfiguration = {
    auth: 'SWF0ejlENkFOVDphZjNkZGQxMi00ZTI5LTQ1MDItODQyMS1iZTlkNmUzODcwZTU=',
    context: {
      mode: OkHiMode.DEV,
    },
  };
  const core = new OkHiCore(configuration);

  it('it signs in user anonymously with phone number', async () => {
    const token = await core.user.anonymousSignWithPhoneNumber(
      '+254700110590',
      ['verify']
    );
    expect(token).toBeTruthy();
  });

  it('it signs in user anonymously with userId', async () => {
    const userId = '5kCVI3G6AO';
    const token = await core.user.anonymousSignInWithUserId(userId, ['verify']);
    expect(token).toBeTruthy();
  });

  it('it prevents anonymous sign in with bad userId', async () => {
    const userId = 'abc';
    await expect(
      core.user.anonymousSignInWithUserId(userId, ['verify'])
    ).rejects.toThrowError();
  });

  it('it prevents anonymous sign in with bad phone', async () => {
    const phone = 'abc';
    await expect(
      core.user.anonymousSignWithPhoneNumber(phone, ['verify'])
    ).rejects.toThrowError();
  });
});
