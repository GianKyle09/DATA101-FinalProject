export const consumptionData = [
  {
    country: "Philippines",
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
    values: [82.5, 87.3, 92.1, 96.8, 101.5, 95.2, 102.8, 108.4],
    residential: [24.8, 26.2, 27.6, 29.0, 30.5, 33.3, 35.0, 36.9],
    industrial: [35.5, 37.5, 39.6, 41.6, 43.6, 38.1, 42.1, 45.5],
  },
  {
    country: "Indonesia",
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
    values: [213.5, 225.8, 238.2, 250.5, 262.8, 245.2, 260.1, 275.2],
    residential: [64.1, 67.7, 71.5, 75.2, 78.8, 85.8, 88.4, 93.6],
    industrial: [92.8, 98.2, 103.6, 108.9, 114.3, 98.1, 107.1, 115.6],
  },
  {
    country: "Malaysia",
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
    values: [130.2, 137.6, 145.1, 152.5, 160.0, 149.6, 158.5, 167.5],
    residential: [39.1, 41.3, 43.5, 45.8, 48.0, 52.4, 54.0, 57.0],
    industrial: [56.5, 59.8, 63.1, 66.3, 69.6, 59.8, 65.2, 70.4],
  },
  {
    country: "Thailand",
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
    values: [150.5, 159.1, 167.8, 176.4, 185.0, 172.9, 183.3, 193.8],
    residential: [45.2, 47.7, 50.3, 52.9, 55.5, 60.5, 62.3, 65.9],
    industrial: [65.3, 69.1, 72.9, 76.6, 80.4, 69.2, 75.2, 81.4],
  },
  {
    country: "Vietnam",
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
    values: [168.3, 177.9, 187.6, 197.2, 206.9, 193.3, 205.0, 216.7],
    residential: [50.5, 53.4, 56.3, 59.2, 62.1, 67.7, 69.7, 73.7],
    industrial: [73.0, 77.2, 81.5, 85.7, 89.9, 77.3, 84.1, 90.8],
  },
  {
    country: "Singapore",
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
    values: [40.9, 43.2, 45.6, 47.9, 50.2, 46.9, 49.7, 52.6],
    residential: [12.3, 13.0, 13.7, 14.4, 15.1, 16.4, 16.9, 17.9],
    industrial: [17.7, 18.8, 19.8, 20.8, 21.8, 18.8, 20.4, 22.1],
  },
  brunei: {
    population: 459000,
    gdp: 13183000000,
    energyIntensity: 0.18,
    production: 8.2,
    consumption: 4.5,
    imports: 1.2,
    exports: 4.9,
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
    historicalConsumption: [3.8, 3.9, 4.1, 4.2, 4.4, 4.1, 4.3, 4.5],
    historicalProduction: [7.1, 7.3, 7.5, 7.7, 7.9, 7.6, 7.9, 8.2],
    forecastYears: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030],
    forecastConsumption: [4.1, 4.3, 4.5, 4.7, 4.9, 5.1, 5.3, 5.5, 5.7, 5.9, 6.1],
    forecastProduction: [7.6, 7.9, 8.2, 8.5, 8.8, 9.1, 9.4, 9.7, 10.0, 10.3, 10.6],
  },
  cambodia: {
    population: 17424000,
    gdp: 34589000000,
    energyIntensity: 0.42,
    production: 7.8,
    consumption: 10.2,
    imports: 3.1,
    exports: 0.7,
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
    historicalConsumption: [7.3, 7.8, 8.4, 8.9, 9.5, 9.1, 9.6, 10.2],
    historicalProduction: [5.4, 5.8, 6.3, 6.7, 7.2, 6.9, 7.3, 7.8],
    forecastYears: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030],
    forecastConsumption: [9.1, 9.6, 10.2, 10.8, 11.4, 12.1, 12.8, 13.6, 14.4, 15.2, 16.1],
    forecastProduction: [6.9, 7.3, 7.8, 8.3, 8.8, 9.3, 9.9, 10.5, 11.1, 11.8, 12.5],
  },
  laos: {
    population: 7665000,
    gdp: 20304000000,
    energyIntensity: 0.38,
    production: 9.5,
    consumption: 6.8,
    imports: 1.5,
    exports: 4.2,
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
    historicalConsumption: [5.1, 5.4, 5.8, 6.1, 6.5, 6.2, 6.5, 6.8],
    historicalProduction: [7.3, 7.7, 8.2, 8.6, 9.1, 8.8, 9.1, 9.5],
    forecastYears: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030],
    forecastConsumption: [6.2, 6.5, 6.8, 7.2, 7.6, 8.0, 8.5, 9.0, 9.5, 10.0, 10.6],
    forecastProduction: [8.8, 9.1, 9.5, 10.0, 10.5, 11.0, 11.6, 12.2, 12.8, 13.5, 14.2],
  },
  myanmar: {
    population: 54134000,
    gdp: 63757000000,
    energyIntensity: 0.45,
    production: 18.7,
    consumption: 21.3,
    imports: 3.8,
    exports: 1.2,
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
    historicalConsumption: [16.3, 17.2, 18.2, 19.2, 20.3, 19.1, 20.2, 21.3],
    historicalProduction: [14.2, 15.0, 15.9, 16.8, 17.7, 16.7, 17.7, 18.7],
    forecastYears: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030],
    forecastConsumption: [19.1, 20.2, 21.3, 22.6, 23.9, 25.3, 26.8, 28.4, 30.0, 31.8, 33.7],
    forecastProduction: [16.7, 17.7, 18.7, 19.8, 21.0, 22.2, 23.5, 24.9, 26.4, 28.0, 29.6],
  },
]
