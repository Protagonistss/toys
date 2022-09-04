interface IMain {
   sum :(nums: number[]) => number,
   recurseSum: (nums: number[], cur: number) => number
}

class Main implements IMain {
  sum (nums: number[]) {
    let sum = 0
    nums.forEach((num: number) => sum += num)
    return sum
  }
  recurseSum (nums: number[], cur: number): number {
    if (cur === nums.length) return 0
    return nums[cur] + this.recurseSum(nums, cur + 1)
  }
}

const main = new  Main()

console.log(main.sum([1, 2, 3, 4]))
console.log(main.recurseSum([2, 3, 4, 5], 0))