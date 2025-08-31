import type { AppProps } from 'next/app'
import '../app/globals.css'
import { AttendeeProvider } from './attendees/AttendeeContext'
import { ToastProvider } from '../contexts/ToastContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ToastProvider>
      <AttendeeProvider>
        <Component {...pageProps} />
      </AttendeeProvider>
    </ToastProvider>
  )
}
