import { Image } from 'rmst-design'

export default function ImageDd() {
  return (
    <div>
      <b>图片预览 (flip 动画)</b>

      <div className=" flex gap-2 items-start">
        <Image className="bg-gray-100" src="/qwe.jpg" style={{ width: 100, height: 100, objectFit: 'fill' }} />

        <Image className="bg-gray-100" src="/qwe.jpg" style={{ width: 200, height: 100, objectFit: 'contain' }} />

        <Image className="bg-gray-100" src="/qwe.jpg" style={{ width: 100, height: 200, objectFit: 'cover' }} />
        <Image className="bg-gray-100" src="/qwe.jpg" style={{ width: 100, height: 200, objectFit: 'none' }} />
        <Image className="bg-gray-100" src="/qwe.jpg" style={{ width: 100, height: 200, objectFit: 'scale-down' }} />
      </div>

      <div className="flex gap-2">
        <Image
          src="https://dummyimage.com/600x400/8896b8/ffffff.png"
          style={{ width: 100, height: 100, objectFit: 'cover' }}
        ></Image>
        <Image
          src="https://dummyimage.com/400x600/94d1c7/ffffff.png"
          style={{ width: 100, height: 100, objectFit: 'cover' }}
        ></Image>
      </div>
    </div>
  )
}
