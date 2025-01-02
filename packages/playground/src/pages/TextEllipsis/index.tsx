import { Input, TextEllipsis } from 'rmst-design'
import My from './My/My'
import { useState } from 'react'

export default function TextEllipsisDd() {
  const [value, setValue] = useState(
    `  A design is a plan or   for the construction of an object or system or for the implementation of an activity or process, or the result of that plan or specification. A design is a plan or specification for the construction of an object or system or for the implementation of an activity or process, or the result of that plan or specification.`
  )

  return (
    <div>
      <b>单行</b>
      <My rows={1} />
      <hr />
      <b>2行</b>
      <My rows={2} />
      <hr />
      <b>3行</b>
      <My rows={3} />

      {/* <Input value={value} onChange={evt => setValue(evt.target.value)}></Input>
      <TextEllipsis rows={3}>{value}</TextEllipsis>
      <hr />
      <TextEllipsis rows={2}>{value}</TextEllipsis>
      <hr />
      <TextEllipsis rows={1} expandable={true ? { single: true } : true}>
        {value}
      </TextEllipsis> */}
    </div>
  )
}
