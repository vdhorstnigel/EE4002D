const client = mqtt.connect('wss://x2124b00.ala.asia-southeast1.emqxsl.com:8084/mqtt', {
  username: 'viewer',
  password: 'password'
});

const activeAlerts = {
  Ethanol: false,
  Ammonia: false,
  "Hydrogen Sulfide": false,
  Ethylene: false
};

function updateAlertBox() {
  const gases = {
    "Ethanol": "etoh",
    "Ammonia": "nh3",
    "Hydrogen Sulfide": "h2s",
    "Ethylene": "c2h4"
  };

  for (const [name, id] of Object.entries(gases)) {
    const box = document.getElementById(id);
    const alertMsg = box.querySelector('.alert-msg');

    if (activeAlerts[name]) {
      box.classList.add('alert');
      alertMsg.style.display = 'block';
    } else {
      box.classList.remove('alert');
      alertMsg.style.display = 'none';
    }
  }
}

client.on('connect', () => {
  client.subscribe('ESP32/state');
  client.subscribe('ESP32/data');
  client.subscribe('ESP32/alerts');
  client.subscribe('test');
  console.log('Connected to MQTT broker!');
});

client.on('message', (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    console.log('Received message on topic:', topic, 'with data:', data);

    if (topic === 'test' || topic === 'ESP32/data') {
      const timestamp = new Date(data.timestamp * 1000);
      document.querySelector('#timestamp .value').textContent = timestamp.toLocaleTimeString("it-IT");
      document.querySelector('#temperature .value').textContent = `${data.temperature}°C`;
      document.querySelector('#humidity .value').textContent = `${data.humidity}%`;
      document.querySelector('#etoh .value').textContent = `${data.etoh}`;
      document.querySelector('#nh3 .value').textContent = `${data.nh3}`;
      document.querySelector('#h2s .value').textContent = `${data.h2s}`;
      document.querySelector('#c2h4 .value').textContent = `${data.c2h4}`;
    }

    if (topic === 'ESP32/state') {
      console.log('Updating food state');
      const foodInfoEl = document.getElementById('foodInfo');
      const state = data["State"];
      foodInfoEl.textContent = `${data["Type of Food"]}: ${data["Specific food"]} (${state})`;

      // Optional color based on state
      foodInfoEl.classList.remove("green", "orange", "red"); 
      if (state === "Fresh") foodInfoEl.classList.add("green");
      else if (state === "Spoiling") foodInfoEl.classList.add("orange");
      else if (state === "Spoilt") foodInfoEl.classList.add("red");
    }

    if (topic === 'ESP32/alerts' || topic === 'test/alerts') {
      if ('etoh_anomaly' in data) activeAlerts["Ethanol"] = data.etoh_anomaly;
      if ('nh3_anomaly' in data) activeAlerts["Ammonia"] = data.nh3_anomaly;
      if ('h2s_anomaly' in data) activeAlerts["Hydrogen Sulfide"] = data.h2s_anomaly;
      if ('c2h4_anomaly' in data) activeAlerts["Ethylene"] = data.c2h4_anomaly;

      updateAlertBox();
    }
  } catch (error) {
    console.error('Error parsing message data:', error);
  }
});

