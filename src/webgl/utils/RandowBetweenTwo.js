// Rand a number included between two value
export const randomIntFromInterval = (min, max, interval) => {
  if (typeof(interval)==='undefined') interval = 1
  const rand = Math.floor(Math.random()*(max - min + interval) / interval)
  return rand * interval + min
}