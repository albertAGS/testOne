import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Block {
  digits: number;
  letters: number;
  start: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>License Plate Generator</h1>
      <div *ngFor="let test of testCases" class="test-case">
        <div class="input">{{ test.input | number }} →</div>
        <div class="result">{{ getNthPlate(test.input) }}</div>
        <div class="expected">Expected: {{ test.expected }}</div>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 20px;
        font-family: Arial;
      }
      .test-case {
        display: flex;
        gap: 15px;
        margin: 10px 0;
      }
      .result {
        font-weight: bold;
        min-width: 120px;
      }
      .expected {
        color: #666;
      }
    `,
  ],
})
export class AppComponent {
  private readonly firstBlock = [{ digits: 6, letters: 0, start: 0 }];
  private readonly letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private readonly blocks: Block[] = this.buildBlock(this.firstBlock);

  testCases = [
    { input: 0, expected: '000000' },
    { input: 999_999, expected: '999999' },
    { input: 1_000_000, expected: '00000A' },
    { input: 1_099_999, expected: '99999A' },
    { input: 1_100_000, expected: '00000B' },
    { input: 3_500_000, expected: '00000Z' },
    { input: 3_544_000, expected: '44000Z' },
    { input: 3_599_999, expected: '99999Z' },
    { input: 3_600_000, expected: '0000AA' },
    { input: 3_600_001, expected: '0001AA' },
    { input: 10_359_999, expected: '9999ZZ' },
  ];

  public buildBlock(block: Block[]): Block[] {
    const lastBlock = block[block.length - 1];
    if (lastBlock.digits === 0) return block;
    const start =
      10 ** lastBlock.digits * this.letters.length ** lastBlock.letters +
      lastBlock.start;
    const newBlock = {
      start,
      digits: lastBlock.digits - 1,
      letters: lastBlock.letters + 1,
    };
    block.push(newBlock);
    return this.buildBlock(block);
  }

  public getNthPlate(n: number): string {
    console.log(this.blocks);
    if (n < 0) return 'Invalid input';

    const block = this.blocks.find(
      (b) =>
        n >= b.start &&
        n < (this.blocks[this.blocks.indexOf(b) + 1]?.start ?? Infinity)
    )!;

    const offset = n - block.start;
    const numberPart = this.getNumberPart(offset, block.digits);
    const letterPart = this.getLetterPart(offset, block.digits, block.letters);

    return numberPart + letterPart;
  }

  private getNumberPart(offset: number, digits: number): string {
    if (digits === 0) return '';
    const maxNumbers = 10 ** digits;
    return (offset % maxNumbers).toString().padStart(digits, '0');
  }

  private getLetterPart(
    offset: number,
    digits: number,
    letterCount: number
  ): string {
    if (letterCount === 0) return '';

    const letterValue = Math.floor(offset / 10 ** digits);
    let remaining = letterValue;
    let letters = '';

    for (let i = 0; i < letterCount; i++) {
      const charCode = remaining % 26;
      letters = this.letters[charCode] + letters;
      remaining = Math.floor(remaining / 26);
    }
    return letters;
  }
}
