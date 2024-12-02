import { Image } from 'rmst-design'
import qwe from './qwe.jpg'

export default function ImageDd() {
  return (
    <div>
      <Image src={qwe} />

      <hr />

      <Image src="https://dummyimage.com/600x400/8896b8/ffffff.png"></Image>

      <hr />

      <Image src="https://dummyimage.com/400x600/94d1c7/ffffff.png"></Image>
      <hr />
    </div>
  )
}
