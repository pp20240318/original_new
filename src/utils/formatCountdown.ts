export function formatCountdown(totalSeconds: number) {
  const days = Math.floor(totalSeconds / (24 * 60 * 60))
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60)).toString().padStart(2, '0')
  const minutes = Math.floor(((totalSeconds % (24 * 60 * 60)) % (60 * 60)) / 60).toString().padStart(2, '0')
  const seconds = Math.floor(((totalSeconds % (24 * 60 * 60)) % (60 * 60)) % 60).toString().padStart(2, '0')
  const [h1, h2] = hours.split('').map(n => +n)
  const [m1, m2] = minutes.split('').map(n => +n)
  const [s1, s2] = seconds.split('').map(n => +n)
  return { days, h1, h2, m1, m2, s1, s2 }
}
