import { useState } from 'react'
import './sty.less'

export default function My() {
  const [show, setShow] = useState(false)

  return (
    <div className="my">
      <span className='text'>
        A design is a plan or specification for the construction of an object or system or for the implementation of an
        activity or process, or the result of that plan or specification in the form of a prototype, product or process.
        The verb to design expresses the process of developing a design. The verb to design expresses the process of
        developing a design. A design is a plan or specification for the construction of an object or system or for the
        implementation of an activity or process, or the result of that plan or specification in the form of a
        prototype, product or process. The verb to design expresses the process of developing a design. The verb to
        design expresses the process of developing a design.
      </span>

      <span className="show-btn" onClick={() => setShow(!show)}>
        展开
      </span>
    </div>
  )
}
