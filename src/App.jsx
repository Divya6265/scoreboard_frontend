import { useState, useEffect } from 'react'
import { players } from './dummydata'
function App() {
  const [data, setData] = useState(players)
  const [topper, setTopper] = useState({})

  useEffect(() => {

    setData((prevData) =>
      prevData.map((player) => {
        let username = player.name
        const avatarUrl = `https://robohash.org/${username}.png`;
        console.log('player avatar', avatarUrl)
        return { ...player, avatar: avatarUrl }
      })
    );
  }, [])

  console.log(data,'avatar')

  useEffect(() => {
    const events = new EventSource("https://scoreboard-server-owrr.onrender.com/event")

    events.addEventListener('add', (e) => {
      const parseData = JSON.parse(e.data)
      setData((prevData) =>
        prevData.map((player) =>
          player.player_Id == parseData.player_Id ? { ...player, score: parseData.score } : player
        )
      )
    })

    events.addEventListener('update', (e) => {
      const parseData = JSON.parse(e.data)
      setData((prevData) =>
        prevData.map((player) =>
          player.player_Id === parseData.player_Id ? { ...player, score: parseData.score } : player
        )
      )
    })

    // events.addEventListener('topper', (e) => {
    //   const topper = JSON.parse(e.data)
    //   setTopper(topper)
    //   console.log(topper) 
    // })

    events.onerror = (event) => {
      console.error("Error occured", event)
    }
    return () => {
      events.close()
    }
  }, [])

  useEffect(() => {
    const topperss = () => {
      let player_Id = 0
      let max = -1
      data.map(player => {
        if (player.score > max) {
          max = player.score
          player_Id = player.player_Id
        }
      })

      setTopper({ player_Id, max })
    }
    topperss()

  }, [data])

  return (
    <div className=' bg-[#1F2937] text-white font-poppins text-xl flex flex-col justify-center items-center text-center pt-4'>
      <p className='text-2xl md:text-4xl font-roboto '>Leader Board Of Game Of Thrones</p>
      <p className='capitalize text-md p-3 text-[#515862] text-center px-2'>The Top Scorer Of The Game Of Thrones Is Player With ID <span className='text-[#ffffff65]'>{topper.player_Id !== 0 ? topper.player_Id : "--"}</span> Scored <span className='text-[#ffffff65]'>{topper.max !== -1 ? topper.max : '--'} </span>  max points </p>
      <div className='p-4 w-full md:w-200'>
        {data.map((item) => {
          return <p key={item.player_Id} className='bg-[#ffffff33] even:bg-[#ffffff55] my-3 px-3 py-2 rounded w-full flex justify-around items-center transition-all duration-75 hover:bg-[#00000033] hover:cursor-pointer text-center' ><span className='w-10'>{item.player_Id}</span> 
          <span  className=' flex flex-row items-center  gap-x-5'>
          <span className='w-10'>
            <img src={item.avatar} alt="" className='object-cover h-8 rounded-full' />
          </span> <span className='w-30 '>{item.name}</span>
          </span>
           <span className='w-10'>{item.score != undefined ? item.score : '--'}</span> </p>
        })}
      </div>
    </div>
  )
}

export default App
