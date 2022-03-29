export class Counter {
  private value: number = 0

  increment (): void {
    this.value++
  }

  decrement (): void {
    this.value--
  }

  get isZero (): boolean {
    return this.value === 0
  }
}
