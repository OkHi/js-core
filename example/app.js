const core = require('@okhi/core');
const OkHi = core.default;
const { OkHiPlatformType, OkHiMode } = core;

OkHi.init('eHVBR2dseGlmUTpiYTMxYTE1Zi1kODE3LTRjZDQtYmM1MC1lNDY5ZGUwZDM5NmE=', {
  app: { name: 'OkCollect Online Demo App', version: '1.0.0' },
  platform: { name: OkHiPlatformType.HYBRID },
  mode: OkHiMode.DEV,
  developer: 'okhi',
});

// OkHi.fetchAuthorizationToken()
//   .then(console.log)
//   .catch(console.log);

OkHi.fetchUserVerificationToken('i3c5W92cB8')
  .then(console.log)
  .catch(console.log);
