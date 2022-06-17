import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import {collection, getDocs, query} from "firebase/firestore"
import EventEmitter from "../webgl/utils/EventEmitter"

/**
 * Firebase
 */ 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLvjGYVP94kXOyMyq4oNoOtcDNDQZ3jNg",
  authDomain: "more-than-honey.firebaseapp.com",
  projectId: "more-than-honey",
  storageBucket: "more-than-honey.appspot.com",
  messagingSenderId: "641189547986",
  appId: "1:641189547986:web:12e33d2f892d2deb8f020b"
}

let Instance = null

export class leaderBoard extends EventEmitter {
  constructor(){

    // Singleton
    if(Instance){
      return Instance
    }
    
    super()
    
    Instance = this

    this.result = []
    this.isInputset = false

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig)
  }

  async getData(){
    const q = query(collection(firebase.firestore(), "pollenGame"))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      this.result.push(doc.data())
    })
    this.result.sort((a, b) => {
      return b.score - a.score
    })

    this.trigger(`dataLeaderBordReady`)
  }

  addInputUser(index){
    const userScore =  parseInt(document.querySelector('.count > p').innerHTML)
    const list = document.createElement("div")
      list.classList.add('inputList')
      const classementPlayer = document.createElement("span")
      const div = document.createElement("div")

      if ( (index+1) <= 3) {
        const img = document.createElement("img")
        img.src = `/images/pollenGame/bee${index+1}.svg`
        div.appendChild(img)
      }

      const pseudo = document.createElement("input")
      pseudo.maxLength = 14
      pseudo.placeholder = 'Votre Nom ...'

      const score = document.createElement("span")
      score.classList.add('scoreUser')
      score.innerHTML = userScore

      const classement = index+1 === 1 ? index+1 + 'er' : index+1 + 'e' 
      classementPlayer.innerHTML = classement

      div.appendChild(pseudo)
      div.appendChild(score)
      list.appendChild(classementPlayer)
      list.appendChild(div)
      this.container.appendChild(list)
      this.isInputset = true 
  }

  addClassement(){
    this.container = document.querySelector('.score')
    const userScore =  parseInt(document.querySelector('.count > p').innerHTML)

    this.result.forEach((element, index) => {
      if (!this.isInputset && element.score < userScore) {
        this.addInputUser(index)
      }

      const list = document.createElement("div")
      const classementPlayer = document.createElement("span")
      const div = document.createElement("div")

      if ( (!this.isInputset ? index+1 : index+2 ) <= 3) {
        const img = document.createElement("img")
        img.src = `/images/pollenGame/bee${!this.isInputset ? index+1 : index+2}.svg`
        div.appendChild(img)
      }

      const pseudo = document.createElement("span")
      pseudo.innerHTML = element.pseudo

      const score = document.createElement("span")
      score.classList.add('scoreUser')
      score.innerHTML = element.score

      const classement = index+1 === 1 ? !this.isInputset ? index+1 + 'er' : index+2 + 'e' : !this.isInputset ? index+1 + 'e' : index+2 + 'e'
      classementPlayer.innerHTML = classement

      div.appendChild(pseudo)
      div.appendChild(score)
      list.appendChild(classementPlayer)
      list.appendChild(div)
      this.container.appendChild(list)
    })
    if (!this.isInputset ) {
      this.addInputUser(this.result.length)
    }

    document.getElementsByClassName('score')[0].classList.remove('u-hidden')
    document.getElementsByClassName('chrono')[0].classList.add('u-hidden')
  }
}