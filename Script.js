const rwandaDistricts = [
  "Gasabo", "Kicukiro", "Nyarugenge", "Bugesera", "Gatsibo", "Kayonza", "Kirehe",
  "Ngoma", "Nyagatare", "Rwamagana", "Burera", "Gakenke", "Gicumbi", "Musanze",
  "Rulindo", "Gisagara", "Huye", "Kamonyi", "Muhanga", "Nyamagabe", "Nyanza",
  "Nyaruguru", "Ruhango", "Karongi", "Ngororero", "Nyabihu", "Rubavu", "Rusizi", "Rutsiro"
];

const districtCoordinates = {
  "Gasabo": { lat: -1.919, lon: 30.082 }, "Kicukiro": { lat: -1.990, lon: 30.125 },
  "Nyarugenge": { lat: -1.950, lon: 30.060 }, "Bugesera": { lat: -2.316, lon: 30.150 },
  "Gatsibo": { lat: -1.700, lon: 30.500 }, "Kayonza": { lat: -1.870, lon: 30.650 },
  "Kirehe": { lat: -2.2566, lon: 30.6967 }, "Ngoma": { lat: -2.207, lon: 30.530 },
  "Nyagatare": { lat: -1.300, lon: 30.320 }, "Rwamagana": { lat: -1.955, lon: 30.434 },
  "Burera": { lat: -1.480, lon: 29.870 }, "Gakenke": { lat: -1.683, lon: 29.620 },
  "Gicumbi": { lat: -1.575, lon: 30.080 }, "Musanze": { lat: -1.500, lon: 29.630 },
  "Rulindo": { lat: -1.670, lon: 29.880 }, "Gisagara": { lat: -2.520, lon: 29.870 },
  "Huye": { lat: -2.600, lon: 29.740 }, "Kamonyi": { lat: -2.070, lon: 29.920 },
  "Muhanga": { lat: -2.120, lon: 29.760 }, "Nyamagabe": { lat: -2.470, lon: 29.570 },
  "Nyanza": { lat: -2.350, lon: 29.750 }, "Nyaruguru": { lat: -2.610, lon: 29.520 },
  "Ruhango": { lat: -2.160, lon: 29.780 }, "Karongi": { lat: -2.150, lon: 29.430 },
  "Ngororero": { lat: -1.990, lon: 29.620 }, "Nyabihu": { lat: -1.670, lon: 29.530 },
  "Rubavu": { lat: -1.680, lon: 29.370 }, "Rusizi": { lat: -2.510, lon: 29.120 },
  "Rutsiro": { lat: -1.940, lon: 29.330 }
};


const OPENWEATHER_API_KEY = '****[put your weather api key here ]***';

let currentWeatherData = {};
let currentSelectedCrop = '';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


