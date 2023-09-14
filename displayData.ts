export class DisplayData{
    showLabels: boolean
    colorTileOutlines: boolean
    showColorTypes: boolean
    tileColorOpacity: number

    constructor(showLabels: boolean, 
      colorTileOutlines: boolean, 
      showColorTypes: boolean, 
      colorTileOpacity: number
    ){
      this.showLabels = showLabels
      this.colorTileOutlines = colorTileOutlines
      this.showColorTypes = showColorTypes
      this.tileColorOpacity = colorTileOpacity
    }
  }