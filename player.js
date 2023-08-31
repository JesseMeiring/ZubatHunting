class Player{
  constructor(startingTile, sprite, spritePath){
    this.tile = startingTile
    this.tile.sprites.push(this)
    this.sprite = sprite
    this.visible = true
    this.spritePath = spritePath
  }
  
  move(tile){
    //remove self from old tile contents
    const indexOfThis = this.tile.sprites.indexOf(this)
    if(indexOfThis > -1) this.tile.sprites.splice(indexOfThis, 1)
    
    //change this Trainers tile
    this.tile = tile
    
    //Add self to tile contents
    this.tile.sprites.push(this)
  }
}