// MQTT Setup (using WebSocket)
const client = mqtt.connect('wss://x2124b00.ala.asia-southeast1.emqxsl.com:8883', {
    username: 'ESP32',
    password: 'Password1234!'
  });
  
// Update UI when MQTT message arrives
client.on('message', (topic, message) => {
    const data = JSON.parse(message.toString());
    
    // Update each sensor box
    document.querySelector('#ethanol .value').textContent = `${data.Ethanol} ppm`;
    document.querySelector('#ammonia .value').textContent = `${data.Ammonia} ppm`;
    document.querySelector('#hydrogen-sulfide .value').textContent = `${data["Hydrogen Sulfide"]} ppm`;
    document.querySelector('#ethylene .value').textContent = `${data.Ethylene} ppm`;
  });
  
  // Subscribe to topics
  client.on('connect', () => {
    client.subscribe('values');
    console.log('Connected to MQTT broker!');
  });