export function fadeOutAndRemoveSprite (sprite, app) {
  if (!sprite) return
  let fadeSpeed = 0.02

  const fadeTicker = () => {
    sprite.alpha -= fadeSpeed

    if (sprite.alpha <= 0) {
      app.stage.removeChild(sprite)
      sprite.destroy()
      app.ticker.remove(fadeOutAndRemoveSprite)
    }
  }

  app.ticker.add(fadeTicker)
}

// CursorHider : Hides the cursor if the mouse isn't moved for a given time (in ms); otherwise, for 2000 ms (2s).

export class CursorHider{

  constructor(timeOutDirection = 2000){

    this.timeOutDirection = timeOutDirection;

    // Setting a varible null to reference the setTimeOut function
    this.timeOut = null;
    document.addEventListener("mousemove",this.showCursor.bind(this));

    //Start the initial timer for the mouse to hide
    this.startTimeOut();
  }

  hideCursor(){
    document.body.style.cursor="none";
  }

  showCursor(){
    document.body.style.cursor="";
    this.resetTimeOut();
  }

  startTimeOut(){
    this.timeOut = setTimeout(()=>this.hideCursor(),this.timeOutDirection);
  }

  resetTimeOut(){
    clearTimeout(this.timeOut);
    this.startTimeOut();

  }

}