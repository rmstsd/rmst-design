import Image from 'next/image'

export function Person({ Hero_BG, Hero_FG, name, desc_1, desc_2 }) {
  return (
    <div className="relative h-screen mt-20" style={{ maskImage: 'linear-gradient(180deg,#000 80%,transparent)' }}>
      <Image
        src={Hero_BG}
        alt=""
        className="w-full h-full absolute object-cover"
        style={{ maskImage: 'linear-gradient(246deg,#000 30%,rgba(0,0,0,.35) 72%)' }}
      />
      <Image src={Hero_FG} alt="" className="absolute right-0 bottom-0 h-full w-auto " />

      <section className="absolute w-[300px] left-[10vw] top-[300px]">
        <div className="text-7xl font-bold" style={{ color: '#fff9cb' }}>
          {name}
        </div>
        <div className="text-3xl leading-normal font-bold mt-4" style={{ color: '#91dfec' }}>
          {desc_1}
        </div>

        <div className="text-3xl text-white mt-4">{desc_2}</div>
      </section>
    </div>
  )
}
