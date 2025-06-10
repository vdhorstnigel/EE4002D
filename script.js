const client = mqtt.connect('wss://x2124b00.ala.asia-southeast1.emqxsl.com:8084/mqtt', {
  username: 'viewer',
  password: 'password'
});

client.on('connect', () => {
  //client.subscribe('esp32/values');
  //client.subscribe('esp32/state');
  client.subscribe('test');
  console.log('Connected to MQTT broker!');
});

client.on('message', (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    console.log('Received message on topic:', topic, 'with data:', data); // Log the received message

    if (topic === 'esp32/values') {
      document.querySelector('#ethanol .value').textContent = `${data.Ethanol} ppm`;
      document.querySelector('#ammonia .value').textContent = `${data.Ammonia} ppm`;
      document.querySelector('#hydrogen-sulfide .value').textContent = `${data["Hydrogen Sulfide"]} ppm`;
      document.querySelector('#ethylene .value').textContent = `${data.Ethylene} ppm`;
    }

    if (topic === 'test') {
      const timestamp = new Date(data.timestamp * 1000);
      document.querySelector('#timestamp .value').textContent = timestamp;
      document.querySelector('#temperature .value').textContent = `${data.temperature}`;
      document.querySelector('#humidity .value').textContent = `${data.humidity}`;
      document.querySelector('#ethanol .value').textContent = `${data.etoh}`;
      document.querySelector('#ammonia .value').textContent = `${data.nh3}`;
      document.querySelector('#hydrogen-sulfide .value').textContent = `${data.h2s}`;
      document.querySelector('#ethylene .value').textContent = `${data.c2h4}`;
    }

    if (topic === 'esp32/state') {
      console.log('Updating food state');
      const foodInfoEl = document.getElementById('foodInfo');
      const state = data["State"];
      foodInfoEl.textContent = `${data["Type of Food"]}: ${data["Specific food"]} (${state})`;

      // Optional color based on state
      foodInfoEl.classList.remove("green", "orange", "red"); // Remove any old color classes
      if (state === "Fresh") foodInfoEl.classList.add("green");
      else if (state === "Spoiling") foodInfoEl.classList.add("orange");
      else if (state === "Spoilt") foodInfoEl.classList.add("red");
    }
  } catch (error) {
    console.error('Error parsing message data:', error);
  }
});

