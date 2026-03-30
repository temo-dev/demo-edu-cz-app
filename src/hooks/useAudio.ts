import { useCallback } from 'react'

export function useAudio() {
  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'cs-CZ'
    utter.rate = 0.85
    utter.pitch = 1
    window.speechSynthesis.speak(utter)
  }, [])

  const speakSlow = useCallback((text: string) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'cs-CZ'
    utter.rate = 0.45
    utter.pitch = 1
    window.speechSynthesis.speak(utter)
  }, [])

  return { speak, speakSlow }
}
