import { Component } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({ selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.css'] })
export class AppComponent {

  // currect state of the game: 0 - no game, 1 - game started, 2 - game lost
  gameStatus: number = 0;
  gameLives: number = 0;
  gameTime: number = 15;
  iniTime: number;
  timeLeft: number = 0;
  subscriptionTimer: Subscription;
  level: number;

  showEmoji: boolean;
  icons: Array<string> = ['accessibility', 'account_balance', 'anchor', 'build', 'grade', 'leaderboard', 'pets', 'schedule', 'phone', 'create'];
  emoji: Array<string> = ['😂', '💩', '😈', '🤬', '🤙', '💃', '🐖', '🙈', '🍓', '🥑'];
  nums: Array<number>;

  taskLeft: {left: number, operator: number, right: number};
  taskRight: {left: number, operator: number, right: number};

  constructor(private _snackBar: MatSnackBar) {
    this.showEmoji = true;
  }

  public startGame(): void {
    if(this.subscriptionTimer) this.subscriptionTimer.unsubscribe();
    this.gameStatus = 1;
    this.gameLives = 5;
    this.level = 1;
    this.iniTime = this.gameTime;
    this.timeLeft = this.iniTime;

    this.generateTasks();

    this.observeTimer();
  };

  public stopGame(): void {
    this.gameStatus = 0;
    if(this.subscriptionTimer) this.subscriptionTimer.unsubscribe();
  };

  public getAnswer(val): void {
    let ans;

    var condition = {
      0: (a, b) => a + b,
      1: (a, b) => a - b,
      2: (a, b) => a * b
    }

    let left = condition[this.taskLeft.operator](this.taskLeft.left, this.taskLeft.right);
    let right = condition[this.taskRight.operator](this.taskRight.left, this.taskRight.right);

    switch (val) {
      case 'left':
        ans = left < right;
        break;
      case 'right':
        ans = left > right;
        break;
      default:
        this.stopGame();
        return;
    }

    this.nextLevel(ans);
  }

  public getSign(id: number): string {
    let sign;
    switch (id) {
      case 0: sign = '+'; break
      case 1: sign = '-'; break
      case 2: sign = '*'; break
      default: sign = 'error'; break;
    }
    return sign;
  }

  private observeTimer() {
    const source = timer(0, 1000);
    this.subscriptionTimer = source.subscribe(val => {
      this.timeLeft = this.iniTime - val;
      if(this.timeLeft < 1) this.nextLevel(true);
    });
  }

  private nextLevel(noAnswer?: boolean): void {
    this.level++;

    this.subscriptionTimer.unsubscribe();

    if(noAnswer) this.gameLives--;

    let subtr = Math.floor(this.level/5);
    this.iniTime = (this.gameTime - subtr > 5) ? this.gameTime - subtr : 5;

    if(this.gameLives < 1) {
      this.gameStatus = 2;  // game lost
    } else {
      this.generateTasks();
      this.observeTimer();  // restart timer
    }
  }

  private generateTasks(): void {
    let numbers = [...Array(10).keys()];
    this.nums = numbers.sort(()=>Math.random()-0.5);      // shuffle numbers
    this.icons = this.icons.sort(()=>Math.random()-0.5);  // shuffle icons
    this.generateConditions();
  }

  private generateConditions(): void {

    let sign = Math.floor(Math.random() * 3);

    this.taskLeft = {
      left: this.nums[Math.floor(Math.random() * 10)],
      operator: sign,
      right: this.nums[Math.floor(Math.random() * 10)]
    }

    this.taskRight = {
      left: this.nums[Math.floor(Math.random() * 10)],
      operator: sign,
      right: this.nums[Math.floor(Math.random() * 10)]
    }
  }

  public showMessage(message: string): void {
    this._snackBar.open(message, 'Got ya', { duration: 2000 });
  }

  public changeToggle(e: MatSlideToggleChange): void { this.showEmoji = e.checked; }


}
