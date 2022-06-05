import {randomIntFromInterval} from '@/webgl/utils/RandowBetweenTwo'
import {convertPosition} from '@/webgl/utils/ConvertPosition'

export const addDaisys = (location, group, resource, isScene) => {
  for (let i = 0; i < location.length; i++) {
    const daisyClone = resource.clone()
    const daisySize = randomIntFromInterval(0.5, 1, 0.01)
    daisyClone.scale.set(daisySize, daisySize, daisySize)
    daisyClone.position.set(convertPosition(i, location).x, isScene ? -3 : -5, convertPosition(i, location).z)
    group.add(daisyClone)
  }
}

export const addLys = (location, group, resource, isScene) => {
  for (let i = 0; i < location.length; i++) {
    const lysClone = resource.clone()
    const lysSize = randomIntFromInterval(0.04, 0.08, 0.01)
    lysClone.scale.set(lysSize, lysSize, lysSize)
    lysClone.position.set(convertPosition(i, location).x, isScene ? -1.5 : -4, convertPosition(i, location).z)
    lysClone.rotation.set(0, Math.random(), Math.random() / 10)
    group.add(lysClone)
  }
}

export const addStones = (location, group, resource, isScene) => {
  for (let i = 0; i < location.length; i++) {
    const stoneClone = resource.clone()
    const stoneSize = randomIntFromInterval(0.8, 1.8, 0.01)
    stoneClone.scale.set(stoneSize, stoneSize, stoneSize)
    stoneClone.position.set(convertPosition(i, location).x, isScene ? -3 : -5, convertPosition(i, location).z)
    stoneClone.rotation.set(0, Math.random() * 50, Math.random() / 10)
    group.add(stoneClone)
  }
}

export const addTrees = (location, group, resource, isScene) => {
  for (let i = 0; i < location.length; i++) {
    const cloneTree = resource.clone()
    const treeSize = randomIntFromInterval(6.5, 9.5, 0.01)
    cloneTree.scale.set(treeSize, treeSize, treeSize)
    cloneTree.position.set(convertPosition(i, location).x, isScene ? -1.5 : -4, convertPosition(i, location).z)
    cloneTree.rotation.set(0, Math.random() * 25, Math.random() / 10)
    group.add(cloneTree)
  }
}

export const addMushrooms = (location, group, resource) => {
  for (let i = 0; i < location.length; i++) {
    const cloneMushroom = resource.clone()
    const mushroomSize = randomIntFromInterval(0.4,1, 0.01)
    cloneMushroom.scale.set(mushroomSize, mushroomSize, mushroomSize)
    cloneMushroom.position.set(convertPosition(i, location).x, -3.2, convertPosition(i, location).z)
    cloneMushroom.rotation.set(0, Math.random() * 25, 0)
    group.add(cloneMushroom)
  }
}

export const addNenuphar = (location, group, resource) => {
  for (let i = 0; i < location.length; i++) {
    const cloneNenuphar = resource.clone()
    const nenupharSize = randomIntFromInterval(0.3,0.5, 0.01)
    cloneNenuphar.scale.set(nenupharSize, nenupharSize, nenupharSize)
    cloneNenuphar.position.set(convertPosition(i, location).x, -2, convertPosition(i, location).z)
    cloneNenuphar.rotation.set(0, Math.random() * 50, Math.random() / 10)
    group.add(cloneNenuphar)
  }
}


export const addBridge = (location, group, resource) => {
  for (let i = 0; i < location.length; i++) {
    const cloneBridge = resource.clone()
    const bridgeSize = 2.3
    cloneBridge.scale.set(bridgeSize, bridgeSize, bridgeSize)
    cloneBridge.position.set(convertPosition(i, location).x, -2.5, convertPosition(i, location).z)
    cloneBridge.rotation.set(0, Math.PI, 0)
    group.add(cloneBridge)
  }
}