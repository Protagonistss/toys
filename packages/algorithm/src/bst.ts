class _Node {
  public val: number | null
  public left: _Node = this
  public right: _Node = this

  constructor (val: number | null) {
    this.val = val
  }
}

class Bst {
  main () {
    const arr = [1, 2, 3, 4, 5, 6, 7 ]
    const ret = this.buildTree(arr, 0, arr.length - 1)
    console.log(ret)
  }
  buildTree (arr: number[], li: number, hi: number) {
    if (li > hi) return new _Node(null)
    const mi = li + (hi - li) / 2
    const root = new _Node(arr[mi])
    root.left = this.buildTree(arr, li, mi - 1)
    root.right = this.buildTree(arr, mi + 1, hi)
    return root
  }
}

const bst = new Bst()
bst.main()