const cropAgriculturalData = {
    maize: {
        name: "Maize (Corn)",
        temp: { min: 20, max: 30, criticalLow: 15, criticalHigh: 35 },
        rainfall: { min: 600, max: 900 }, // Total mm for season, not directly used for daily alerts
        humidity: { min: 60, max: 80, criticalLow: 40, criticalHigh: 95 },
        plantingMonths: [8, 9, 10, 2, 3], // Sept, Oct, Nov, March, April (0-indexed)
        dailyRainAlertThreshold: { low: 1, high: 25 } // mm/day for alerts
    },
    beans: {
        name: "Beans",
        temp: { min: 18, max: 24, criticalLow: 12, criticalHigh: 28 },
        rainfall: { min: 300, max: 500 },
        humidity: { min: 50, max: 70, criticalLow: 30, criticalHigh: 90 },
        plantingMonths: [8, 9, 10, 2, 3],
        dailyRainAlertThreshold: { low: 0.5, high: 15 }
    },
    rice: {
        name: "Rice",
        temp: { min: 25, max: 35, criticalLow: 20, criticalHigh: 40 },
        rainfall: { min: 1000, max: 1500 },
        humidity: { min: 70, max: 90, criticalLow: 60, criticalHigh: 99 },
        plantingMonths: [2, 3, 4, 8, 9], // March, April, May (for Season B), Sept, Oct (for Season A)
        dailyRainAlertThreshold: { low: 10, high: 30 } // Needs high continuous rain or irrigation
    },
    coffee: {
        name: "Coffee",
        temp: { min: 18, max: 22, criticalLow: 15, criticalHigh: 25 },
        rainfall: { min: 1500, max: 2000 },
        humidity: { min: 60, max: 80, criticalLow: 40, criticalHigh: 95 },
        plantingMonths: [1, 2, 3], // Feb, March, April (often when rains are reliable)
        dailyRainAlertThreshold: { low: 2, high: 20 }
    },
    banana: {
        name: "Banana",
        temp: { min: 25, max: 30, criticalLow: 20, criticalHigh: 32 },
        rainfall: { min: 100, max: 150 }, // mm/month
        humidity: { min: 75, max: 90, criticalLow: 60, criticalHigh: 99 },
        plantingMonths: [8, 9, 10, 2, 3, 4], // Can be planted year-round with irrigation, but prefers rainy season
        dailyRainAlertThreshold: { low: 5, high: 25 }
    },
    potato: {
        name: "Irish Potato",
        temp: { min: 15, max: 20, criticalLow: 10, criticalHigh: 25 },
        rainfall: { min: 500, max: 700 },
        humidity: { min: 70, max: 85, criticalLow: 50, criticalHigh: 95 },
        plantingMonths: [8, 9, 2, 3], // Sept, Oct, March, April
        dailyRainAlertThreshold: { low: 0.5, high: 10 }
    },
    cassava: {
        name: "Cassava",
        temp: { min: 25, max: 30, criticalLow: 20, criticalHigh: 35 },
        rainfall: { min: 1000, max: 1500 },
        humidity: { min: 60, max: 80, criticalLow: 40, criticalHigh: 90 },
        plantingMonths: [8, 9, 10, 2, 3, 4], // All rainy seasons
        dailyRainAlertThreshold: { low: 1, high: 20 }
    },
    sorghum: {
        name: "Sorghum",
        temp: { min: 26, max: 30, criticalLow: 20, criticalHigh: 35 },
        rainfall: { min: 400, max: 800 },
        humidity: { min: 40, max: 60, criticalLow: 20, criticalHigh: 80 },
        plantingMonths: [8, 9, 10, 2, 3],
        dailyRainAlertThreshold: { low: 0.2, high: 15 }
    }
};


document.addEventListener("DOMContentLoaded", function () {
  const districtSelect = document.getElementById("district-select");
  const locationForm = document.getElementById("location-form");
  const weatherBtn = document.getElementById("weather-btn");
  const locationInput = document.getElementById("location-input");
  const districtSearchInput = document.getElementById("district-search");
  const cropSelect = document.getElementById("crop-select");

  rwandaDistricts.forEach(district => {
    const option = document.createElement("option");
    option.value = district;
    option.textContent = district;
    districtSelect.appendChild(option);
  });

  locationForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const district = locationInput.value.trim();
    await handleDistrictSelection(district);
  });

  districtSelect.addEventListener('change', async function() {
      const selectedDistrict = this.value;
      locationInput.value = selectedDistrict;
      if (selectedDistrict) {
          await handleDistrictSelection(selectedDistrict);
      } else {
          clearAllDisplays(); // Clears all related displays
      }
  });

  districtSearchInput.addEventListener('input', filterDistricts);
  cropSelect.addEventListener('change', updateFarmingTips);
});

async function handleDistrictSelection(district) {
    if (!districtCoordinates[district]) {
        alert("Please enter or select a valid district from Rwanda.");
        console.warn("Invalid district entered:", district);
        clearAllDisplays(); // Clears all related displays
        return;
    }

    console.log("Attempting to get weather for:", district);
    await getWeather(district);
}

