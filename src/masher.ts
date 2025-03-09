export class Masher {
  n: number = 0xefc8249d;

  constructor() {}

  mash(data: string | number): number {
    data = data.toString();

    let index: number = 0;
    while (index < data.length) {
      this.n += data.charCodeAt(index);

      let h: number = 0.02519603282416938 * this.n;
      this.n = h >>> 0;
      h -= this.n;
      h *= this.n;
      this.n = h >>> 0;
      h -= this.n;
      this.n += h * 0x100000000;

      index++;
    }

    return (this.n >>> 0) * 2.3283064365386963e-10;
  }
}
