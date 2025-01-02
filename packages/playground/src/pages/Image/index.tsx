import { Image } from 'rmst-design'
import qwe from './qwe.jpg'

export default function ImageDd() {
  return (
    <div>
      <b>图片预览 (flip 动画)</b>

      <hr />

      <Image src={qwe} />

      <hr />

      <Image src="https://dummyimage.com/600x400/8896b8/ffffff.png"></Image>

      <hr />

      <Image src="https://dummyimage.com/400x600/94d1c7/ffffff.png"></Image>
      <hr />
    </div>
  )
}
