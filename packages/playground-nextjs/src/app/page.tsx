import Image from 'next/image'

export default async function Home() {
  console.log(fetch)

  console.log(async function Aa() {})

  // 随机数据
  const res = await fetch('https://api.github.com/users/rmstsd')
  const data = await res.json()

  return (
    <div className="p-4">
      <center>Home</center>

      <Image src={data.avatar_url} width={100} height={100} alt="" />

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
