// OneSignal will go here once connected
export async function sendPushViaOneSignal(payload: {
  title: string;
  body: string;
  url?: string;
  audience?: string;
}) {
  // Suppress unused variable warning until this is implemented
  void payload;
  throw new Error('OneSignal not yet configured');
}
