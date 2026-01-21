export interface SkuBase {
  attr: string
  values: string[]
}
export function getAllSku(arr: SkuBase[]) {
  if (!arr.length) {
    return []
  }

  const ans = []
  backTrack(0, {})
  return ans

  function backTrack(idx, temp) {
    if (idx === arr.length) {
      ans.push({ ...temp })
      return
    }

    const cur = arr[idx]

    for (const item of cur.values) {
      temp[cur.attr] = item
      backTrack(idx + 1, temp)
    }
  }
}
