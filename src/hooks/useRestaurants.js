import { useCallback, useEffect, useState } from 'react'
import { sheetParser } from '../utils/sheetParser'

const GOOGLE_SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQZ5ewZpT_FcAuxKGMpe_MbX5oKwAvZyunvXDC6qvwAy_h5tlzVAVYAZK1Y7KvZ4S08XXZCLfp9Ssri/pub?output=csv'

const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const retry = useCallback(() => {
    setReloadKey((prev) => prev + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    const fetchRestaurants = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL, {
          method: 'GET',
          signal: controller.signal,
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`)
        }

        const csvText = await response.text()
        const parsedRows = sheetParser(csvText)
        setRestaurants(parsedRows)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Failed to load restaurants')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
    return () => controller.abort()
  }, [reloadKey])

  return { restaurants, loading, error, retry }
}

export default useRestaurants