// Function to clear all dynamic displays
function clearAllDisplays() {
    document.getElementById("weather-data").innerHTML = '';
    document.getElementById("forecast").innerHTML = '';
    document.getElementById("agri-weather-status").innerHTML = '';
    document.getElementById("farming-tips").innerHTML = ''; // Clear tips too
    document.getElementById("weather-alerts").innerHTML = ''; // Clear alerts too
    currentWeatherData = {}; // Reset weather data
    currentSelectedCrop = ''; // Reset selected crop
    document.getElementById("crop-select").value = ""; // Reset crop select dropdown
    document.getElementById("location-input").value = ""; // Clear location input
    document.getElementById("district-select").value = ""; // Clear district select
}

async function getWeather(district) {
  console.log(`Fetching weather for: ${district}`);
  const coords = districtCoordinates[district];

  try {
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
    );
    if (!currentRes.ok) {
        throw new Error(`Failed to fetch current weather: ${currentRes.statusText}`);
    }
    const current = await currentRes.json();
    console.log("Current weather response:", current);

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
    );
    if (!forecastRes.ok) {
        throw new Error(`Failed to fetch forecast: ${forecastRes.statusText}`);
    }
    const forecast = await forecastRes.json();
    console.log("Forecast weather response:", forecast);

    // Parse forecast data to include more details (like rain for each day)
    const dailyForecast = forecast.list.filter(item =>
      item.dt_txt.includes("12:00:00")
    ).slice(0, 5).map(item => ({
        date: new Date(item.dt_txt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        temp: item.main.temp,
        condition: item.weather[0].main,
        icon: item.weather[0].icon,
        // Include humidity and rain for forecast days for more robust checks
        humidity: item.main.humidity,
        rainfall: item.rain && item.rain['3h'] ? item.rain['3h'] : 0 // OpenWeatherMap forecast provides 3-hour rain
    }));


    currentWeatherData = {
      location: district,
      temperature: current.main.temp,
      condition: current.weather[0].main,
      humidity: current.main.humidity,
      rainfall: current.rain && current.rain['1h'] ? current.rain['1h'] : 0, // Current 1-hour rain
      windSpeed: current.wind.speed,
      forecast: dailyForecast
    };

    displayWeather(currentWeatherData);
    displayAgriRelatedWeatherStatus(currentWeatherData);
    updateFarmingTips();
    displayWeatherAlerts(currentWeatherData);
  } catch (err) {
    console.error("Weather fetch error:", err.message);
    alert("Failed to retrieve weather data. Check your internet connection or API key.");
    clearAllDisplays(); // Clears all on error
  }
}

function displayWeather(data) {
  const weatherDiv = document.getElementById("weather-data");
  const forecastDiv = document.getElementById("forecast");

  weatherDiv.innerHTML = `
    <h2>Weather in ${data.location}</h2>
    <p> Temperature: ${data.temperature}°C</p>
    <p> Condition: ${data.condition} <img src="http://openweathermap.org/img/wn/${data.forecast[0].icon}.png" alt="${data.condition} icon"></p>
    <p> Humidity: ${data.humidity}%</p>
    <p> Rainfall: ${data.rainfall} mm (last 1 hour)</p>
    <p> Wind Speed: ${data.windSpeed} m/s</p>
    <h3> Recommended Crops for Current Weather:</h3>
    <ul>${suggestCrops(data).map(crop => `<li>${crop}</li>`).join("")}</ul>
  `;

  forecastDiv.innerHTML = `<h3>📅 5-Day Forecast</h3>`;
  data.forecast.forEach(day => {
    const dayDiv = document.createElement("div");
    dayDiv.className = "forecast-day";
    dayDiv.innerHTML = `
        <strong>${day.date}</strong>: ${day.condition}, ${day.temp}°C, ${day.rainfall}mm Rain
        <img src="http://openweathermap.org/img/wn/${day.icon}.png" alt="${day.condition} icon">
    `;
    forecastDiv.appendChild(dayDiv);
  });

  console.log("Displayed weather for:", data.location);
}

