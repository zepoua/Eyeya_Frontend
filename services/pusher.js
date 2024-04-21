// pusher.js
import { Pusher } from '@pusher/pusher-websocket-react-native';

const pusher = Pusher.getInstance();

   pusher.init({
    apiKey: "bb47b38a4b13613c16ef",
    cluster: "eu",
  });

   pusher.connect();

export default pusher;
