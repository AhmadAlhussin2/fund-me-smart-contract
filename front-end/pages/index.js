import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import NavBar from '@/components/NavBar'
import StartFundRaise from '@/components/StartFundRaise'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Fund me ETH</title>
        <meta name="description" content="decentralized funding website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/donate-icon.ico" />
      </Head>
      <NavBar />
      <div className="container">
        <StartFundRaise/>
      </div>
    </>
  )
}
