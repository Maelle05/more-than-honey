import {randomIntFromInterval} from '@/webgl/utils/RandowBetweenTwo'
import {convertPosition} from '@/webgl/utils/ConvertPosition'
import stoneLocation from '@/webgl/elementsLocations/raceGame/stone-race.json'
import treeLocation from '@/webgl/elementsLocations/raceGame/tree-race.json'

export const addDaisys = (location, group, resource) => {
  for (let i = 0; i < location.length; i++) {
    const daisyClone = resource.clone()
    const daisySize = randomIntFromInterval(0.5, 1, 0.01)
    daisyClone.scale.set(daisySize, daisySize, daisySize)
    daisyClone.position.set(convertPosition(i, location).x, -5, convertPosition(i, location).z)
    group.add(daisyClone)
  }
}

export const addLys = (location, group, resource) => {
  for (let i = 0; i < location.length; i++) {
    const lysClone = resource.clone()
    const lysSize = randomIntFromInterval(0.05, 0.1, 0.01)
    lysClone.scale.set(lysSize, lysSize, lysSize)
    lysClone.position.set(convertPosition(i, location).x, -4, convertPosition(i, location).z)
    lysClone.rotation.set(0, Math.random(), Math.random() / 10)
    group.add(lysClone)
  }
}

export const addStones = (location, group, resource) => {
  for (let i = 0; i < stoneLocation.length; i++) {
    const stoneClone = resource.clone()
    const stoneSize = randomIntFromInterval(0.8, 1.8, 0.01)
    stoneClone.scale.set(stoneSize, stoneSize, stoneSize)
    stoneClone.position.set(convertPosition(i, location).x, -5, convertPosition(i, location).z)
    stoneClone.rotation.set(0, Math.random() * 50, Math.random() / 10)
    group.add(stoneClone)
  }
}

export const addTrees = (location, group, resource) => {
  for (let i = 0; i < treeLocation.length; i++) {
    const cloneTree = resource.clone()
    const treeSize = randomIntFromInterval(6.5, 9.5, 0.01)
    cloneTree.scale.set(treeSize, treeSize, treeSize)
    cloneTree.position.set(convertPosition(i, location).x, -4, convertPosition(i, location).z)
    cloneTree.rotation.set(0, Math.random() * 25, Math.random() / 10)
    group.add(cloneTree)
  }
}

