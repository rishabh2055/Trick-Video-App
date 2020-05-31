const { RTCPeerConnection } = window;

export class GlobalConstants {
  public static  peerConnectionLocal = new RTCPeerConnection();
  public static peerConnectionRemote = new RTCPeerConnection();

}
