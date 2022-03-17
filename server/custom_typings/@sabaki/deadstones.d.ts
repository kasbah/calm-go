declare module "@sabaki/deadstones" {
  export function guess(
    data: number[][],
    options?: Partial<{ finished: boolean; iterations: number }>
  ): Promise<number[][]>;
}
