const client = mqtt.connect('wss://x2124b00.ala.asia-southeast1.emqxsl.com:8084/mqtt', {
  username: 'ESP32',
  password: 'Password1234!'
});
  
client.on('connect', () => {
console.log('Connected!');
client.subscribe('values', (err) => {
    if (err) {
    console.error('Subscribe error:', err);
    } else {
    console.log('Subscribed to values topic!');
    }
});
});

// Update UI when MQTT message arrives
client.on('message', (topic, message) => {
    const data = JSON.parse(message.toString());
    
    // Update each sensor box
    if (topic === 'values') {
      // Sensor values
      document.querySelector('#ethanol .value').textContent = `${data.Ethanol} ppm`;
      document.querySelector('#ammonia .value').textContent = `${data.Ammonia} ppm`;
      document.querySelector('#hydrogen-sulfide .value').textContent = `${data["Hydrogen Sulfide"]} ppm`;
      document.querySelector('#ethylene .value').textContent = `${data.Ethylene} ppm`;
    }
    if (topic === 'state') {
      // Food classification
      const foodInfoEl = document.getElementById('foodInfo');
      const state = data["State"];
      foodInfoEl.textContent = `${data["Type of Food"]}: ${data["Specific food"]} (${state})`;

      // Optional color based on state
      if (state === "Fresh") foodInfoEl.classList.add("green");
      else if (state === "Spoiling") foodInfoEl.classList.add("orange");
      else if (state === "Spoilt") foodInfoEl.classList.add("red");
    }
    
  });
  
// Subscribe to topics
client.on('connect', () => {
  client.subscribe('values');
  client.subscribe('state')
  console.log('Connected to MQTT broker!');
});