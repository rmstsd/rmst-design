import { Image } from 'rmst-design'
import starSky from './assets/starSky.png'
import wallpaper_7 from './assets/wallpaper_7.png'

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

      <div className="flex gap-2 items-start">
        <Image src={starSky.src} style={{ width: 400, objectFit: 'cover' }}></Image>
        <Image src={wallpaper_7.src} style={{ width: 200, objectFit: 'cover' }}></Image>
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