function displayAgriRelatedWeatherStatus(data) {
    const agriWeatherStatusDiv = document.getElementById("agri-weather-status");

    if (!data || !data.location) {
        agriWeatherStatusDiv.innerHTML = '';
        return;
    }

    agriWeatherStatusDiv.innerHTML = `
        <h3>Current Agri-Related Weather Status in ${data.location}</h3>
        <p>Temperature: <strong>${data.temperature}°C</strong></p>
        <p> Humidity: <strong>${data.humidity}%</strong></p>
        <p> Rainfall (last 1hr): <strong>${data.rainfall} mm</strong></p>
        <p> Wind Speed: <strong>${data.windSpeed} m/s</strong></p>
        <p> Sky Condition: <strong>${data.condition}</strong></p>
        <hr/>
    `;
}

function suggestCrops(data) {
  const { temperature, rainfall, humidity } = data;
  const crops = [];

  // General guidelines (you can refine these based on Rwandan agricultural data)
  if (temperature >= 18 && temperature <= 28 && rainfall > 0) {
    crops.push("Maize (Corn)", "Beans", "Cassava", "Bananas", "Sweet Potatoes");
  }
  if (temperature >= 20 && humidity >= 60 && rainfall > 0.5) {
    crops.push("Coffee", "Tea", "Avocados");
  }
  if (temperature >= 15 && temperature <= 25 && rainfall > 0.2) {
    crops.push("Cabbage", "Carrots", "Onions", "Tomatoes");
  }
  if (temperature >= 25 && humidity <= 50) {
    crops.push("Sorghum", "Groundnuts", "Sunflowers");
  }

  console.log("Suggested crops based on weather:", crops);
  return [...new Set(crops)];
}

function filterDistricts() {
    const searchInput = document.getElementById('district-search');
    const selectElement = document.getElementById('district-select');
    const filter = searchInput.value.toLowerCase();

    selectElement.innerHTML = '<option value="">Select a district...</option>';

    rwandaDistricts.filter(district =>
        district.toLowerCase().includes(filter)
    ).forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        selectElement.appendChild(option);
    });
}

