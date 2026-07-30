const TURN_USERNAME = import.meta.env.VITE_METERED_USERNAME;
const TURN_CREDENTIAL = import.meta.env.VITE_METERED_CREDENTIAL;

export const createPeerConnection = () => {
  const iceServers = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun.relay.metered.ca:80" },
  ];

  if (TURN_USERNAME && TURN_CREDENTIAL) {
    iceServers.push(
      {
        urls: "turn:standard.relay.metered.ca:80",
        username: TURN_USERNAME,
        credential: TURN_CREDENTIAL,
      },
      {
        urls: "turn:standard.relay.metered.ca:80?transport=tcp",
        username: TURN_USERNAME,
        credential: TURN_CREDENTIAL,
      },
      {
        urls: "turn:standard.relay.metered.ca:443",
        username: TURN_USERNAME,
        credential: TURN_CREDENTIAL,
      },
      {
        urls: "turns:standard.relay.metered.ca:443?transport=tcp",
        username: TURN_USERNAME,
        credential: TURN_CREDENTIAL,
      }
    );
  }

  return new RTCPeerConnection({ iceServers });
};