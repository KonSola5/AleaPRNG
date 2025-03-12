import { Masher } from "./masher.ts";

/**
 * A seedable pseudo-random number generator that can generate pseudo-random numbers with at least 32-bit precision.
 * Original algorithm by Johannes Baagøe (MIT license).
 * TypeScript version by KonSola5 (MIT license)
 * @author Johannes Baagøe <baagoe@baagoe.com>
 * @author KonSola5
 * @version 1.0
 */
export class AleaPRNG {
  private s: [number, number, number] = [0, 0, 0];
  private c: number = 0;
  private initialSeeds: (string | number)[];

  /**
   * Initializes the generator.
   * @param seeds Seeds used to initialize the generator.
   */
  constructor(...seeds: (string | number)[]) {
    this.initialSeeds = seeds;
    this.initialize(seeds);
  }

  /**
   * Initializes the generator.
   * @param seeds Seeds used to initialize the generator.
   */
  private initialize(seeds: (string | number)[]): void {
    this.s = [0, 0, 0];
    this.c = 0;
    if (seeds.length === 0) seeds.push(Number(new Date()));

    let masher: Masher | null = new Masher();

    for (let i: number = 0; i < this.s.length; i++) {
      this.s[i] = masher.mash(" ");
    }

    for (const seed of seeds) {
      for (let i: number = 0; i < this.s.length; i++) {
        this.s[i] -= masher.mash(seed);
        if (this.s[i] < 0) this.s[i] += 1;
      }
    }

    masher = null;
  }

  /** This generator's iterator. */
  public [Symbol.iterator](): this {
    return this;
  }

  /**
   * Function used to iterate through this generator.
   */
  public next(): { done: boolean; value: number } {
    const t: number = 2091639 * this.s[0] + this.c * 2.3283064365386963e-10; // 2^-32
    this.s[0] = this.s[1];
    this.s[1] = this.s[2];
    this.c = t | 0;
    this.s[2] = t - this.c;
    return { done: false, value: this.s[2] };
  }

  /**
   * Generates a 32-bit pseudo-random fraction.
   * @returns A 32-bit pseudo-random fraction between 0 and 1.
   */
  public nextValue(): number {
    return this.next().value;
  }

  /**
   * Generates a 32-bit pseudo-random unsigned integer.
   * @returns A 32-bit pseudo-random unsigned integer between 0 and 4294967296.
   */
  public nextUint32(): number {
    return this.nextValue() * 0x100000000; // 2^32
  }

  /**
   * Generates a 53-bit pseudo-random fraction. Advances the generator twice.
   * @returns A 53-bit pseudo-random fraction between 0 and 1.
   */
  public nextFract53(): number {
    return this.nextValue() + ((this.nextValue() * 0x200000) | 0) * 1.1102230246251565e-16; // 2^-53
  }

  /**
   * Advances the generator the specified amount of times, at least once, and discards the results.
   * @param times How many times should the generator be advanced. Defaults to 1 if not provided or less than 1.
   */
  public advance(times: number = 1): void {
    if (times < 1) times = 1;
    times = Math.floor(times);
    let rolls: number = 0;
    for (const _randomNumber of this) {
      if (rolls > times) break;
      rolls++;
    }
  }

  /**
   * Creates a new generator which can generate the specified amount of pseudo-random numbers.
   * @param amountOfNumbers How many numbers should the generator yield. Defaults to 1 if not provided or less than 1.
   */
  public *generate(amountOfNumbers: number = 1): Generator<number, void, unknown> {
    if (amountOfNumbers < 1) amountOfNumbers = 1;
    amountOfNumbers = Math.floor(amountOfNumbers);
    let rolls: number = 0;
    for (const randomNumber of this) {
      if (rolls > amountOfNumbers) break;
      yield randomNumber;
      rolls++;
    }
  }

  /**
   * Resets the generator to its initial state.
   */
  public reset(): void {
    this.initialize(this.initialSeeds);
  }
}