function updateFarmingTips() {
    const cropSelect = document.getElementById('crop-select');
    const farmingTipsDiv = document.getElementById('farming-tips');
    currentSelectedCrop = cropSelect.value;

    let tips = '';

    if (!currentSelectedCrop) {
        farmingTipsDiv.innerHTML = '<p class="pleaseDo">Please select a crop to get farming tips.</p>';
        return;
    }

    if (!currentWeatherData.location) {
        farmingTipsDiv.innerHTML = `<p>Please get weather data for a location first to receive weather-adapted tips for ${cropAgriculturalData[currentSelectedCrop]?.name || currentSelectedCrop}.</p>`;
        return;
    }

    const { temperature, rainfall, humidity, forecast } = currentWeatherData;
    const cropData = cropAgriculturalData[currentSelectedCrop];

    if (!cropData) {
        farmingTipsDiv.innerHTML = `<p>No detailed farming tips available for ${currentSelectedCrop} yet.</p>`;
        return;
    }

    tips += `<h3>Tips for ${cropData.name} in ${currentWeatherData.location}</h3>`;
    tips += `<h4>General Agricultural Parameters:</h4>`;
    tips += `<ul>`;
    tips += `<li>Optimal Temperature: ${cropData.temp.min}-${cropData.temp.max}°C</li>`;
    tips += `<li>Optimal Humidity: ${cropData.humidity.min}-${cropData.humidity.max}%</li>`;
    tips += `<li>Ideal Daily Rainfall: ${cropData.dailyRainAlertThreshold.low}-${cropData.dailyRainAlertThreshold.high} mm</li>`;
    tips += `<li>General Planting Months: ${cropData.plantingMonths.map(m => monthNames[m]).join(', ')}</li>`;
    tips += `</ul>`;


    tips += `<h4>Weather-Adapted Tips:</h4>`;
    tips += `<ul>`;

    // Temperature-based tips
    if (temperature < cropData.temp.min) {
        tips += `<li>Current temperature (${temperature}°C) is a bit low for ${cropData.name}. Growth might be slow.</li>`;
    } else if (temperature > cropData.temp.max) {
        tips += `<li>Current temperature (${temperature}°C) is high for ${cropData.name}. Ensure adequate moisture to mitigate heat stress.</li>`;
    } else {
        tips += `<li>Current temperature (${temperature}°C) is favorable for ${cropData.name}.</li>`;
    }

    // Rainfall-based tips (using current and forecast conditions)
    const hasHeavyRainForecast = forecast.some(day => day.rainfall >= cropData.dailyRainAlertThreshold.high * 1.5) || currentWeatherData.condition.toLowerCase().includes('rain') || currentWeatherData.condition.toLowerCase().includes('thunderstorm');
    const hasLowRainForecast = forecast.every(day => day.rainfall < cropData.dailyRainAlertThreshold.low * 0.5) && rainfall < cropData.dailyRainAlertThreshold.low && (currentWeatherData.condition.toLowerCase().includes('clear') || currentWeatherData.condition.toLowerCase().includes('clouds'));


    if (rainfall < cropData.dailyRainAlertThreshold.low && hasLowRainForecast) {
        tips += `<li>Low current rainfall (${rainfall}mm) and dry forecast. ${cropData.name} will require significant irrigation.</li>`;
    } else if (rainfall > cropData.dailyRainAlertThreshold.high || hasHeavyRainForecast) {
        tips += `<li>Heavy current rainfall (${rainfall}mm) or heavy rain forecasted. Ensure good drainage to prevent waterlogging and disease.</li>`;
    } else {
        tips += `<li>Current and forecasted rainfall appears suitable for ${cropData.name}.</li>`;
    }

    // Humidity-based tips
    if (humidity < cropData.humidity.min) {
        tips += `<li>Humidity (${humidity}%) is low for ${cropData.name}. Consider methods to increase local humidity or ensure ample water supply.</li>`;
    } else if (humidity > cropData.humidity.max) {
        tips += `<li>Humidity (${humidity}%) is high for ${cropData.name}. Monitor for fungal diseases which thrive in high humidity and ensure good air circulation.</li>`;
    } else {
        tips += `<li>Current humidity is generally suitable for ${cropData.name}.</li>`;
    }

    tips += `</ul>`;
    farmingTipsDiv.innerHTML = tips;
}


