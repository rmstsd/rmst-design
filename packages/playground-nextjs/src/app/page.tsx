import Image from 'next/image'

import lyy from '@/assets/lyy.jpg'

export default async function Home() {
  // 随机数据
  const res = await fetch('https://api.github.com/users/rmstsd')
  const data = await res.json()

  return (
    <div className="p-4">
      <center>Home</center>

      <Image src={data.avatar_url} width={100} height={100} alt="" />

      <Image src={lyy} alt="" style={{ objectFit: 'cover', width: 100, height: 100 }} />

      <div className="relative" style={{ width: 400, aspectRatio: 1.5 }}>
        <Image src="/lyy.jpg" alt="" fill style={{ objectFit: 'cover' }} decoding="async" />
      </div>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
