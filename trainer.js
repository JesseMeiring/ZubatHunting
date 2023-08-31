class Trainer{
  constructor(startingTile, sprite, spritePath){
    this.tile = startingTile
    this.tile.sprites.push(this)
    this.sprite = sprite
    this.timesStealthed = 0
    this.visible = true
    this.spritePath = spritePath
    this.progress = 0
  }
  
  get move(){
    let closerTiles = []
    let sameDistTiles = []
    let backStepTiles = []
    
    //place all tiles into the appropiate array based on thier distance to the end
    for(let n of this.tile.neighbors){
      if(this.tile.distToSafe > n.distToSafe && n.type != 5) closerTiles.push(n)
      if(this.tile.distToSafe == n.distToSafe && n.type != 5) sameDistTiles.push(n)
      if(this.tile.distToSafe < n.distToSafe && n.type != 5) backStepTiles.push(n)
    }
    
    let forwardPossible = closerTiles.length > 0
    let strafePossible = sameDistTiles.length > 0
    let backwardsPossible = backStepTiles.length > 0
    
    //console.log(`forwardPossible: ${forwardPossible}, strafePossible: ${strafePossible}, backwardsPossible: ${backwardsPossible}`)
    
    //remove self from old tile contents
    const indexOfThis = this.tile.sprites.indexOf(this)
    if(indexOfThis > -1) this.tile.sprites.splice(indexOfThis, 1)
    
    //change this Trainers tile
    let roll = Math.floor(Math.random() * 10) - this.progress
    let intent
    if(roll > 0) {
      intent = "Forward"
    } else if(roll > -2) {
      intent = "Strafe"
    } else {
      intent = "Backward"
    }
    
    
    let direction
    switch(intent){
      case "Backward":
        if(backwardsPossible) {
          direction = "Backward" 
        } else if(strafePossible) {
          direction = "Strafe"
        } else {
          direction = "Forward"
        }
        break
      case "Strafe":
        if(strafePossible) {
          direction = "Strafe" 
        } else if(backwardsPossible) {
          direction = "Backward"
        } else {
          direction = "Forward"
        }
        break
      case "Forward":
        if(forwardPossible) {
          direction = "Forward" 
        } else if(strafePossible) {
          direction = "Strafe"
        } else {
          direction = "Backward"
        }
        break        
    }
    console.log(`Trainer rolled a ${roll + this.progress}, minus progress of ${this.progress}, gives an intent of ${intent}, 
the direction becomes ${direction}`)
    
    if(direction == "Forward")   {
      this.tile = closerTiles[Math.floor(Math.random()*closerTiles.length)];
      this.progress++
    }
    if(direction == "Strafe")   this.tile = sameDistTiles[Math.floor(Math.random()*sameDistTiles.length)];
    if(direction == "Backward") {
      this.tile = backStepTiles[Math.floor(Math.random()*backStepTiles.length)];
      this.progress = 0
    }
    
    //Add self to tile contents
    this.tile.sprites.push(this)
    
    //make Noise
    return this.makeNoise()
  }
  
  makeNoise(){
    switch(this.tile.type){
      case 0: 
        return `Water`
      break
      case 2:
        return `Escaped`
      break
      default:
        let roll = Math.floor(Math.random() * 10)
        //console.log(`roll ${roll}`)
        if(roll + this.timesStealthed > 7) {    
          this.timesStealthed = -2
          return `${this.tile.label}`
        } else {
          this.timesStealthed++
          return `Rocky`
        }
      break
    }
  }
}