function displayWeatherAlerts(data) {
    const weatherAlertsDiv = document.getElementById('weather-alerts');
    weatherAlertsDiv.innerHTML = '<h3> Weather Alerts</h3>';

    let alerts = [];
    
    const currentMonth = new Date().getMonth();

    // General severe weather conditions
    if (data.condition.toLowerCase().includes('thunderstorm') || data.forecast.some(d => d.condition.toLowerCase().includes('thunderstorm'))) {
        alerts.push('Thunderstorms expected. Protect crops from strong winds and heavy rain. Seek shelter.');
    }
    // Check for extreme rain (current or forecast)
    const totalForecastRainForNext5Days = data.forecast.reduce((sum, d) => sum + d.rainfall, 0);
    const hasHeavyRainInForecast = data.forecast.some(d => d.rainfall >= 25); // Arbitrary threshold for 'heavy' in 3-hour forecast
    const hasVeryLowRainInForecast = data.forecast.every(d => d.rainfall < 0.5); // Arbitrary threshold for 'very low' in 3-hour forecast


    if (data.rainfall > 15 || hasHeavyRainInForecast) {
        alerts.push('Heavy rainfall. Monitor for flooding and ensure good drainage in fields to prevent waterlogging and soil erosion.');
    } else if (data.rainfall === 0 && hasVeryLowRainInForecast && data.temperature > 25) { // Only alert for dry if it's also warm
         alerts.push('Prolonged dry spell expected. Conserve water and consider urgent irrigation for sensitive crops.');
    } else if (data.rainfall > 0 || totalForecastRainForNext5Days > 5) { // Some rain is expected
        alerts.push('Rainfall expected. Prepare for field work and planting activities that benefit from moisture.');
    } else {
        alerts.push('Current weather is dry. If planting, plan for irrigation or select drought-tolerant crops.');
    }


    if (data.condition.toLowerCase().includes('snow') || data.forecast.some(d => d.condition.toLowerCase().includes('snow'))) {
        alerts.push('Unusual snowfall or very cold temperatures expected. Protect sensitive crops from frost.');
    }
    if (data.condition.toLowerCase().includes('clear') && data.temperature > 30 && data.forecast.some(d => d.temp > 30)) {
        alerts.push('High temperatures and clear skies expected. Ensure adequate irrigation to prevent heat stress on crops and livestock.');
    }
    if (data.windSpeed > 10) { // Wind speed in m/s
        alerts.push('Strong winds expected. Secure young plants and fragile structures. Consider windbreaks if possible.');
    }
    if (data.humidity > 85 && data.forecast.some(d => d.humidity > 85 || d.condition.toLowerCase().includes('rain'))) {
        alerts.push('High humidity combined with rain increases risk of fungal diseases. Monitor crops closely and consider protective measures.');
    }

    // Crop-specific alerts and planting safety advice
    if (currentSelectedCrop && cropAgriculturalData[currentSelectedCrop]) {
        const crop = cropAgriculturalData[currentSelectedCrop];
        let plantingSafety = '';
        let monthAdvice = '';

        // --- Planting Safety Check ---
        let isSafeToPlant = true;
        let reasonsNotSafe = [];

        // Temperature check
        // Using average forecast temp for a more holistic view for planting decision
        const avgForecastTemp = data.forecast.reduce((sum, d) => sum + d.temp, 0) / data.forecast.length;
        if (data.temperature < crop.temp.criticalLow || avgForecastTemp < crop.temp.criticalLow) {
            isSafeToPlant = false;
            reasonsNotSafe.push(`low temperatures (current: ${data.temperature}°C, avg forecast: ${avgForecastTemp.toFixed(1)}°C)`);
        } else if (data.temperature > crop.temp.criticalHigh || avgForecastTemp > crop.temp.criticalHigh) {
            isSafeToPlant = false;
            reasonsNotSafe.push(`high temperatures (current: ${data.temperature}°C, avg forecast: ${avgForecastTemp.toFixed(1)}°C)`);
        }

        // Rainfall check for planting (if too little or too much based on daily thresholds)
        // Planting generally needs consistent, not extreme, rain or irrigation
        if (data.rainfall < crop.dailyRainAlertThreshold.low * 0.5 && hasVeryLowRainInForecast) { // Very dry
            isSafeToPlant = false;
            reasonsNotSafe.push(`very low current and forecasted rainfall, making water availability poor`);
        } else if (data.rainfall > crop.dailyRainAlertThreshold.high * 1.5 || hasHeavyRainInForecast) { // Excessive rain
            isSafeToPlant = false;
            reasonsNotSafe.push(`very high current or forecasted rainfall, risking waterlogging and washouts`);
        }

        // Humidity check (if critical for planting)
        const avgForecastHumidity = data.forecast.reduce((sum, d) => sum + d.humidity, 0) / data.forecast.length;
        if (data.humidity < crop.humidity.criticalLow && crop.humidity.criticalLow > 0 && avgForecastHumidity < crop.humidity.criticalLow) {
            isSafeToPlant = false;
            reasonsNotSafe.push(`low humidity (current: ${data.humidity}%, avg forecast: ${avgForecastHumidity.toFixed(1)}%)`);
        }
        if (data.humidity > crop.humidity.criticalHigh && crop.humidity.criticalHigh < 100 && avgForecastHumidity > crop.humidity.criticalHigh) {
            isSafeToPlant = false;
            reasonsNotSafe.push(`high humidity (current: ${data.humidity}%, avg forecast: ${avgForecastHumidity.toFixed(1)}%), increasing disease risk`);
        }


        if (isSafeToPlant) {
            plantingSafety = ` It appears **safe to consider planting ${crop.name}** based on current and next few days' weather conditions.`;
        } else {
            plantingSafety = `It is **NOT advisable to plant ${crop.name} now** due to ${reasonsNotSafe.join(', ')}. Conditions are unfavorable.`;
        }
        alerts.unshift(plantingSafety); // Add to the top of alerts


        // --- Month-based Advice ---
        const isInIdealPlantingMonth = crop.plantingMonths.includes(currentMonth);

        if (isInIdealPlantingMonth) {
            if (!isSafeToPlant) { // Within ideal month, but weather is bad
                monthAdvice = `Although ${monthNames[currentMonth]} is typically an ideal month for planting ${crop.name}, current weather conditions are not favorable. Consider delaying or using protective measures.`;
            } else { // Within ideal month, and weather is good
                monthAdvice = `This is an ideal planting month (${monthNames[currentMonth]}) for ${crop.name}, and current conditions are favorable. Great time for planting!`;
            }
        } else { // Not in ideal month
            monthAdvice = `Currently, it is ${monthNames[currentMonth]}. Ideal planting months for ${crop.name} are typically ${crop.plantingMonths.map(m => monthNames[m]).join(' or ')}.`;
            if (isSafeToPlant) { // Not ideal month, but weather is surprisingly good
                monthAdvice += ` However, current weather conditions are unusually favorable. If you have irrigation, you might consider planting, but be mindful of long-term seasonal patterns.`;
            } else { // Not ideal month, and weather is bad
                monthAdvice += ` Current weather conditions are also not favorable for planting. It is best to wait for the next suitable planting season.`;
            }
        }
        alerts.push(monthAdvice); // Add month advice after planting safety

        // Crop-specific disease/pest alerts related to current weather
        if (currentSelectedCrop === 'potato' && data.humidity > 80 && (data.rainfall > 5 || data.forecast.some(d => d.humidity > 80 && d.rainfall > 2))) {
            alerts.push('High risk of **Late Blight for Irish Potatoes** due to wet and humid conditions. Consider preventative fungicide application and good air circulation.');
        }
        if (currentSelectedCrop === 'coffee' && data.rainfall > 20 && data.forecast.some(d => d.rainfall > 10 && d.condition.toLowerCase().includes('rain'))) {
            alerts.push('Risk of **Coffee Berry Disease** and nutrient leaching due to heavy rainfall. Improve drainage and consider appropriate disease control measures.');
        }
        if (currentSelectedCrop === 'maize' && data.temperature > 30 && data.rainfall < 1 && data.forecast.every(d => d.temp > 30 && d.rainfall < 1)) {
            alerts.push('Risk of **Maize Lethal Necrosis Disease (MLND)** spread due to high temperatures and dry conditions. Monitor plants closely for symptoms.');
        }
        // Example for high humidity and disease risk for beans
        if (currentSelectedCrop === 'beans' && data.humidity > 85 && (data.rainfall > 5 || data.forecast.some(d => d.humidity > 85 && d.rainfall > 2))) {
            alerts.push('High risk of **Anthracnose or Rust** for Beans due to high humidity and wet conditions. Ensure good air circulation and consider preventative sprays.');
        }
    }


    if (alerts.length > 0) {
        const ul = document.createElement('ul');
        alerts.forEach(alert => {
            const li = document.createElement('li');
            li.innerHTML = alert; 
            ul.appendChild(li);
        });
        weatherAlertsDiv.appendChild(ul);
    } else {
        weatherAlertsDiv.innerHTML += '<p>No specific weather alerts at this time.</p>';
    }
}