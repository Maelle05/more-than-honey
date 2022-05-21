import {CustomEase} from 'gsap/all'
import gsap from 'gsap'

gsap.registerPlugin(CustomEase)

export const customEase = CustomEase.create("custom", "M0,0,C0,0,0.01,0.133,0.032,0.236,0.037,0.261,0.058,0.319,0.07,0.34,0.077,0.355,0.167,0.538,0.246,0.32,0.272,0.248,0.282,0.16,0.362,0.122,0.448,0.08,0.584,0.184,0.672,0.196,0.876,0.223,1,0,1,0")
