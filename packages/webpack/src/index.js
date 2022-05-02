export default function add (pre, after) {
  let preLength = pre.length - 1
  let afterLength = after.length - 1
  let carry = 0
  let ret = ''
  while (preLength >= 0 || afterLength >= 0) {
    if(preLength >= 0 || afterLength >= 0) {
      let x = 0
      let y = 0
      let sum
      if(preLength >= 0) {
        x = pre[preLength] - '0'
        preLength --
      }
      if(afterLength >= 0) {
        y = after[afterLength] - '0'
        afterLength --
      }

      sum = x + y + carry
      if(sum >= 10) {
        carry = 1
        sum -= 10
      } else {
        carry = 0
      }
      ret = sum + ret
    }
    if(carry){
      ret = carry + ret
    }
  }
  return ret
}