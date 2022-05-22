import mapSetting from '@/webgl/elementsLocations/mapSetting.json'

export const convertPosition = (i, location) => {
  const map = {
    width: mapSetting[0].right,
    height: mapSetting[0].bottom,
    ratio: 5,
  }

  return {
    z: location[i].centerY / map.ratio,
    x: (location[i].centerX / map.ratio) - map.width / map.ratio / 2
  }
}